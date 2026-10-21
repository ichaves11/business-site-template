/* Opus template destinations. All default interactions stay on this device. */
(() => {
  const config=window.OPUS_CONFIG || {};
  let booking;
  try { if(config.bookingUrl && new URL(config.bookingUrl).protocol==='https:') booking=config.bookingUrl; } catch {}
  if(booking) document.addEventListener('click',e=>{
    if(e.target.closest('[data-demo]')) {e.preventDefault();e.stopImmediatePropagation();location.assign(booking);}
  },true);
  const dialog=document.createElement('dialog');dialog.className='opus-info';dialog.setAttribute('aria-labelledby','opus-info-title');
  dialog.innerHTML='<button type="button" class="opus-info-close" aria-label="Close preview">×</button><p class="t-caps">Interactive preview</p><h2 id="opus-info-title" class="t-h4"></h2><p class="t-b16"></p><button type="button" class="btn btn-primary">Continue exploring</button>';
  document.body.append(dialog);
  function show(title,message){dialog.querySelector('h2').textContent=title;dialog.querySelector('.t-b16').textContent=message;dialog.showModal();}
  dialog.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  document.querySelectorAll('a[href="#template-preview"]').forEach(link=>{
    link.href='#template-preview';
    link.addEventListener('click',e=>{e.preventDefault();show(link.textContent.trim() || link.getAttribute('aria-label'),'This is a preview of the Opus website template. This destination has not been connected yet. Explore the product examples, pricing and questions on this page.');});
  });
  document.getElementById('template-preview')?.remove();dialog.id='template-preview';
  const navTargets=['#platform','#opportunities','#customer-map','#campaign','#top'];
  document.querySelectorAll('.pf-nav').forEach((link,i)=>{link.href=navTargets[i];});
  document.querySelectorAll('.pf-seg').forEach(link=>{link.href='#customer-map';});
  document.querySelectorAll('.campaign .btn').forEach(link=>link.addEventListener('click',e=>{
    e.preventDefault();
    const label=link.querySelector('.b-t')?.textContent || link.textContent;
    show(label.includes('Launch')?'Campaign preview':'Campaign planning',label.includes('Launch')?'This campaign is an illustrative example. No messages were sent and no customer data is connected.':'Explore the sample audience, offer and message above. A live campaign editor is not connected to this template.');
  }));
  document.querySelector('.chat-more')?.addEventListener('click',()=>show('Ask Opus','The conversation demonstrates how customer-growth recommendations could look. Responses and customer figures are illustrative, not live analysis.'));
  document.querySelector('.send')?.addEventListener('click',()=>document.querySelector('.suggest[data-main]')?.click());
  document.querySelector('.send-btn')?.addEventListener('click',()=>show('Strategy preview','This is an illustrative strategy approval. No campaign has been created or sent.'));
  // Keep the hidden mobile navigation outside the keyboard tab order.
  const menu=document.getElementById('mnav');
  if(menu){const sync=()=>{menu.inert=!menu.classList.contains('open');};sync();new MutationObserver(sync).observe(menu,{attributes:true,attributeFilter:['class']});
    menu.addEventListener('keydown',e=>{if(e.key!=='Tab'||menu.inert)return;const focusable=[...menu.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  }
})();
