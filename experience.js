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
