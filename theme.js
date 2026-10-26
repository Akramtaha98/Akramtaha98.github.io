/* Essential appearance preference only. No analytics, identity, or credentials. */
(() => {
  'use strict';
  const KEY='portfolio-theme',COOKIE='portfolio_theme',allowed=new Set(['system','light','dark']);
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const valid=value=>allowed.has(value)?value:null;
  const cookieValue=()=>{try{return valid(document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.split('=')[1]);}catch{return null;}};
  const storedValue=()=>{try{return valid(localStorage.getItem(KEY));}catch{return null;}};
  let preference=cookieValue()||storedValue()||'system';
  function apply(){
    const resolved=preference==='system'?(media.matches?'dark':'light'):preference;
    document.documentElement.dataset.theme=resolved;
    document.documentElement.dataset.themePreference=preference;
    document.documentElement.style.colorScheme=resolved;
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=resolved==='dark'?'#101b18':'#f6f6ef';
    document.querySelectorAll('[data-theme-control]').forEach(select=>{select.value=preference;});
    document.dispatchEvent(new CustomEvent('portfolio:theme',{detail:{preference,resolved}}));
  }
  function set(value){
    if(!valid(value))return;
    preference=value;
    try{document.cookie=`${COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}catch{}
    try{localStorage.setItem(KEY,value);}catch{}
    apply();
  }
  function bind(){
    document.querySelectorAll('[data-theme-control]').forEach(select=>{select.value=preference;select.addEventListener('change',()=>set(select.value));});
    document.querySelectorAll('[data-reset-preferences]').forEach(button=>button.addEventListener('click',()=>{
      preference='system';
      try{document.cookie=`${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}catch{}
      for(const key of [KEY,'portfolio-study','portfolio-filter','portfolio-language','portfolio-motion']){try{localStorage.removeItem(key);}catch{}}
      apply();document.dispatchEvent(new CustomEvent('portfolio:reset-preferences'));
      const status=document.querySelector('[data-preferences-status]');if(status)status.textContent='Preferences reset. Appearance now follows your device.';
    }));
    apply();
  }
  window.portfolioAppearance={setPreference:set,getPreference:()=>preference,getResolved:()=>document.documentElement.dataset.theme};
  if(media.addEventListener)media.addEventListener('change',()=>{if(preference==='system')apply();});
  else if(media.addListener)media.addListener(()=>{if(preference==='system')apply();});
  window.addEventListener('storage',event=>{if(event.key===KEY){preference=valid(event.newValue)||'system';apply();}});
  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
