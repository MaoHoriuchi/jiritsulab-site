/* ================================================
   じりつLABO — App.js
   NeedNap × Osaka Geidai Fusion
   GSAP + ScrollTrigger + SplitType + Particles
   ================================================ */
gsap.registerPlugin(ScrollTrigger);

/* --- LOADER --- */
(function loader(){
  const bar=document.querySelector('.loader-progress');
  const pct=document.querySelector('.loader-pct');
  const el=document.getElementById('loader');
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*12+3;
    if(p>100)p=100;
    bar.style.width=p+'%';
    pct.textContent=Math.round(p);
    if(p>=100){clearInterval(iv);setTimeout(()=>{el.classList.add('done');initAll()},400)}
  },60);
})();

function initAll(){
  splitText();
  enterAnimations();
  customCursor();
  headerScroll();
  burger();
  smoothScroll();
  heroParticles();
  heroTimeline();
  parallaxEffects();
}

/* --- SPLIT TYPE (NeedNap technique) --- */
function splitText(){
  document.querySelectorAll('[data-split]').forEach(el=>{
    const type=el.dataset.split; // "chars" or "lines"
    const st=new SplitType(el,{types:type==='chars'?'chars':'lines,words'});
    if(type==='chars'){
      st.chars.forEach((c,i)=>{c.style.transitionDelay=i*.035+'s'});
    }
    if(type==='lines'){
      st.words.forEach(w=>{w.classList.add('word')});
    }
    el.classList.add('split-ready');
    // Trigger on scroll
    ScrollTrigger.create({
      trigger:el,
      start:'top bottom-=120',
      onEnter:()=>el.classList.add('split-done'),
      once:true
    });
  });
}

/* --- ENTER ANIMATIONS (NeedNap .enterAnim → .is-visible) --- */
function enterAnimations(){
  const els=document.querySelectorAll('.enterAnim');
  const ob=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        // Stagger siblings
        const parent=e.target.parentElement;
        const siblings=[...parent.querySelectorAll('.enterAnim')];
        const idx=siblings.indexOf(e.target);
        setTimeout(()=>e.target.classList.add('is-visible'),idx*80);
        ob.unobserve(e.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -80px 0px'});
  els.forEach(el=>ob.observe(el));
}

/* --- CUSTOM CURSOR (NeedNap --mouse-x/y) --- */
function customCursor(){
  if(window.innerWidth<769)return;
  const cursor=document.getElementById('cursor');
  const dot=cursor.querySelector('.cursor-dot');
  const ring=cursor.querySelector('.cursor-ring');
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
  // Hover detection
  document.querySelectorAll('a,button,.btn,.plan,.pillar,.problem,.faq summary').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });
  (function tick(){
    cx+=(mx-cx)*.12;cy+=(my-cy)*.12;
    dot.style.transform=`translate3d(${mx}px,${my}px,0)`;
    ring.style.transform=`translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(tick);
  })();
}

/* --- HEADER SCROLL --- */
function headerScroll(){
  const h=document.getElementById('header');
  window.addEventListener('scroll',()=>{
    h.classList.toggle('solid',window.pageYOffset>80);
  },{passive:true});
}

/* --- BURGER --- */
function burger(){
  const btn=document.getElementById('burger');
  const nav=document.getElementById('mnav');
  const links=nav.querySelectorAll('a');
  btn.addEventListener('click',()=>{
    btn.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow=nav.classList.contains('open')?'hidden':'';
  });
  links.forEach(l=>l.addEventListener('click',()=>{
    btn.classList.remove('open');nav.classList.remove('open');document.body.style.overflow='';
  }));
}

/* --- SMOOTH SCROLL --- */
function smoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-70,behavior:'smooth'})}
    });
  });
}

/* --- HERO PARTICLES (Canvas, NeedNap grid style) --- */
function heroParticles(){
  const c=document.getElementById('heroParticles');
  if(!c)return;
  const ctx=c.getContext('2d');
  let w,h,particles=[];
  function resize(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;initP()}
  function initP(){
    particles=[];
    const cols=Math.floor(w/60);
    const rows=Math.floor(h/60);
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      particles.push({
        x:i*60+30,y:j*60+30,
        ox:i*60+30,oy:j*60+30,
        r:Math.random()*1.5+.5,
        vx:(Math.random()-.5)*.3,
        vy:(Math.random()-.5)*.3,
        a:Math.random()*.3+.05
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      // boundary bounce
      const dx=p.x-p.ox,dy=p.y-p.oy;
      if(Math.abs(dx)>30)p.vx*=-1;
      if(Math.abs(dy)>30)p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(126,232,168,${p.a})`;
      ctx.fill();
    });
    // Connect nearby
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const d=dx*dx+dy*dy;
        if(d<3600){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(37,99,235,${.06*(1-d/3600)})`;
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();draw();
  window.addEventListener('resize',resize);
}

/* --- HERO TIMELINE (Osaka Geidai cascade) --- */
function heroTimeline(){
  const tl=gsap.timeline({delay:.2});
  tl.from('.hero-badge span',{y:30,opacity:0,stagger:.1,duration:.6,ease:'power3.out'})
    .add(()=>document.querySelector('.hero-title')?.classList.add('split-done'),'+=0')
    .from('.hero-sub',{y:20,opacity:0,duration:.6,ease:'power3.out'},'-=.3')
    .from('.hero-actions',{y:20,opacity:0,duration:.6,ease:'power3.out'},'-=.3')
    .from('.hero-scroll',{opacity:0,y:10,duration:.8,ease:'power3.out'},'-=.2');
}

/* --- PARALLAX & SCROLL FX (GSAP ScrollTrigger) --- */
function parallaxEffects(){
  // Pillars 3D tilt
  gsap.utils.toArray('.pillar').forEach((el,i)=>{
    gsap.from(el,{y:60+i*15,opacity:0,rotateX:6,
      scrollTrigger:{trigger:el,start:'top bottom-=60',toggleActions:'play none none none'},
      duration:.7,delay:i*.12,ease:'power3.out'});
  });
  // Score axes pop
  gsap.utils.toArray('.axis').forEach((el,i)=>{
    gsap.from(el,{scale:.75,opacity:0,y:20,
      scrollTrigger:{trigger:el,start:'top bottom-=50',toggleActions:'play none none none'},
      duration:.5,delay:i*.07,ease:'back.out(1.5)'});
  });
  // App row
  gsap.from('.app-mock',{x:-50,opacity:0,scrollTrigger:{trigger:'.app-row',start:'top bottom-=80'},duration:.8,ease:'power3.out'});
  gsap.from('.app-feats',{x:50,opacity:0,scrollTrigger:{trigger:'.app-row',start:'top bottom-=80'},duration:.8,delay:.15,ease:'power3.out'});
  // Cases slide alternate
  gsap.utils.toArray('.case').forEach((el,i)=>{
    gsap.from(el,{x:i%2===0?-60:60,opacity:0,
      scrollTrigger:{trigger:el,start:'top bottom-=60',toggleActions:'play none none none'},
      duration:.7,delay:i*.1,ease:'power3.out'});
  });
  // Plans
  gsap.utils.toArray('.plan').forEach((el,i)=>{
    gsap.from(el,{y:80,opacity:0,scale:.94,
      scrollTrigger:{trigger:el,start:'top bottom-=50'},
      duration:.65,delay:i*.1,ease:'power3.out'});
  });
  // CTA
  gsap.from('.cta-box',{scale:.88,opacity:0,
    scrollTrigger:{trigger:'.sec--cta',start:'top bottom-=80'},
    duration:.9,ease:'power3.out'});
}
