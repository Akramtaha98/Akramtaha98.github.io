/* Bounded scene choreography, native scroll, and a shared motion preference. */
window.siteContentReady.finally(()=>{
 const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)');
 const scenes=new Set(),visible=new Set(),seen=new WeakSet(),effects=new Set();
 root.dataset.sceneController='ready';
 const allowed=()=>!media.matches&&root.dataset.motion!=='paused'&&!document.hidden;
 let requestScroll=()=>{};
 function sync(){requestScroll();for(const scene of scenes)scene.classList.toggle('scene-running',allowed()&&visible.has(scene));if(!allowed())for(const effect of effects){effect.finish();effects.delete(effect);}}
 function play(target,frames,delay=0,duration=750){
  const effect=target.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)'});
  effects.add(effect);effect.finished.finally(()=>effects.delete(effect));
 }
 function enter(target){
  if(seen.has(target)||!allowed())return;seen.add(target);
  if(target.matches('.research-card')){
   const preview=target.querySelector('.project-preview'),title=target.querySelector('h3'),summary=target.querySelector('p');
   if(preview)play(preview,[{clipPath:'inset(0 0 85% 0 round 12px)',opacity:.7},{clipPath:'inset(0 0 0 0 round 12px)',opacity:1}],0,900);
   if(title)play(title,[{transform:'translateY(26px)',opacity:.6},{transform:'translateY(0)',opacity:1}],70);
   if(summary)play(summary,[{transform:'translateY(18px)',opacity:.65},{transform:'translateY(0)',opacity:1}],140);
  }else if(target.matches('.publication-list article')){
   const title=target.querySelector('h3');if(title)play(title,[{transform:'translateX(35px)',opacity:.6},{transform:'translateX(0)',opacity:1}]);
   const text=target.querySelector('p');if(text)play(text,[{transform:'translateY(16px)',opacity:.7},{transform:'translateY(0)',opacity:1}],90);
  }else if(target.matches('h2')){
   play(target,[{transform:'translateY(28px)',opacity:.6},{transform:'translateY(0)',opacity:1}],0,850);
  }else if(target.matches('.credentials>div'))play(target,[{transform:'translateX(25px)',opacity:.6},{transform:'translateX(0)',opacity:1}]);
 }
 const io=new IntersectionObserver(entries=>{for(const entry of entries){const el=entry.target;if(entry.isIntersecting){visible.add(el);enter(el);}else visible.delete(el);}sync();},{threshold:.12});
 function bind(){
  for(const scene of document.querySelectorAll('.network,.research-card,.publication-list article,.credentials>div,.section-heading h2,.about h2,.contact-section h2'))if(!scenes.has(scene)){scenes.add(scene);io.observe(scene);}
  for(const scene of [...scenes])if(!scene.isConnected){io.unobserve(scene);scenes.delete(scene);visible.delete(scene);}
 }
 let scrollFrame=null;
 function updateScroll(){
  scrollFrame=null;
  const enabled=allowed(),small=matchMedia('(max-width:700px)').matches;
  for(const scene of scenes){
   if(scene.matches('.research-card')){
    const preview=scene.querySelector('.project-preview');if(!preview)continue;
    if(!enabled||!visible.has(scene)){preview.style.removeProperty('--scroll-y');preview.style.removeProperty('--scroll-scale');continue;}
    const rect=scene.getBoundingClientRect(),progress=Math.max(-1,Math.min(1,(rect.top+rect.height/2-innerHeight/2)/(innerHeight*.65)));
    preview.style.setProperty('--scroll-y',`${progress*(small?10:22)}px`);
    preview.style.setProperty('--scroll-scale',`${1-Math.abs(progress)*.045}`);
   }
  }
  const network=document.querySelector('.hero .network');
  if(network){const hero=document.querySelector('.hero').getBoundingClientRect(),progress=enabled?Math.max(0,Math.min(1,-hero.top/(hero.height||1))):0;network.style.setProperty('--hero-travel',`${progress*-32}px`);network.style.setProperty('--hero-scale',`${1-progress*.055}`);}
 }
 requestScroll=()=>{if(scrollFrame===null)scrollFrame=requestAnimationFrame(updateScroll);};
 window.addEventListener('scroll',requestScroll,{passive:true});window.addEventListener('resize',requestScroll);
 bind();document.addEventListener('portfolio:collections',bind);
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-motion']});
 media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!allowed())return;
  const preview=event.target.closest('.project-preview');if(!preview)return;
  const rect=preview.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
  preview.style.setProperty('--scene-x',`${-y*9}deg`);preview.style.setProperty('--scene-y',`${x*9}deg`);preview.style.setProperty('--scene-pan',`${x*5}px`);
 },{passive:true});
 document.addEventListener('pointerout',event=>{const preview=event.target.closest?.('.project-preview');if(preview&&!preview.contains(event.relatedTarget)){preview.style.removeProperty('--scene-x');preview.style.removeProperty('--scene-y');preview.style.removeProperty('--scene-pan');}});
 sync();
});
