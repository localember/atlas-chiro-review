/* Atlas preview shared behavior: mobile menu, today's hours, preview-only forms,
   sticky mobile action bar, form Send ready state, soft scroll reveals. */
(function(){
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

  /* Preview forms: not wired. Send button goes laser-red when Name + Phone are filled. */
  document.querySelectorAll('form[data-preview-form]').forEach(function(f){
    var name=f.querySelector('[name="name"]');
    var phone=f.querySelector('[name="phone"]');
    var send=f.querySelector('[data-send-btn]') || f.querySelector('[type="submit"]');
    function syncReady(){
      var ready=!!(name && phone && name.value.trim() && phone.value.trim());
      if(send) send.classList.toggle('is-ready', ready);
    }
    f.addEventListener('input', syncReady);
    f.addEventListener('change', syncReady);
    syncReady();
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=f.querySelector('[data-form-note]');
      if(n){ n.hidden=false; n.focus && n.focus(); }
    });
  });

  /* Sticky mobile action bar: show under 1001px after scrolling past the hero. */
  var mbar=document.querySelector('[data-mbar]');
  var hero=document.querySelector('[data-hero]') || document.querySelector('.hero');
  function syncMbar(){
    if(!mbar) return;
    var narrow=window.innerWidth<=1000;
    var past=false;
    if(hero){
      var r=hero.getBoundingClientRect();
      past=r.bottom < 80;
    }else{
      past=window.scrollY > 320;
    }
    var show=narrow && past;
    mbar.classList.toggle('is-in', show);
    body.classList.toggle('mbar-on', show);
  }
  window.addEventListener('scroll', syncMbar, {passive:true});
  window.addEventListener('resize', syncMbar);
  syncMbar();

  /* Soft scroll reveals + one-time hero entrance. Respects prefers-reduced-motion. */
  var reduce=false;
  try{ reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  if(reduce){
    document.querySelectorAll('.reveal, .reveal-child').forEach(function(el){ el.classList.add('is-in'); });
    return;
  }
  if(hero){
    hero.classList.add('hero-enter');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ hero.classList.add('is-ready'); });
    });
  }
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  },{threshold:0.12, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el){ io.observe(el); });
})();
