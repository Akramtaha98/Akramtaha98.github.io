/* A small, keyboard-accessible shortcut dock. No content or credentials stored. */
window.siteContentReady.finally(()=>{
 const dock=document.querySelector('.explore-dock');
 if(!dock)return;
 let scheduled=false;
 function update(){scheduled=false;dock.classList.toggle('visible',scrollY>Math.min(innerHeight*.6,480));}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
 window.addEventListener('resize',update);update();
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)dock.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-10% 0px -65% 0px'});
 document.querySelectorAll('section[id]').forEach(section=>observer.observe(section));
});
// Deep links reveal optional research details before navigating.
function revealResearchTarget(hash){let target;try{target=document.querySelector(hash);}catch{return;}if(!target)return;for(let node=target.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;}
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(link&&link.hash.length>1)revealResearchTarget(link.hash);});
window.addEventListener('hashchange',()=>{if(location.hash.length>1){revealResearchTarget(location.hash);try{document.querySelector(location.hash)?.scrollIntoView();}catch{}}});
if(location.hash.length>1)revealResearchTarget(location.hash);
