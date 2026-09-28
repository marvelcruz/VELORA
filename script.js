const FALLBACK='oversized-tee.webp';
const CATALOG={
 men:[
  {name:'Formal Suit',image:'https://rivaado.com/uploads/men_collection/1733407617_HUGO-BOSS-Men%C3%A2%E2%82%AC%E2%84%A2s-Formal-Suiting-Collection-2015-3%20%281%29.jpg',bg:'#b9b3ac',price:'From $400',type:'Made to measure',desc:'Power dressing for the boardroom, weddings and special occasions, developed around your measurements and personal style.'},
  {name:'Classic Tuxedo',image:'https://rivaado.com/uploads/men_collection/1733407570_s41.jpg',bg:'#b9c9bd',price:'From $400',type:'Black-tie tailoring',desc:'Sharp cuts, premium fabrics and formal finishing for weddings, galas and black-tie occasions.'},
  {name:'Embroidered Tuxedo',image:'https://rivaado.com/uploads/men_collection/1733400717_s30.jpg',bg:'#8a6b66',price:'Custom quote',type:'Statement formalwear',desc:'Traditional tailoring with expressive embroidered detailing for a tuxedo that feels completely individual.'},
  {name:'Long Coat',image:'https://rivaado.com/uploads/men_collection/1733401196_5809e96eb158b9534eb1e3254ea3fc2f.jpg',bg:'#9c8e80',price:'Custom quote',type:'Bespoke outerwear',desc:'A refined long coat built for warmth, elegant layering and an easy transition between formal and casual dressing.'},
  {name:'Asian Couture',image:'https://rivaado.com/uploads/men_collection/1733400717__DSC0070.jpg',bg:'#8a7461',price:'Custom quote',type:'Bespoke couture',desc:'Traditional and contemporary Asian occasionwear shaped by generations of specialist tailoring.'}
 ],
 women:[
  {name:"Women's Formal Suit",image:'https://rivaado.com/uploads/men_collection/1733407570_s41.jpg',bg:'#c6b0aa',price:'From $400',type:'Made to measure',desc:'Precision tailoring for corporate, business and formal occasions with a silhouette developed around you.'},
  {name:"Designer Tuxedo",image:'https://rivaado.com/uploads/men_collection/1733400717_s30.jpg',bg:'#9b7a78',price:'Custom quote',type:'Formal tailoring',desc:'Premium fabrics and distinctive details for formalwear designed to stand out without sacrificing fit.'},
  {name:"Long Coat",image:'https://rivaado.com/uploads/men_collection/1733401196_5809e96eb158b9534eb1e3254ea3fc2f.jpg',bg:'#aaa19a',price:'Custom quote',type:'Tailored outerwear',desc:'Warm, polished outerwear in wool, cashmere and seasonal fabrics with a clean bespoke line.'},
  {name:"Formal Dress",image:'https://rivaado.com/uploads/men_collection/1733400717__DSC0070.jpg',bg:'#b58f82',price:'Custom quote',type:'Occasion wear',desc:'Made-to-measure formal dresses ranging from sleek silhouettes to more fluid evening shapes.'}
 ],
 accessories:[
  {name:'Ties & Bows',image:FALLBACK,bg:'#70809b',price:'Enquire',type:'Accessories',desc:'Finishing pieces for formal, business and occasion dressing, selected to complement the suit rather than compete with it.'},
  {name:'Shoes',image:FALLBACK,bg:'#7b5b47',price:'Enquire',type:'Accessories',desc:'Classic formal footwear options to complete your tailored look.'},
  {name:'Gift Boxes',image:FALLBACK,bg:'#9a5b3f',price:'Enquire',type:'Gifting',desc:'Curated accessory gift boxes featuring coordinated formalwear finishing pieces.'},
  {name:'Cufflinks',image:FALLBACK,bg:'#52677e',price:'Enquire',type:'Accessories',desc:'Small details with a strong finish — designed to sharpen formal shirts and tuxedo looks.'},
  {name:'Pocket Squares',image:FALLBACK,bg:'#d0b8a8',price:'Enquire',type:'Accessories',desc:'A final touch of color, texture and personality for tailored jackets and formalwear.'}
 ]
};
const CATEGORY_LABELS={men:'Men',women:'Women',accessories:'Accessories',about:'About'};
let category='men',items=CATALOG.men,index=0,previousIndex=items.length-1,selectedFabric='Wool',animating=false;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const app=$('#showroom'),mainProduct=$('#mainProduct'),mobileProduct=$('#mobileProduct');
const shell=$('#productShell'),mobileShell=$('#mobileProductShell');
const previewImg=$('#nextThumbImg'),previewName=$('#nextThumbName'),thumbList=$('#mobileThumbList');

function safeImage(img,src){
 img.onerror=()=>{img.onerror=null;img.src=FALLBACK};
 img.src=src||FALLBACK;
}
function buildThumbs(){
 thumbList.innerHTML='';
 items.forEach((p,i)=>{
   const b=document.createElement('button');
   b.className='mobile-thumb interactive';
   b.dataset.index=i;
   b.innerHTML='<img alt=""><span>'+p.name+'</span>';
   safeImage(b.querySelector('img'),p.image);
   b.addEventListener('click',()=>goTo(i,i>index?1:-1));
   thumbList.appendChild(b);
 });
}
function render(){
 const p=items[index],prev=items[previousIndex]||items[items.length-1];
 app.style.setProperty('--bg',p.bg);
 safeImage(mainProduct,p.image);safeImage(mobileProduct,p.image);
 mainProduct.alt=p.name;mobileProduct.alt=p.name;
 $('#desktopItemName').textContent=p.name;$('#mobileItemName').textContent=p.name;
 $('#priceLabel').textContent=p.price;$('#mobilePrice').textContent=p.price;
 $('#detailType').textContent=p.type;$('#mobileDescription').textContent=p.desc;
 safeImage(previewImg,prev.image);previewImg.alt=prev.name;previewName.textContent=prev.name;
 $$('.mobile-thumb').forEach((el,i)=>el.classList.toggle('active',i===index));
}
function cloneAt(img,rect,src){
 const c=document.createElement('img');c.className='frame-flight';safeImage(c,src);
 Object.assign(c.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
 document.body.appendChild(c);return c;
}
function desktopFlight(nextIndex){
 const start=mainProduct.getBoundingClientRect(),target=previewImg.getBoundingClientRect();
 const outgoing=cloneAt(mainProduct,start,items[index].image),incoming=cloneAt(mainProduct,start,items[nextIndex].image);
 const dx=target.left-start.left,dy=target.top-start.top,sx=target.width/start.width,sy=target.height/start.height;
 outgoing.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.45}px,${dy*.38}px) scale(.76)`,offset:.48,opacity:1},{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,opacity:.9}],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 incoming.animate([{transform:'translate(-8%,-78%) scale(1.18)',opacity:.45},{transform:'translate(-3%,-30%) scale(1.08)',opacity:.92,offset:.5},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 shell.classList.add('transitioning');return[outgoing,incoming];
}
function mobileFlight(nextIndex,direction){
 const rect=mobileProduct.getBoundingClientRect(),sign=direction>0?1:-1;
 const outgoing=cloneAt(mobileProduct,rect,items[index].image),incoming=cloneAt(mobileProduct,rect,items[nextIndex].image);
 outgoing.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${sign*48}%)`,opacity:.9,offset:.5},{transform:`translateX(${sign*112}%)`,opacity:.15}],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 incoming.animate([{transform:`translateX(${-sign*112}%)`,opacity:.15},{transform:`translateX(${-sign*48}%)`,opacity:.9,offset:.5},{transform:'translateX(0)',opacity:1}],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 mobileShell.classList.add('transitioning');return[outgoing,incoming];
}
function goTo(nextIndex,direction=1){
 if(animating||nextIndex===index||!items[nextIndex])return;
 animating=true;const old=index;
 const d=desktopFlight(nextIndex),m=mobileFlight(nextIndex,direction);
 app.style.setProperty('--bg',items[nextIndex].bg);
 setTimeout(()=>{previousIndex=old;index=nextIndex;render()},165);
 setTimeout(()=>{[...d,...m].forEach(x=>x.remove());shell.classList.remove('transitioning');mobileShell.classList.remove('transitioning');animating=false},350);
}
const next=()=>goTo((index+1)%items.length,1),prev=()=>goTo((index-1+items.length)%items.length,-1);
$('#nextBtn').onclick=next;$('#mobileNext').onclick=next;$('#prevBtn').onclick=prev;$('#mobilePrev').onclick=prev;
$('#nextThumb').onclick=()=>goTo(previousIndex,-1);

function selectFabric(fabric){
 selectedFabric=fabric;$$('.fabric-btn').forEach(b=>b.classList.toggle('selected',b.dataset.fabric===fabric));$('#fabricName').textContent=fabric;toast(fabric+' selected');
}
$$('.fabric-btn').forEach(b=>b.addEventListener('click',()=>selectFabric(b.dataset.fabric)));

function switchCategory(nextCategory){
 if(nextCategory==='about'){openAbout();closeDrawer();return}
 if(!CATALOG[nextCategory])return;
 category=nextCategory;items=CATALOG[category];index=0;previousIndex=items.length-1;animating=false;
 $$('.category-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===category));
 $('#mobileCategoryTitle').textContent=CATEGORY_LABELS[category];
 buildThumbs();render();closeDrawer();
}
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>switchCategory(b.dataset.category)));

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1500)}
function openAbout(){$('#aboutPanel').classList.add('open')}
function openBooking(){$('#bookingPanel').classList.add('open')}
function closeDrawer(){$('#mobileDrawer').classList.remove('open');$('#mobileDrawer').setAttribute('aria-hidden','true')}
$('#menuBtn').onclick=()=>{$('#mobileDrawer').classList.add('open');$('#mobileDrawer').setAttribute('aria-hidden','false')};
$('#drawerClose').onclick=closeDrawer;
$('#aboutClose').onclick=()=>$('#aboutPanel').classList.remove('open');
$('#bookingClose').onclick=()=>$('#bookingPanel').classList.remove('open');
['#bookTop','#bookMain','#bookMobile','#aboutBook'].forEach(id=>$(id).onclick=openBooking);
$('#enquireMobile').onclick=()=>{window.location.href='mailto:Info@rivaado.com?subject=Rivaado enquiry: '+encodeURIComponent(items[index].name)};
$('#contactBtn').onclick=openAbout;

$('#bookingForm').addEventListener('submit',e=>{
 e.preventDefault();const fd=new FormData(e.currentTarget);const name=(fd.get('name')||'').toString().trim();
 $('#bookingStatus').textContent='Thank you'+(name?', '+name:'')+'. Your fitting request has been prepared. Please call or email Rivaado to confirm the appointment.';
});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();if(e.key==='Escape'){$('#aboutPanel').classList.remove('open');$('#bookingPanel').classList.remove('open');closeDrawer()}});
buildThumbs();render();