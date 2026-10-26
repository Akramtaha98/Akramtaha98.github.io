/* Public rendering only. GitHub credentials never enter this page. */
(() => {
  const originalKeys = new Map();
  document.querySelectorAll('[data-copy]').forEach(el => originalKeys.set(el.textContent, el.dataset.copy));
  let current = null, collectionAPI=null;
  const renderedCollections=new Map();
  const collectionModule=import('./collections.mjs?v=projects-20261026');
  const seoModule = import('./seo.mjs?v=projects-20261026');
  const safeURL = value => {
    try { return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value, location.href).protocol); }
    catch { return false; }
  };
  function apply(data) {
    if (!data || data.version !== 1 || !data.fields) return;
    current = data;
    if(collectionAPI){
      const collections=collectionAPI.getCollections(data),changed=[];
      const selectedStudy=document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.study;
      for(const [name,entries] of Object.entries(collections)){
        const signature=JSON.stringify(entries);if(renderedCollections.get(name)===signature)continue;
        const container=document.querySelector(`[data-collection-container="${name}"]`);if(!container)continue;
        const parsed=new DOMParser().parseFromString(collectionAPI.renderCollection(name,entries),'text/html');
        container.replaceChildren(...Array.from(parsed.body.childNodes));renderedCollections.set(name,signature);changed.push(name);
        if(name==='profiles'){const footer=document.querySelector('[data-profile-footer]');if(footer){const footerHTML=new DOMParser().parseFromString(collectionAPI.renderProfileFooter(entries),'text/html');footer.replaceChildren(...Array.from(footerHTML.body.childNodes));}}
      }
      if(changed.length)document.dispatchEvent(new CustomEvent('portfolio:collections',{detail:{names:changed,selectedStudy}}));
    }
    for (const [attribute, property] of [['data-copy','textContent'],['data-title','textContent'],['data-url','href'],['data-label','aria-label'],['data-meta','content'],['data-value','value']]) {
      document.querySelectorAll(`[${attribute}]`).forEach(el => {
        const field = data.fields[el.getAttribute(attribute)];
        if (!field || typeof field.value !== 'string') return;
        if (property === 'href' && !safeURL(field.value)) return;
        if (property === 'textContent') el.textContent = field.value;
        else if (property === 'value') el.value = data.fields[`lab-query-${el.lang}`]?.value ?? field.value;
        else el.setAttribute(property, field.value);
      });
    }
    const title=data.fields['field-002']?.value,description=data.fields['field-001']?.value,name=data.fields['seo-name']?.value;
    for(const tag of document.querySelectorAll('meta[property],meta[name^="twitter:"]')) {
      const key=tag.getAttribute('property')||tag.getAttribute('name');
      if(['og:title','twitter:title'].includes(key)&&title)tag.content=title;
      if(['og:description','twitter:description'].includes(key)&&description)tag.content=description;
      if(key==='og:site_name'&&name)tag.content=name;
    }
    seoModule.then(({profileJSON})=>{const graph=document.getElementById('profile-structured-data');if(graph)graph.textContent=profileJSON(data);}).catch(()=>{});
    document.dispatchEvent(new CustomEvent('site:content'));
  }
  window.siteFieldValue = (key, fallback) => current?.fields[key]?.value ?? fallback;
  window.siteCopy = original => window.siteFieldValue(originalKeys.get(original), original);
  const loadContent=fetch('content.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Content unavailable');return r.json();});
  window.siteContentReady=Promise.all([loadContent,collectionModule]).then(([data,module])=>{collectionAPI=module;apply(data);}).catch(()=>{ /* Static HTML remains usable if content cannot load. */ });
  const preview = new URLSearchParams(location.search).get('preview') === '1' && parent !== window;
  if (preview) {
    document.documentElement.classList.add('editor-preview');
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== parent) return;
      if (event.data?.type === 'portfolio:preview') apply(event.data.content);
      if(event.data?.type==='portfolio:highlight-record'){
        const {collection,id,property}=event.data;
        if(collection==='studies')document.querySelectorAll('[data-study]').forEach(tab=>{if(tab.dataset.study===id)tab.click();});
        const item=Array.from(document.querySelectorAll('[data-collection-item]')).find(el=>el.dataset.collectionItem===collection&&el.dataset.recordId===id&&el.getAttribute('role')!=='tab');
        const target=Array.from(item?.querySelectorAll('[data-record-field]')||[]).find(el=>el.dataset.recordField===property)||item;
        document.querySelectorAll('.editing-selected').forEach(el=>el.classList.remove('editing-selected'));if(target){target.classList.add('editing-selected');for(let node=target.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;target.scrollIntoView({block:'center',behavior:'smooth'});}
      }
      if (event.data?.type === 'portfolio:highlight'  && typeof event.data.key === 'string') {
        document.querySelectorAll('.editing-selected').forEach(el => el.classList.remove('editing-selected'));
        const el = Array.from(document.querySelectorAll('[data-copy],[data-url]')).find(el => el.dataset.copy === event.data.key || el.dataset.url === event.data.key);
        if (el) { el.classList.add('editing-selected');for(let node=el.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true; el.closest('[hidden]')?.removeAttribute('hidden'); el.scrollIntoView({block:'center',behavior:'smooth'}); }
      }
    });
    document.addEventListener('click', event => {
      if(event.target.closest('[role="tab"]'))return;
      const record=event.target.closest('[data-collection-item]');
      if(record){const property=event.target.closest('[data-record-field]')?.dataset.recordField||'title';event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'portfolio:select-record',collection:record.dataset.collectionItem,id:record.dataset.recordId,property},location.origin);return;}
      const el = event.target.closest('[data-copy],[data-url]');
      if (el) { event.preventDefault(); event.stopImmediatePropagation(); parent.postMessage({type:'portfolio:select',key:el.dataset.copy || el.dataset.url}, location.origin); }
      else if (event.target.closest('a')) event.preventDefault();
    }, true);
    window.siteContentReady.then(() => parent.postMessage({type:'portfolio:ready'}, location.origin));
  }
})();
