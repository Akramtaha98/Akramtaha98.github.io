window.siteContentReady.finally(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const copy = value => window.siteCopy(value);
  const field = (key, fallback) => window.siteFieldValue(key, fallback);
  const canvas = document.querySelector('#network'), ctx = canvas.getContext('2d');
  let nodes = [], width = 0, height = 0, tick = 0, frame = null, inView = true;
  function reset() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    nodes = Array.from({length:60}, (_,i) => {
      const angle = i/60*Math.PI*2, radius = 35+Math.random()*Math.min(width*.35,160);
      return {x:width/2+Math.cos(angle)*radius,y:height/2+Math.sin(angle)*radius*.8,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,r:Math.random()*1.8+.6};
    });
  }
  function paint() {
    ctx.clearRect(0,0,width,height); tick++;
    const glow = ctx.createRadialGradient(width*.5,height*.5,10,width*.5,height*.5,width*.6);
    glow.addColorStop(0,'#4e986744');glow.addColorStop(1,'#142e2b00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    ctx.strokeStyle='#89ad880e';ctx.lineWidth=.5;
    for(let x=0;x<width;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
    for(let y=0;y<height;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    nodes.forEach((n,i) => {
      if(!reduce){n.x+=n.vx;n.y+=n.vy;if(n.x<30||n.x>width-30)n.vx*=-1;if(n.y<70||n.y>height-80)n.vy*=-1;}
      nodes.slice(i+1).forEach(m=>{const d=Math.hypot(n.x-m.x,n.y-m.y);if(d<95){ctx.strokeStyle=`rgba(148,185,127,${(1-d/95)*.32})`;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();}});
      ctx.fillStyle=i%8===0?'#e2d89d':'#8ebb99';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();
      if(i%13===0){const pulse=reduce?5:5+Math.sin(tick*.025+i)*3;ctx.strokeStyle='#c1d59544';ctx.beginPath();ctx.arc(n.x,n.y,pulse,0,Math.PI*2);ctx.stroke();}
    });
  }
  function loop(){paint();frame=!reduce&&inView&&!document.hidden?requestAnimationFrame(loop):null;}
  function resume(){if(!frame)loop();}
  reset();resume();
  new ResizeObserver(()=>{reset();if(reduce)paint();}).observe(canvas);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)resume();else if(frame){cancelAnimationFrame(frame);frame=null;}}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=null;}else if(!document.hidden&&inView)resume();});
  document.querySelector('#regenerate').addEventListener('click',()=>{reset();paint();});
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
  function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const revealTargets=document.querySelectorAll('.research-card,.section-heading,.study-section,.demo,.publication-list article,.about-mark,.profile-grid>a,.credentials>div');
  if(!reduce && !document.documentElement.classList.contains('editor-preview')){
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}),{threshold:.06});
    revealTargets.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${i%3*65}ms`);reveal.observe(el);});
  }
  const progress=document.querySelector('.reading-progress');
  window.addEventListener('scroll',()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;},{passive:true});
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('nav a,.section-tabs a').forEach(a=>{const active=a.getAttribute('href')===`#${entry.target.id}`;if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('section[id]').forEach(el=>sectionObserver.observe(el));
  const tabs=Array.from(document.querySelectorAll('[data-study]'));
  function activateTab(button,focus=false){tabs.forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});if(focus)button.focus();}
  tabs.forEach((button,i)=>{button.addEventListener('click',()=>activateTab(button));button.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();activateTab(tabs[n],true);}});});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    document.querySelectorAll('[data-category]').forEach(article=>{article.hidden=button.dataset.filter!=='all'&&article.dataset.category!==button.dataset.filter;if(!article.hidden)article.classList.add('is-visible');});
  }));
  const query=document.querySelector('#query'),result=document.querySelector('#demo-result'),status=document.querySelector('#demo-status');
  let lang='en',busy=false;
  function statusText(key,fallback){status.textContent=field(key,fallback);}
  function selectLanguage(value){lang=value;query.lang=lang;query.dir=lang==='ar'?'rtl':'ltr';query.value=field(`lab-query-${lang}`,{en:'What is retrieval-augmented generation?',ar:'ما هو التوليد المعزز بالاسترجاع؟',ms:'Apakah penjanaan berasaskan dapatan semula?'}[lang]);document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===lang);b.setAttribute('aria-pressed',String(b.dataset.lang===lang));});}
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{if(busy)return;selectLanguage(button.dataset.lang);statusText('lab-ready','Choose a question, then run the walkthrough.');}));
  async function run(){
    if(busy)return;
    if(!query.value.trim()){statusText('lab-empty','Enter a question to explore the example.');query.focus();return;}
    busy=true;const runButton=document.querySelector('#retrieve');runButton.disabled=true;result.setAttribute('aria-busy','true');
    const stages=Array.from(document.querySelectorAll('.pipeline span'));
    stages.forEach(s=>s.classList.remove('selected'));
    for(let i=0;i<stages.length;i++){stages[i].classList.add('selected');statusText(`lab-stage-${i}`,['Reading the question…','Retrieving example evidence…','Grounding the illustrative answer…'][i]);if(!reduce)await new Promise(resolve=>setTimeout(resolve,420));}
    const titles={en:['Connect the model to external knowledge','Ground the answer in context'],ar:['ربط النموذج بمصادر المعرفة الخارجية','توليد الإجابة بالاعتماد على السياق'],ms:['Hubungkan model dengan pengetahuan luaran','Asaskan jawapan pada konteks']};
    result.querySelectorAll('strong').forEach((el,i)=>{el.textContent=field(`lab-result-${lang}-${i}`,copy(titles[lang][i]));el.dir=lang==='ar'?'rtl':'ltr';el.lang=lang;});
    statusText('lab-complete','Example complete · 2 illustrative passages · no live model call');
    if(!reduce)result.animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
    result.removeAttribute('aria-busy');runButton.disabled=false;busy=false;
  }
  document.querySelector('#retrieve').addEventListener('click',run);query.addEventListener('keydown',event=>{if(event.key==='Enter')run();});
});
