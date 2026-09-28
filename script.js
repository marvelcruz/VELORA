const PRODUCTS=[
 {name:'Pink Plain T-shirt',bg:'#e90055',price:'₦10,000',old:'₦15,000',filter:'hue-rotate(345deg) saturate(1.8) brightness(1.2)',desc:'Soft, oversized cotton T-shirt in a bold raspberry pink shade, featuring a relaxed fit and a clean, minimalist design for everyday wear.',sizes:['XL','2XL','3XL','4XL']},
 {name:'White Plain T-shirt',bg:'#ededed',price:'₦10,000',old:'₦15,000',filter:'grayscale(1) brightness(1.9) contrast(.6)',desc:'A clean white oversized T-shirt with an easy drape, soft hand feel and minimalist everyday styling.',sizes:['XL','2XL','3XL','4XL']},
 {name:'Milk Plain T-shirt',bg:'#e8dfb4',price:'₦12,000',old:'₦16,000',filter:'grayscale(1) sepia(.45) brightness(1.65) contrast(.72)',desc:'A warm milk-tone oversized tee with soft structure, a relaxed silhouette and a premium heavyweight feel.',sizes:['XL','2XL','3XL','4XL']},
 {name:'Black Plain T-shirt',bg:'#3b3b3d',price:'₦12,000',old:'₦16,000',filter:'grayscale(1) brightness(.3) contrast(1.45)',desc:'A deep black heavyweight tee with relaxed proportions, a soft hand feel and a sharp minimal finish.',sizes:['XL','2XL','3XL','4XL']},
 {name:'Brown Plain T-shirt',bg:'#84746b',price:'₦12,000',old:'₦16,000',filter:'hue-rotate(315deg) saturate(.35) brightness(.68)',desc:'A rich brown oversized tee designed for easy layering, soft comfort and everyday wear.',sizes:['XL','2XL','3XL','4XL']}
];
const CATEGORY_LABELS={home:'Home',tshirts:'T-shirt',hoodies:'Hoodies',sweatshirts:'Sweatshirts',about:'About Us'};
let index=0,previousIndex=4,selectedSize='XL',cart=0,animating=false;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#showroom'),mainProduct=$('#mainProduct'),mobileProduct=$('#mobileProduct');
const shell=$('#productShell'),mobileShell=$('#mobileProductShell');
const price=$('#price'),oldPrice=$('#oldPrice'),mobilePrice=$('#mobilePrice'),mobileDescription=$('#mobileDescription');
const desktopItemName=$('#desktopItemName'),mobileItemName=$('#mobileItemName');
const previewImg=$('#nextThumbImg'),previewName=$('#nextThumbName'),thumbList=$('#mobileThumbList');

function filterFor(p,mobile=false){
 return p.filter+(mobile?' drop-shadow(0 22px 18px rgba(0,0,0,.25))':' drop-shadow(0 32px 24px rgba(0,0,0,.25))');
}
function buildThumbs(){
 thumbList.innerHTML='';
 PRODUCTS.forEach((p,i)=>{
   const b=document.createElement('button');
   b.className='mobile-thumb interactive';
   b.dataset.index=i;
   b.innerHTML='<img src="oversized-tee.webp" alt="'+p.name+'"><span>'+p.name+'</span>';
   b.querySelector('img').style.filter=p.filter;
   b.addEventListener('click',()=>goTo(i,i>index?1:-1));
   thumbList.appendChild(b);
 });
}
function render(){
 const p=PRODUCTS[index], prev=PRODUCTS[previousIndex];
 app.style.setProperty('--bg',p.bg);
 mainProduct.style.filter=filterFor(p,false);
 mobileProduct.style.filter=filterFor(p,true);
 mainProduct.alt=p.name;mobileProduct.alt=p.name;
 desktopItemName.textContent=p.name;mobileItemName.textContent=p.name;
 price.textContent=p.price;oldPrice.textContent=p.old;mobilePrice.textContent=p.price;mobileDescription.textContent=p.desc;
 previewImg.style.filter=prev.filter+' drop-shadow(0 7px 5px rgba(0,0,0,.2))';
 previewImg.alt=prev.name;previewName.textContent=prev.name;
 $$('.mobile-thumb').forEach((el,i)=>el.classList.toggle('active',i===index));
}
function cloneAt(img,rect,filter){
 const c=document.createElement('img');
 c.src='oversized-tee.webp';c.className='frame-flight';c.style.filter=filter;
 Object.assign(c.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
 document.body.appendChild(c);return c;
}
function desktopFlight(nextIndex){
 const currentP=PRODUCTS[index],nextP=PRODUCTS[nextIndex];
 const start=mainProduct.getBoundingClientRect(), target=previewImg.getBoundingClientRect();
 const outgoing=cloneAt(mainProduct,start,filterFor(currentP,false));
 const incoming=cloneAt(mainProduct,start,filterFor(nextP,false));
 const dx=target.left-start.left,dy=target.top-start.top;
 const sx=target.width/start.width,sy=target.height/start.height;

 outgoing.animate([
  {transform:'translate(0,0) scale(1)',opacity:1},
  {transform:`translate(${dx*.45}px,${dy*.38}px) scale(.76)`,opacity:1,offset:.48},
  {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,opacity:.96}
 ],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});

 incoming.animate([
  {transform:'translate(-8%,-78%) scale(1.28)',opacity:.72},
  {transform:'translate(-3%,-30%) scale(1.12)',opacity:.95,offset:.5},
  {transform:'translate(0,0) scale(1)',opacity:1}
 ],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});

 shell.classList.add('transitioning');
 return [outgoing,incoming];
}
function mobileFlight(nextIndex,direction){
 const currentP=PRODUCTS[index],nextP=PRODUCTS[nextIndex];
 const rect=mobileProduct.getBoundingClientRect();
 const outgoing=cloneAt(mobileProduct,rect,filterFor(currentP,true));
 const incoming=cloneAt(mobileProduct,rect,filterFor(nextP,true));
 const sign=direction>0?1:-1; // video forward: current exits right, new comes from left
 outgoing.animate([
   {transform:'translateX(0) scale(1)',opacity:1},
   {transform:`translateX(${sign*45}%) scale(.98)`,opacity:.95,offset:.48},
   {transform:`translateX(${sign*110}%) scale(.95)`,opacity:.2}
 ],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 incoming.animate([
   {transform:`translateX(${-sign*110}%) scale(.95)`,opacity:.2},
   {transform:`translateX(${-sign*45}%) scale(.98)`,opacity:.95,offset:.48},
   {transform:'translateX(0) scale(1)',opacity:1}
 ],{duration:330,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
 mobileShell.classList.add('transitioning');
 return [outgoing,incoming];
}
function goTo(nextIndex,direction=1){
 if(animating||nextIndex===index)return;
 animating=true;
 const old=index;
 const desktopClones=desktopFlight(nextIndex);
 const mobileClones=mobileFlight(nextIndex,direction);
 app.style.setProperty('--bg',PRODUCTS[nextIndex].bg);

 setTimeout(()=>{
   previousIndex=old;
   index=(nextIndex+PRODUCTS.length)%PRODUCTS.length;
   render();
 },165);

 setTimeout(()=>{
   [...desktopClones,...mobileClones].forEach(x=>x.remove());
   shell.classList.remove('transitioning');
   mobileShell.classList.remove('transitioning');
   mainProduct.style.visibility='';
   mobileProduct.style.visibility='';
   animating=false;
 },350);
}
const next=()=>goTo((index+1)%PRODUCTS.length,1);
const prev=()=>goTo((index-1+PRODUCTS.length)%PRODUCTS.length,-1);
['#nextBtn','#mobileNext'].forEach(id=>$(id).addEventListener('click',next));
['#prevBtn','#mobilePrev'].forEach(id=>$(id).addEventListener('click',prev));
$('#nextThumb').addEventListener('click',()=>goTo(previousIndex,-1));

function setSize(size){selectedSize=size;$$('.size-btn').forEach(b=>b.classList.toggle('selected',b.dataset.size===size));toast('Size '+size+' selected')}
$$('.size-btn').forEach(b=>b.addEventListener('click',()=>setSize(b.dataset.size)));
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1500)}
function addToCart(goCheckout=false){cart++;$('#cartCount').textContent=cart;toast((goCheckout?'Ready to buy ':'Added ')+PRODUCTS[index].name+' · '+selectedSize)}
$('#addBtn').addEventListener('click',()=>addToCart(false));
$('#buyBtn').addEventListener('click',()=>addToCart(true));
$('#cartBtn').addEventListener('click',()=>toast(cart?cart+' item'+(cart===1?'':'s')+' in your cart':'Your cart is empty'));
$('#accountBtn').addEventListener('click',()=>toast('Account area'));
$('#lookBtn').addEventListener('click',next);

function activateCategory(category){
 $$('.category-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===category));
 $('#mobileCategoryTitle').textContent=CATEGORY_LABELS[category]||'T-shirt';
 if(category==='about')$('#aboutPanel').classList.add('open');
 else if(category==='home'&&index!==0)goTo(0,-1);
 else if(category==='hoodies')toast('Hoodies selected');
 else if(category==='sweatshirts')toast('Sweatshirts selected');
 else toast('T-shirt selected');
 closeDrawer();
}
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>activateCategory(b.dataset.category)));
const drawer=$('#mobileDrawer');
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false')}
function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
$('#menuBtn').addEventListener('click',openDrawer);$('#drawerClose').addEventListener('click',closeDrawer);
$('#aboutClose').addEventListener('click',()=>$('#aboutPanel').classList.remove('open'));
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();if(e.key==='Escape'){closeDrawer();$('#aboutPanel').classList.remove('open')}});

buildThumbs();render();
const fittingForm=document.getElementById('fittingForm');
if(fittingForm){
  fittingForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(fittingForm);
    const name=(data.get('name')||'').toString().trim();
    const interest=(data.get('interest')||'appointment').toString();
    const status=document.getElementById('fittingStatus');
    status.textContent='Thanks'+(name?', '+name:'')+'. Your '+interest.toLowerCase()+' fitting request is ready to be sent to the studio.';
    fittingForm.reset();
  });
}
