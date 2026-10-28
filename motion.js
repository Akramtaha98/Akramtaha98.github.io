/* Bounded scene choreography, native scroll, and a shared motion preference. */
window.siteContentReady.finally(()=>{
 const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)');
 const scenes=new Set(),visible=new Set(),seen=new WeakSet(),effects=new Set();
 root.dataset.sceneController='ready';
 const allowed=()=>!media.matches&&root.dataset.motion!=='paused'&&!document.hidden;
 function sync(){for(const scene of scenes)scene.classList.toggle('scene-running',allowed()&&visible.has(scene));if(!allowed())for(const effect of effects){effect.finish();effects.delete(effect);}}
 function enter(target){
  if(seen.has(target)||!allowed())return;seen.add(target);
  const isPaper=target.matches('.publication-list article');
  const effect=target.animate(isPaper?[{transform:'translateX(18px)',opacity:.55},{transform:'translateX(0)',opacity:1}]:[{transform:'translateY(20px) scale(.98)',opacity:.65},{transform:'translateY(0) scale(1)',opacity:1}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
  effects.add(effect);effect.finished.finally(()=>effects.delete(effect));
 }
 const io=new IntersectionObserver(entries=>{for(const entry of entries){const el=entry.target;if(entry.isIntersecting){visible.add(el);enter(el);}else visible.delete(el);}sync();},{threshold:.12});
 function bind(){
  for(const scene of document.querySelectorAll('.network,.research-card,.publication-list article,.credentials>div'))if(!scenes.has(scene)){scenes.add(scene);io.observe(scene);}
  for(const scene of [...scenes])if(!scene.isConnected){io.unobserve(scene);scenes.delete(scene);visible.delete(scene);}
 }
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
