(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const brand = typeof config.brand === 'string' && config.brand.trim() ? config.brand.trim() : 'Studio';
  document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = brand; });
  document.title = config.title || `${brand} · Make room for growth`;
  if (config.description) document.querySelector('meta[name="description"]').content = config.description;
  if (config.bookingUrl) {
    try {
      const url = new URL(config.bookingUrl);
      if (url.protocol === 'https:') document.querySelectorAll('[data-primary-link]').forEach(link => {
        link.href = url.href;
        link.replaceChildren(document.createTextNode(config.bookingLabel || 'Let’s talk'));
        const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
      });
    } catch { /* An invalid destination keeps the working local planner link. */ }
  }
  const routes = {
    attract: {label:'Attract more leads',eyebrow:'Start with discovery',heading:'Be found by\nthe right people.',description:'Turn a scattered online presence into a clear invitation to the customers you want to reach.',steps:['Clarify your audience and offer','Create a focused landing page','Connect every inquiry to a follow-up'],start:'Right audience',end:'New conversations',summary:'A focused route from the right audience to new conversations.',path:'M60 80C200 80 200 230 300 230S400 380 540 380',from:[60,80],to:[540,380]},
    convert: {label:'Convert more visitors',eyebrow:'Make the next step clear',heading:'Turn attention\ninto intention.',description:'Help people understand your value, feel confident in their choice and take the next step without friction.',steps:['Make your offer easy to understand','Answer the questions that hold people back','Simplify the inquiry or booking journey'],start:'Curious visitors',end:'Confident decisions',summary:'A clearer customer journey from a first visit to a confident next step.',path:'M25 230C140 230 195 230 300 230S460 230 575 230',from:[25,230],to:[575,230]},
    retain: {label:'Bring customers back',eyebrow:'Build on the relationship',heading:'Make one good visit\nthe beginning.',description:'Stay useful after the first purchase with a customer experience that gives people a reason to return.',steps:['Map the experience after the first purchase','Create timely, relevant follow-ups','Make returning and referring feel effortless'],start:'First-time customers',end:'Lasting relationships',summary:'A thoughtful follow-up system that turns a first purchase into a lasting relationship.',path:'M60 380C200 380 200 230 300 230S400 80 540 80',from:[60,380],to:[540,80]}
  };
  let selected = 'attract';
  try { const saved = localStorage.getItem('studio-growth-goal'); if (Object.hasOwn(routes, saved)) selected = saved; } catch {}
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  function selectGoal(key) {
    if (!Object.hasOwn(routes, key)) return;
    selected = key; const route = routes[key];
    document.querySelectorAll('[data-goal]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.goal === key)));
    text('route-label', route.eyebrow); text('route-heading', route.heading); text('route-description', route.description);
    text('route-start', route.start); text('route-end', route.end); text('brief-title', route.label); text('brief-summary', route.summary);
    text('download-status', '');
    const list = document.getElementById('route-steps'); list.replaceChildren(...route.steps.map(step => { const li = document.createElement('li'); li.textContent = step; return li; }));
    document.getElementById('active-route').setAttribute('d', route.path);
    for (const [selector, coords] of [['.route-dot',route.from],['.route-end',route.to]]) {
      document.querySelector(selector).setAttribute('cx',coords[0]); document.querySelector(selector).setAttribute('cy',coords[1]);
    }
    const start = document.querySelector('.node-start'), end = document.querySelector('.node-end');
    start.style.top = key === 'attract' ? '17%' : key === 'convert' ? '45%' : '70%';
    end.style.bottom = key === 'attract' ? '17%' : key === 'convert' ? '45%' : '70%';
    try { localStorage.setItem('studio-growth-goal',key); } catch {}
  }
  selectGoal(selected);
  document.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => selectGoal(button.dataset.goal)));
  const menu = document.querySelector('.menu-toggle'), links = document.querySelector('.nav-links');
  function closeMenu(returnFocus = false) { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); links.classList.remove('is-open'); if (returnFocus) menu.focus(); }
  menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');links.classList.toggle('is-open',open);});
  links.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true') closeMenu(true);});
  document.addEventListener('click',event=>{if(!event.target.closest('.nav'))closeMenu();});
  const artCopy = {web:['A considered first impression','Clarity, from the first click.','01 / 03'],systems:['The pieces, working together','Less friction. Better follow-through.','02 / 03'],growth:['A direction worth following','Reach people with a reason to care.','03 / 03']};
  document.querySelectorAll('[data-service]').forEach(details => details.addEventListener('toggle',()=>{
    if(!details.open)return;
    document.querySelectorAll('[data-service]').forEach(other=>{if(other!==details)other.open=false;});
    const key=details.dataset.service, copy=artCopy[key];document.querySelector('.sculpture').dataset.art=key;text('art-label',copy[0]);text('art-caption',copy[1]);document.querySelector('.art-index').textContent=copy[2];
  }));
  document.getElementById('download-brief').addEventListener('click', () => {
    const route = routes[selected], project = document.getElementById('project-name').value.trim() || 'My next project';
    const content = `${project}\nGROWTH PROJECT BRIEF\nPrepared with ${brand}\n\nPRIORITY\n${route.label}\n\nDIRECTION\n${route.summary}\n\nSUGGESTED FIRST STEPS\n${route.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\nQUESTIONS TO ANSWER TOGETHER\n- Who is the customer you most want to reach?\n- What is working today, and where do people get stuck?\n- Which existing tools and content should we build on?\n- What would a useful outcome look like?\n- What budget and timing should shape the scope?\n\nNEXT STEP\nShare this brief with your team or a service provider to agree on scope, timing and responsibilities.\n\nThis is a planning aid, not a quote, booking or promise of results. No information was submitted.\n`;
    const blob=new Blob([content],{type:'text/plain;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=`growth-brief-${selected}.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);text('download-status','Your brief is ready. Check your downloads. Nothing was submitted.');
  });
  if(window.ScrollCraft) window.ScrollCraft.mount(document.body);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(hover: hover) and (pointer: fine)'), hero=document.querySelector('.hero');
  let raf=0;
  hero.addEventListener('pointermove',event=>{
    if(reduce.matches || !fine.matches || raf)return;
    const x=(event.clientX/innerWidth-.5)*12,y=(event.clientY/hero.clientHeight-.5)*8;
    raf=requestAnimationFrame(()=>{document.querySelectorAll('.orbit-label').forEach((el,i)=>{el.style.setProperty('--px',`${x*(i+1)/2}px`);el.style.setProperty('--py',`${y*(i+1)/2}px`);});raf=0;});
  });
  const reset=()=>document.querySelectorAll('.orbit-label').forEach(el=>{el.style.setProperty('--px','0px');el.style.setProperty('--py','0px');});
  hero.addEventListener('pointerleave',reset);reduce.addEventListener('change',reset);
})();
