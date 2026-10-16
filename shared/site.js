/* Atlas preview shared behavior: mobile menu, today's hours, preview-only forms. */
(function(){
  if(!window.__atlasFormSubmit){
    window.__atlasFormSubmit=true;
    document.addEventListener('submit',function(e){
      var f=e.target;
      if(!f||!f.tagName||String(f.tagName).toLowerCase()!=='form') return;
      if(typeof window.gtag!=='function') return;
      window.gtag('event','form_submit',{
        form_id:f.id||'',
        form_name:f.getAttribute('name')||f.id||'form',
        form_destination:f.getAttribute('action')||window.location.href
      });
    },true);
  }

  var btn=document.querySelector('[data-menu-btn]');
  var body=document.body;
  function setOpen(o){
    if(!btn) return;
    btn.setAttribute('aria-expanded', o ? 'true' : 'false');
    btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    body.classList.toggle('nav-open', o);
  }
  if(btn){
    btn.addEventListener('click',function(){ setOpen(btn.getAttribute('aria-expanded')!=='true'); });
    document.querySelectorAll('[data-nav] a').forEach(function(a){ a.addEventListener('click',function(){ setOpen(false); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setOpen(false); });
    window.addEventListener('resize',function(){ if(window.innerWidth>1000) setOpen(false); });
  }
  /* Hours from atlaschirohc.com, read in Seattle time. */
  var hours={0:null,1:'10 to 1 and 3 to 6:30',2:'3 to 6:30',3:'10 to 1 and 3 to 6:30',4:'2 to 6:30',5:'10 to 1 and 3 to 6',6:null};
  var names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  try{
    var wd=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'long'}).format(new Date());
    var d=names.indexOf(wd);
    document.querySelectorAll('[data-today]').forEach(function(el){
      el.textContent = hours[d] ? ('Open today ' + hours[d]) : 'Closed today, open Monday at 10';
    });
    document.querySelectorAll('[data-day="'+d+'"]').forEach(function(el){ el.classList.add('is-today'); });
  }catch(e){}
  /* Preview forms are not wired to anything yet. Nothing is sent. */
  document.querySelectorAll('form[data-preview-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=f.querySelector('[data-form-note]');
      if(n){ n.hidden=false; n.focus && n.focus(); }
    });
  });
})();
