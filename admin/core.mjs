import {getCollections,validateCollections,assertReady,legacyKeys} from '../collections.mjs?v=balanced-20261028-final';
import {renderPublishedHTML} from '../seo.mjs?v=balanced-20261028-final';
export const OWNER = 'Akramtaha98';
export const REPO = 'Akramtaha98.github.io';
export const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
export function safeURL(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try { return ['https:','http:','mailto:','tel:'].includes(new URL(value, 'https://akramtaha98.github.io/').protocol); }
  catch { return false; }
}
export function validateContent(candidate, schema, options={}) {
  if (!candidate || candidate.version !== 1 || !candidate.fields || typeof candidate.fields !== 'object') throw new Error('Choose a valid portfolio content backup.');
  const keys = Object.keys(schema.fields), incoming = Object.keys(candidate.fields);
  if (keys.length !== incoming.length || incoming.some(key => !Object.hasOwn(schema.fields,key))) throw new Error('This backup does not match this version of the website.');
  const clean = {version:1,fields:{}};
  for (const key of keys) {
    const base = schema.fields[key], value = candidate.fields[key]?.value;
    if (typeof value !== 'string' || value.length > 16000) throw new Error(`Invalid text in ${base.label}.`);
    if (base.type === 'url' && !options.draft && !safeURL(value)) throw new Error(`Use a valid web or email link for ${base.label}.`);
    clean.fields[key] = {...base,value};
  }
  clean.collections=validateCollections(getCollections({...candidate,fields:clean.fields}),options);
  return clean;
}
export function restoreDraftContent(candidate,schema) {
  if(!candidate || candidate.version!==1 || !candidate.fields || typeof candidate.fields!=='object')throw new Error('Invalid saved draft.');
  return validateContent({...candidate,fields:{...schema.fields,...candidate.fields}},schema,{draft:true});
}
export function contentSignature(content) {
  return JSON.stringify({fields:Object.keys(content.fields).filter(key=>!legacyKeys.has(key)).sort().map(key=>[key,content.fields[key].value]),collections:validateCollections(getCollections(content),{draft:true})});
}
export function encodeContent(content) {
  const bytes = new TextEncoder().encode(JSON.stringify(content,null,2)+'\n');
  let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
export function decodeText(base64) {
  const bytes=Uint8Array.from(atob(base64.replace(/\s/g,'')),c=>c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
export function decodeContent(base64) { return JSON.parse(decodeText(base64)); }
export class GitHubPublisher {
  #token; #fetch;
  constructor(token, transport=fetch) { this.#token=token.trim();this.#fetch=transport;if(!this.#token)throw new Error('Enter a GitHub access token to connect.'); }
  async request(path,options={}) {
    const response=await this.#fetch(path.startsWith('/')?`https://api.github.com${path}`:(path ? `${API}/${path}` : API),{
      ...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${this.#token}`,...options.headers}
    });
    if(!response.ok){
      const messages={401:'GitHub did not accept this token. Check it or create a new one.',403:'GitHub denied access. The token needs Contents: read and write for this repository. You may also have reached a GitHub API rate limit.',404:'GitHub could not access this repository. Check the token’s selected repository.',409:'The website changed since you loaded it. Export your draft, then load the latest version before publishing.',422:'GitHub could not save this update. Reload the latest content and try again.'};
      throw new Error(messages[response.status] || `GitHub returned ${response.status}. Please try again.`);
    }
    return response.json();
  }
  async connect() {
    const user=await this.request('/user');
    if(user.login.toLowerCase()!==OWNER.toLowerCase())throw new Error(`Sign in with the ${OWNER} GitHub account to publish this portfolio.`);
    const repo=await this.request('');
    if(!repo.permissions?.push)throw new Error('This account does not have permission to update the portfolio repository.');
    return {user, file:await this.read()};
  }
  async read(ref='main') {const file=await this.request(`contents/content.json?ref=${encodeURIComponent(ref)}`);return {sha:file.sha,content:decodeContent(file.content)};}
  async publish(content,expectedSha,schema) {
    const clean=validateContent(content,schema);
    assertReady(clean.collections);
    const head=await this.request('git/ref/heads/main');
    const parent=head.object.sha;
    const latest=await this.read(parent);
    if(!expectedSha || latest.sha!==expectedSha)throw new Error('The website changed since you connected. Export your draft and load the latest content before publishing.');
    const template=await this.request(`contents/index.html?ref=${encodeURIComponent(parent)}`);
    const html=renderPublishedHTML(decodeText(template.content),clean);
    const base=await this.request(`git/commits/${parent}`);
    const post=(path,body)=>this.request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const tree=await post('git/trees',{base_tree:base.tree.sha,tree:[
      {path:'content.json',mode:'100644',type:'blob',content:JSON.stringify(clean,null,2)+'\n'},
      {path:'index.html',mode:'100644',type:'blob',content:html}
    ]});
    const commit=await post('git/commits',{message:'Update portfolio content and search metadata from dashboard',tree:tree.sha,parents:[parent]});
    await this.request('git/refs/heads/main',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({sha:commit.sha,force:false})});
    const saved=await this.read(commit.sha);
    return {content:{sha:saved.sha},commit};
  }
}
