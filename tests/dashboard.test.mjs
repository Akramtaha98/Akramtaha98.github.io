import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {GitHubPublisher,validateContent,contentSignature,encodeContent,decodeContent,safeURL,API} from '../admin/core.mjs';
const schema=JSON.parse(readFileSync(new URL('../content.json',import.meta.url),'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
test('Arabic, Malay, and all editable content survive the GitHub UTF-8/Base64 round trip',()=>{assert.deepEqual(decodeContent(encodeContent(schema)),schema);assert.equal(contentSignature(validateContent(schema,schema)),contentSignature(schema));});
test('untrusted imports cannot change field types, add fields, or publish script URLs',()=>{const urlKey=Object.keys(schema.fields).find(k=>schema.fields[k].type==='url');const bad=clone(schema);bad.fields[urlKey].value='javascript:alert(1)';assert.throws(()=>validateContent(bad,schema),/valid web/);for(const badURL of ['data:text/html,bad','javascript:alert(1)','vbscript:msgbox(1)'])assert.equal(safeURL(badURL),false);assert.equal(safeURL('https://orcid.org/0009-0002-4020-8060'),true);const extra=clone(schema);extra.fields.unexpected={value:'extra'};assert.throws(()=>validateContent(extra,schema),/does not match/);const wrong=clone(schema);wrong.fields[urlKey].type='text';assert.equal(validateContent(wrong,schema).fields[urlKey].type,'url');});
test('plain text HTML stays text and is not inserted as HTML',()=>{const textKey=Object.keys(schema.fields).find(k=>schema.fields[k].type==='text'),modified=clone(schema);modified.fields[textKey].value='<img src=x onerror=alert(1)>';assert.equal(validateContent(modified,schema).fields[textKey].value,'<img src=x onerror=alert(1)>');const renderer=readFileSync(new URL('../content.js',import.meta.url),'utf8');assert.ok(!renderer.includes('innerHTML'));assert.ok(renderer.includes('el.textContent = field.value'));});
test('publishing atomically saves crawlable HTML and content on a revision-checked commit',async()=>{
 const template=readFileSync(new URL('../index.html',import.meta.url),'utf8'),calls=[];
 const encodedText=Buffer.from(template).toString('base64');
 const transport=async(url,options)=>{
  calls.push({url,options});
  if(url.endsWith('/git/ref/heads/main'))return response({object:{sha:'head-sha'}});
  if(url.includes('/contents/content.json?ref='))return response({sha:url.endsWith('new-commit')?'saved-sha':'old-sha',content:encodeContent(schema)});
  if(url.includes('/contents/index.html?ref='))return response({content:encodedText});
  if(url.endsWith('/git/commits/head-sha'))return response({tree:{sha:'base-tree'}});
  if(url.endsWith('/git/trees'))return response({sha:'new-tree'});
  if(url.endsWith('/git/commits'))return response({sha:'new-commit'});
  if(url.endsWith('/git/refs/heads/main'))return response({object:{sha:'new-commit'}});
  return response({},404);
 };
 const client=new GitHubPublisher('test-token-only',transport),result=await client.publish(schema,'old-sha',schema);
 assert.equal(result.content.sha,'saved-sha');
 const tree=JSON.parse(calls.find(c=>c.url.endsWith('/git/trees')).options.body);
 assert.equal(tree.base_tree,'base-tree');assert.deepEqual(tree.tree.map(f=>f.path),['content.json','index.html']);assert.deepEqual(JSON.parse(tree.tree[0].content),schema);assert.match(tree.tree[1].content,/ProfilePage/);
 const update=calls.find(c=>c.options.method==='PATCH');assert.deepEqual(JSON.parse(update.options.body),{sha:'new-commit',force:false});
 const commit=JSON.parse(calls.find(c=>c.url.endsWith('/git/commits')).options.body);assert.deepEqual(commit.parents,['head-sha']);
 for(const call of calls){assert.equal(new URL(call.url).origin,'https://api.github.com');assert.equal(call.options.headers.Authorization,'Bearer test-token-only');assert.ok(!String(call.options.body).includes('test-token-only'));}
});
test('concurrent remote edits block publication without a write',async()=>{let writes=0;const client=new GitHubPublisher('dummy',async(url,options)=>{if(options.method)writes++;if(url.endsWith('/git/ref/heads/main'))return response({object:{sha:'head'}});return response({sha:'someone-else-edited',content:encodeContent(schema)});});await assert.rejects(client.publish(schema,'old-sha',schema),/changed since/);assert.equal(writes,0);});
test('unauthorized accounts and rejected tokens cannot connect',async()=>{let calls=0;const wrongAccount=new GitHubPublisher('dummy',async()=>{calls++;return response({login:'someone-else'});});await assert.rejects(wrongAccount.connect(),/Akramtaha98/);assert.equal(calls,1);const invalid=new GitHubPublisher('dummy',async()=>response({},401));await assert.rejects(invalid.connect(),/did not accept/);});
test('every HTML copy field and local file link exists',()=>{const markup=readFileSync(new URL('../index.html',import.meta.url),'utf8');const keys=Array.from(markup.matchAll(/data-(?:copy|url|label|value|meta|title)="([^"]+)"/g),m=>m[1]);for(const key of keys)assert.ok(schema.fields[key],key);for(const match of markup.matchAll(/(?:href|src)="([^"]+)"/g)){const link=match[1];if(!/^(https?:|mailto:|#)/.test(link))assert.ok(existsSync(new URL('../'+link.split('?')[0],import.meta.url)),link);}assert.ok(Object.values(schema.fields).some(f=>f.value==='https://orcid.org/0009-0002-4020-8060'));});
test('the editor stores drafts but never persists its session credential',()=>{const code=readFileSync(new URL('../admin/admin.js',import.meta.url),'utf8');assert.match(code,/localStorage\.setItem\(DRAFT_KEY,JSON\.stringify\(\{content:working,savedAt:/);assert.ok(!/localStorage[^\n]*(?:token|publisher)|sessionStorage/.test(code));assert.ok(!readFileSync(new URL('../admin/core.mjs',import.meta.url),'utf8').includes('localStorage'));});

test('owner connection reads the exact repository endpoint without a trailing slash',async()=>{const seen=[];const client=new GitHubPublisher('dummy',async(url)=>{seen.push(url);if(url==='https://api.github.com/user')return response({login:'Akramtaha98'});if(url===API)return response({permissions:{push:true}});if(url===`${API}/contents/content.json?ref=main`)return response({sha:'remote-sha',content:encodeContent(schema)});return response({},404);});const connection=await client.connect();assert.equal(connection.file.sha,'remote-sha');assert.equal(seen.length,3);assert.equal(seen[1],API);});
