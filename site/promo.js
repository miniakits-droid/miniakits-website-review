/* Miniakits – popup Novembre Créatif (6–30 nov. 2026, heure du Maroc) */
(function(){
var START=Date.UTC(2026,10,5,23,0,0),END=Date.UTC(2026,10,30,23,0,0); /* Maroc = UTC+1 : 6 nov 00:00 → 1 déc 00:00 */
var now=Date.now();if(now<START||now>=END)return;
if(/^\/reglement-novembre/.test(location.pathname))return;
var P=location.pathname.replace(/\/index\.html$/,'');if(P==='/'||P===''||P==='/en'||P==='/en/'||P==='/ar'||P==='/ar/')return;
var K='mk_promo_nov26_closed',mem=false;
function seen(){try{return sessionStorage.getItem(K)==='1'}catch(e){return mem}}
function mark(){mem=true;try{sessionStorage.setItem(K,'1')}catch(e){}}
if(seen())return;
var R='/reglement-novembre',EN=(document.documentElement.lang||'').indexOf('en')===0,AR=(document.documentElement.lang||'').indexOf('ar')===0;
var T=EN?{c:'Close',l:'See the full offer rules',a:'Miniakits Novembre Créatif poster: 1 kit bought = 1 kit free, 6–30 November 2026. Opens the offer rules.',d:'November offer'}:AR?{c:'إغلاق',l:'شروط العرض الكاملة (بالفرنسية)',a:'ملصق عرض نونبر من Miniakits: 1 كيت مشترى = 1 كيت هدية، من 6 إلى 30 نونبر 2026. يفتح شروط العرض.',d:'عرض نونبر'}:{c:'Fermer',l:'Consulter le règlement complet de l’offre',a:'Affiche Miniakits Novembre Créatif : 1 kit acheté = 1 kit offert, offre valable du 6 au 30 novembre 2026. Ouvre le règlement de l’offre.',d:'Offre de novembre'};
var css='.mkp{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(20,24,40,.72)}'+
'.mkp-box{position:relative;display:flex;flex-direction:column;align-items:center;max-width:min(92vw,560px);outline:none}'+
'.mkp-img{position:relative;display:block;line-height:0;border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.4)}'+
'.mkp-img img{display:block;width:auto;height:auto;max-width:min(92vw,560px);max-height:calc(100vh - 90px);max-height:calc(100dvh - 90px);object-fit:contain}'+
'.mkp-rz{position:absolute;right:2%;bottom:1.5%;width:28%;height:16%;border-radius:50%}'+
'.mkp-img:focus-visible,.mkp-rz:focus-visible,.mkp-x:focus-visible,.mkp-tx:focus-visible{outline:3px solid #ffd23f;outline-offset:3px}'+
'.mkp-x{position:absolute;top:-10px;right:-10px;z-index:2;width:44px;height:44px;border-radius:50%;border:3px solid #fff;background:#1d4f86;color:#fff;font:700 24px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.35)}'+
'.mkp-tx{margin-top:10px;color:#fff;font:700 15px/1.3 system-ui,sans-serif;text-decoration:underline;text-align:center}'+
'@media (max-width:480px){.mkp-x{top:-6px;right:-6px}}';
function open(){
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 var prev=document.activeElement,w=document.createElement('div');w.className='mkp';
 w.innerHTML='<div class="mkp-box" role="dialog" aria-modal="true" aria-label="'+T.d+'" tabindex="-1">'+
  '<button type="button" class="mkp-x" aria-label="'+T.c+'">×</button>'+
  '<div style="position:relative"><a class="mkp-img" href="'+R+'"><img src="/img/promo-novembre-600.webp" srcset="/img/promo-novembre-600.webp 600w, /img/promo-novembre.webp 1199w" sizes="(max-width:600px) 92vw, 560px" width="1199" height="1312" alt="'+T.a+'" decoding="async"></a>'+
  '<a class="mkp-rz" href="'+R+'" aria-label="'+T.l+'"></a></div>'+
  '<a class="mkp-tx" href="'+R+'">'+T.l+'</a></div>';
 document.body.appendChild(w);
 var box=w.firstChild,x=w.querySelector('.mkp-x');
 function close(){mark();w.remove();st.remove();document.removeEventListener('keydown',kd);if(prev&&prev.focus)try{prev.focus()}catch(e){}}
 function kd(e){if(e.key==='Escape'||e.key==='Esc'){close();return}
  if(e.key==='Tab'){var f=w.querySelectorAll('a,button'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
 x.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();close()});
 w.addEventListener('click',function(e){if(e.target===w)close()});
 w.querySelectorAll('a').forEach(function(a){a.addEventListener('click',mark)});
 document.addEventListener('keydown',kd);x.focus();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',open);else open();
})();
