import {definitions,legacyKeys,newEntry,moveEntry} from '../collections.mjs?v=balanced-20261028-final';
import {renderEntrySection} from './entries.js?v=balanced-20261028-final';
import {GitHubPublisher,validateContent,restoreDraftContent,contentSignature,OWNER,REPO,decodeContent} from './core.mjs?v=balanced-20261028-final';
const $=selector=>document.querySelector(selector);
const DRAFT_KEY='akram-portfolio-studio-draft-v1';
let schema,baseline,working,publisher=null,remoteSha=null,selectedGroup='Introduction',busy=false,storageOK=true,filter='';
const groups=$('#groups'),fields=$('#fields'),frame=$('#preview'),notice=$('#notice');
const clone=value=>JSON.parse(JSON.stringify(value));
const undoStack=[];
const collectionForGroup=group=>Object.keys(definitions).find(key=>definitions[key].group===group);
function saveUndo(){undoStack.push(clone(working));if(undoStack.length>20)undoStack.shift();}
function entryChanged(name,id,key,value){const entry=working.collections[name].find(item=>item.id===id);if(!entry)return;entry[key]=value;storeDraft();preview();}
function focusRecord(name,id,property){frame.contentWindow?.postMessage({type:'portfolio:highlight-record',collection:name,id,property},location.origin);}
function entryAction(action,name,id){
 if(busy){message('Please wait for the current publishing action to finish.');return;}
 let focusId=id;if(action!=='refresh')saveUndo();
 if(action==='add'){focusId='item-'+(crypto.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));working.collections[name].push(newEntry(name,focusId));filter='';$('#search').value='';}
 else if(action==='delete'){const entry=working.collections[name].find(item=>item.id===id);working.collections[name]=working.collections[name].filter(item=>item.id!==id);focusId=null;message(`Removed ${entry?.title||entry?.label||definitions[name].singular} from your draft. Undo restores it. Publish when you are ready.`);}
 else if(action==='up'||action==='down'){const index=working.collections[name].findIndex(item=>item.id===id);working.collections[name]=moveEntry(working.collections[name],index,action==='up'?-1:1);}
 selectedGroup=definitions[name].group;storeDraft();renderGroups();renderFields(focusId?{collection:name,id:focusId,property:action==='add'?'title':null}:null);preview();
}

const isDirty=()=>working&&contentSignature(working)!==contentSignature(baseline);
function message(text,error=false,link=null){notice.replaceChildren();notice.classList.toggle('error',error);notice.append(document.createTextNode(text));if(link){const a=document.createElement('a');a.href=link.url;a.textContent=link.label;a.target='_blank';a.rel='noopener';notice.append(' ',a);}}
function storeDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify({content:working,savedAt:new Date().toISOString()}));}catch{storageOK=false;}updateStatus();}
function updateStatus(){const changed=isDirty();$('#draft-status').textContent=busy?'Working…':changed?(storageOK?'Draft saved in this browser':'Unsaved draft · export a backup'):'No unpublished changes';$('#publish').disabled=busy||!publisher||!changed;$('#connect-open').textContent=publisher?`Connected · ${OWNER}`:'Connect GitHub';$('#disconnect').hidden=!publisher;$('#undo').disabled=busy||undoStack.length===0;}
function preview(){frame.contentWindow?.postMessage({type:'portfolio:preview',content:working},location.origin);}
function renderGroups(){
 groups.replaceChildren();const names=['All content',...new Set(Object.entries(schema.fields).filter(([key])=>!legacyKeys.has(key)).map(([,field])=>field.group))];
 for(const name of names){const button=document.createElement('button');button.type='button';button.classList.toggle('active',name===selectedGroup);button.setAttribute('aria-pressed',String(name===selectedGroup));button.append(document.createTextNode(name));const count=document.createElement('span');const collection=collectionForGroup(name);count.textContent=collection?`${working.collections[collection].length} entries`:name==='All content'?'':Object.entries(schema.fields).filter(([key,f])=>f.group===name&&!legacyKeys.has(key)).length;button.append(count);button.addEventListener('click',()=>{selectedGroup=name;renderGroups();renderFields();});groups.append(button);}
}
function renderFields(focusKey=null){
 fields.replaceChildren();$('#section-title').textContent=selectedGroup;
 const collection=collectionForGroup(selectedGroup),shown=selectedGroup==='All content'?Object.keys(definitions):collection?[collection]:[];
 const documents=Array.from(new Map([...baseline.collections.papers,...working.collections.papers].filter(item=>/\.pdf(?:[?#]|$)/i.test(item.url)).map(item=>[item.url,{title:item.title,url:item.url}])).values());
 for(const name of shown)fields.append(renderEntrySection({name,entries:working.collections[name],baseline:baseline.collections[name],onAction:entryAction,onChange:entryChanged,onFocus:focusRecord,focus:focusKey?.collection===name?focusKey:null,search:filter,documents}));
 const entries=Object.entries(working.fields).filter(([key,f])=>!legacyKeys.has(key)&&(selectedGroup==='All content'||f.group===selectedGroup)&&(!filter||`${f.value} ${f.label} ${f.type}`.toLowerCase().includes(filter)));
 $('#field-count').textContent=collection?`${working.collections[collection].length} entries`:selectedGroup==='All content'?'Website content':`${entries.length} fields`;
 $('#empty').hidden=entries.length>0||shown.length>0;
 let target=fields;
 if(shown.length&&entries.length){const details=document.createElement('details');details.className='section-copy';details.open=!!focusKey&&typeof focusKey==='string';const summary=document.createElement('summary');summary.textContent=selectedGroup==='All content'?'Other website text':'Section heading and introduction';details.append(summary);target=document.createElement('div');details.append(target);fields.append(details);}
 for(const [key,f] of entries){
  const row=document.createElement('div');row.className='field';row.classList.toggle('changed',f.value!==baseline.fields[key].value);row.dataset.key=key;
  const label=document.createElement('label');label.htmlFor=key;label.append(document.createTextNode(f.label));const type=document.createElement('span');type.textContent=f.type==='url'?'LINK':f.attribute==='aria-label'?'ACCESSIBILITY':'TEXT';label.append(type);
  const input=document.createElement(f.type==='url'||f.value.length<65?'input':'textarea');input.id=key;input.value=f.value;input.dir='auto';input.maxLength=16000;if(f.type==='url'){input.type='text';input.inputMode='url';input.spellcheck=false;}if(input.tagName==='TEXTAREA')input.rows=Math.min(7,Math.max(3,Math.ceil(f.value.length/70)));
  input.addEventListener('input',()=>{working.fields[key].value=input.value;row.classList.toggle('changed',input.value!==baseline.fields[key].value);storeDraft();preview();});
  input.addEventListener('focus',()=>frame.contentWindow?.postMessage({type:'portfolio:highlight',key},location.origin));
  const reset=document.createElement('button');reset.type='button';reset.textContent='Reset this field';reset.addEventListener('click',()=>{input.value=baseline.fields[key].value;working.fields[key].value=input.value;row.classList.remove('changed');storeDraft();preview();});
  row.append(label,input,reset);target.append(row);
 }
 if(focusKey){const selector=typeof focusKey==='string'?focusKey:`entry-${focusKey.collection}-${focusKey.id}-${focusKey.property||'title'}`;const input=document.getElementById(selector);input?.focus({preventScroll:true});input?.scrollIntoView({block:'center',behavior:'smooth'});}
}
function exportBackup(){const blob=new Blob([JSON.stringify(working,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`akram-portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Backup downloaded. It contains your website text and links, never your GitHub token.');}
$('#search').addEventListener('input',e=>{filter=e.target.value.toLowerCase();if(filter)selectedGroup='All content';renderGroups();renderFields();});
$('#export').addEventListener('click',exportBackup);
$('#undo').addEventListener('click',()=>{if(!undoStack.length||busy)return;working=undoStack.pop();storeDraft();renderGroups();renderFields();preview();message('The last entry action was undone. Review your draft before publishing.');});
$('#import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5_000_000)throw new Error('This file is too large for a portfolio backup.');const clean=validateContent(JSON.parse(await file.text()),schema);if(isDirty()&&!confirm('Replace the current draft with this backup? Export your draft first if you want to keep it.'))return;saveUndo();working=clean;storeDraft();renderGroups();renderFields();preview();message('Backup loaded as a draft. Review your changes before publishing.');}catch(error){message(error.message,true);}finally{event.target.value='';}});
$('#connect-open').addEventListener('click',()=>{if(!publisher)$('#connection').showModal();else message('GitHub is connected for this session. Make your changes, then choose Publish changes.');});
$('#connection').addEventListener('close',()=>{$('#token').value='';$('#connection-error').textContent='';});
$('#connect').addEventListener('click',async()=>{
 const button=$('#connect');button.disabled=true;$('#connection-error').textContent='';
 try{
  const candidate=new GitHubPublisher($('#token').value);$('#token').value='';const {file}=await candidate.connect();validateContent(file.content,schema);
  if(contentSignature(file.content)!==contentSignature(baseline))throw new Error('There is a newer version on GitHub. Close this window, export your draft if needed, and choose Load latest content before connecting again.');
  publisher=candidate;remoteSha=file.sha;$('#connection').close();message(`Connected to ${OWNER}/${REPO}. Publishing will save your changes to GitHub and start a Pages deployment.`);updateStatus();
 }catch(error){$('#connection-error').textContent=error.message;}
 finally{button.disabled=false;}
});
$('#disconnect').addEventListener('click',()=>{publisher=null;remoteSha=null;$('#token').value='';updateStatus();message('Disconnected. Your content draft remains in this browser; the GitHub token has been cleared from the editor session.');});
$('#latest').addEventListener('click',async()=>{
 if(busy)return;if(isDirty()&&!confirm('Replace this draft with the latest GitHub content? Choose Cancel and export a backup first if you want to keep it.'))return;
 busy=true;updateStatus();try{
  let file;if(publisher)file=await publisher.read();else{const response=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/content.json?ref=main`,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw new Error('Could not load the latest GitHub version. Try again shortly.');const raw=await response.json();file={sha:raw.sha,content:decodeContent(raw.content)};}
  const clean=validateContent(file.content,schema);baseline=clone(clean);working=clone(clean);remoteSha=file.sha;undoStack.length=0;try{localStorage.removeItem(DRAFT_KEY);}catch{}renderGroups();renderFields();preview();message('Latest GitHub content loaded. You can start a new draft.');
 }catch(error){message(error.message,true);}finally{busy=false;updateStatus();}
});
$('#publish').addEventListener('click',async()=>{
 if(!publisher||busy||!isDirty())return;
 busy=true;updateStatus();message('Saving your changes to GitHub…');
 try{
  const snapshot=validateContent(clone(working),schema),result=await publisher.publish(snapshot,remoteSha,schema);
  remoteSha=result.content.sha;baseline=clone(snapshot);storeDraft();renderFields();
  message('Saved to GitHub. GitHub Pages is publishing the update; allow a minute or two before refreshing your public website.',false,{url:`https://github.com/${OWNER}/${REPO}/actions`,label:'Check publishing status ↗'});
 }catch(error){message(error.message,true);}finally{busy=false;updateStatus();}
});
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow)return;if(event.data?.type==='portfolio:ready'&&working)preview();if(event.data?.type==='portfolio:select-record'&&definitions[event.data.collection]&&working?.collections[event.data.collection].some(entry=>entry.id===event.data.id)){selectedGroup=definitions[event.data.collection].group;filter='';$('#search').value='';renderGroups();renderFields({collection:event.data.collection,id:event.data.id,property:event.data.property});}if(event.data?.type==='portfolio:select'&&schema?.fields[event.data.key]){selectedGroup=schema.fields[event.data.key].group;filter='';$('#search').value='';renderGroups();renderFields(event.data.key);}});
window.addEventListener('beforeunload',event=>{if(isDirty()&&!storageOK){event.preventDefault();event.returnValue='';}});
async function init(){
 document.body.classList.add('loading');try{
  const response=await fetch('../content.json',{cache:'no-cache'});if(!response.ok)throw new Error('Could not load your website content. Refresh to try again.');schema=await response.json();baseline=validateContent(schema,schema);working=clone(baseline);
  try{const saved=localStorage.getItem(DRAFT_KEY);if(saved){working=restoreDraftContent(JSON.parse(saved).content,schema);if(isDirty())message('Your previous draft has been restored. It has not been published.');}}catch{message('An older draft could not be restored. The published content has been loaded instead.',true);working=clone(baseline);}
  renderGroups();renderFields();preview();updateStatus();
 }catch(error){message(error.message,true);$('#draft-status').textContent='Content unavailable';document.querySelectorAll('aside button,aside input').forEach(el=>el.disabled=true);}finally{document.body.classList.remove('loading');}
}
init();
function sizePreview(){const shell=document.querySelector('.frame-shell');if(!shell.clientWidth)return;const target=Number($('#preview-width').value)||1120;const scale=Math.min(shell.clientWidth/target,1);frame.style.width=`${target}px`;frame.style.height=`${shell.clientHeight/scale}px`;frame.style.transform=`scale(${scale})`;frame.style.left=`${Math.max(0,(shell.clientWidth-target*scale)/2)}px`;}
new ResizeObserver(sizePreview).observe(document.querySelector('.frame-shell'));
$('#preview-width').addEventListener('change',sizePreview);
$('#preview-toggle').addEventListener('click',()=>{const open=$('#preview-toggle').getAttribute('aria-expanded')!=='true';$('#preview-toggle').setAttribute('aria-expanded',String(open));$('#preview-toggle').textContent=open?'Hide page preview':'Show page preview';document.body.classList.toggle('show-mobile-preview',open);if(open){$('#preview-width').value='390';sizePreview();document.querySelector('#studio-preview').scrollIntoView({block:'start',behavior:'smooth'});}});
