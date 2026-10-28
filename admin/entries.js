import {definitions,defaults} from '../collections.mjs?v=balanced-20261028-final';
const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
export function renderEntrySection({name,entries,baseline,onAction,onChange,onFocus,focus,search='',documents=[]}){
 const def=definitions[name],section=make('section','entry-section');section.dataset.collection=name;
 const toolbar=make('div','collection-toolbar'),intro=make('div');intro.append(make('span','kicker','MANAGE ENTRIES'),make('h2','',def.group));const add=make('button','primary',`+ ${def.add}`);add.type='button';add.disabled=entries.length>=200;add.addEventListener('click',()=>onAction('add',name));toolbar.append(intro,add);section.append(toolbar);
 section.append(make('p','collection-hint','Add an entry, open its details to edit, or use the arrows to change its position. Changes stay in your draft until you publish.'));
 const visible=entries.map((entry,index)=>({entry,index})).filter(({entry})=>!search||Object.values(entry).some(value=>String(value).toLowerCase().includes(search)));
 if(!entries.length)section.append(make('div','empty-collection','No entries yet. Use the Add button to create your first one.'));
 else if(!visible.length)section.append(make('div','empty-collection','No entries match your search.'));
 for(const {entry,index} of visible){
  const before=baseline.find(item=>item.id===entry.id),card=make('article','entry-card');card.dataset.recordId=entry.id;card.tabIndex=-1;
  const header=make('div','entry-heading'),titleArea=make('div'),title=make('h3','',entry.title||entry.label||`Untitled ${def.singular}`);titleArea.append(make('span','entry-number',`${String(index+1).padStart(2,'0')} · ${before?'ENTRY':'NEW ENTRY'}`),title);header.append(titleArea);
  const actions=make('div','entry-actions');
  for(const [action,label,symbol,disabled] of [['up','Move up','↑',index===0],['down','Move down','↓',index===entries.length-1],['delete',`Delete ${def.singular}`,'Delete',false]]){
   const button=make('button',action==='delete'?'delete-entry':'',symbol);button.type='button';button.title=label;button.disabled=disabled;button.setAttribute('aria-label',`${label}: ${entry.title||entry.label}`);button.addEventListener('click',()=>onAction(action,name,entry.id));actions.append(button);
  }
  header.append(actions);card.append(header);
  const details=make('details','record-edit'),summary=make('summary','','Edit details');details.append(summary);details.open=focus?.id===entry.id;
  const body=make('div','record-fields');
  for(const [key,label,type,choices] of def.fields){
   const field=make('div','record-field'),id=`entry-${name}-${entry.id}-${key}`,caption=make('label','',label);caption.htmlFor=id;
   let input;
   if(type==='select'){input=make('select');for(const choice of choices){const option=make('option','',({brief:'Paper summarizer',redactor:'Text redaction',cdn:'Network simulation',green:'Emerald',orange:'Terracotta',purple:'Lavender',retrieval:'Retrieval network',adaptation:'Model adaptation',evidence:'Evidence and answer',nlp:'Research paper',proposal:'PhD proposal'})[choice]||choice);option.value=choice;input.append(option);}input.value=entry[key];}
   else if(type==='boolean'){input=make('input');input.type='checkbox';input.checked=entry[key];field.classList.add('checkbox-field');}
   else if(type==='long'){input=make('textarea');input.rows=key==='title'?3:4;input.value=entry[key];input.maxLength=16000;input.dir='auto';}
   else{input=make('input');input.type='text';input.value=entry[key];input.maxLength=type==='url'?2000:16000;input.dir='auto';if(type==='url'){input.inputMode='url';input.spellcheck=false;input.placeholder='https://… or papers/your-document.pdf';}}
   input.id=id;input.addEventListener(type==='boolean'||type==='select'?'change':'input',()=>{const value=type==='boolean'?input.checked:input.value;onChange(name,entry.id,key,value);card.classList.toggle('changed',!before||JSON.stringify(entry)!==JSON.stringify(before));if(key==='title'||key==='label'){title.textContent=entry.title||entry.label||`Untitled ${def.singular}`;for(const button of actions.children)button.setAttribute('aria-label',`${button.title}: ${entry.title||entry.label}`);}});
   input.addEventListener('focus',()=>onFocus(name,entry.id,key));field.append(caption,input);body.append(field);
   if(name==='papers'&&key==='url'&&documents.length){const library=make('select','document-picker');library.setAttribute('aria-label',`Use an existing PDF for ${entry.title}`);library.append(make('option','','Or choose an existing PDF…'));library.options[0].value='';for(const doc of documents){const option=make('option','',doc.title);option.value=doc.url;library.append(option);}library.addEventListener('change',()=>{if(library.value){input.value=library.value;onChange(name,entry.id,'url',input.value);onChange(name,entry.id,'download',true);onChange(name,entry.id,'linkLabel','Read PDF ↗');onAction('refresh',name,entry.id);}});body.append(library);}
  }
  if(name==='papers')body.append(make('p','entry-help','Paste a PDF, DOI, or website URL, or choose an existing PDF. Deleting this entry keeps the file in your repository.'));
  details.append(body);card.append(details);section.append(card);
 }
 return section;
}
