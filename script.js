const PRODUCTS=[
 {name:'Pink Plain T-shirt',bg:'#e90055',price:'₦10,000',old:'₦15,000',filter:'hue-rotate(345deg) saturate(1.8) brightness(1.2)',desc:'Soft, oversized cotton T-shirt in a bold raspberry pink shade, featuring a relaxed fit and a clean, minimalist design for everyday wear.'},
 {name:'White Plain T-shirt',bg:'#e9e9e9',price:'₦10,000',old:'₦15,000',filter:'grayscale(1) brightness(1.9) contrast(.6)',desc:'A clean white oversized T-shirt with an easy drape, soft hand feel and minimalist everyday styling.'},
 {name:'Milk Plain T-shirt',bg:'#e8dfb4',price:'₦10,000',old:'₦15,000',filter:'grayscale(1) sepia(.45) brightness(1.65) contrast(.72)',desc:'A warm milk-tone oversized tee with soft structure and a relaxed silhouette.'},
 {name:'Black Plain T-shirt',bg:'#434343',price:'₦10,000',old:'₦15,000',filter:'grayscale(1) brightness(.3) contrast(1.45)',desc:'A deep black heavyweight tee with relaxed proportions and a sharp minimal finish.'},
 {name:'Brown Plain T-shirt',bg:'#84746b',price:'₦10,000',old:'₦15,000',filter:'hue-rotate(315deg) saturate(.35) brightness(.68)',desc:'A rich brown oversized tee designed for easy layering and everyday wear.'}
];
const CATEGORY_LABELS={home:'Home',tshirts:'T-shirt',hoodies:'Hoodies',sweatshirts:'Sweatshirts',about:'About Us'};
let index=0,selectedSize='XL',cart=0,animating=false;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#showroom'),mainProduct=$('#mainProduct'),mobileProduct=$('#mobileProduct');
const shell=$('#productShell'),mobileShell=$('#mobileProductShell');
const price=$('#price'),oldPrice=$('#oldPrice'),mobilePrice=$('#mobilePrice'),mobileDescription=$('#mobileDescription');
const nextThumbImg=$('#nextThumbImg'),nextThumbName=$('#nextThumbName'),thumbList=$('#mobileThumbList');

function buildThumbs(){
  thumbList.innerHTML='';
  PRODUCTS.forEach((p,i)=>{
    const b=document.createElement('button');
    b.className='mobile-thumb interactive';
    b.dataset.index=i;
    b.innerHTML='<img src="oversized-tee.webp" alt=""><span>'+p.name+'</span>';
    b.querySelector('img').style.filter=p.filter;
    b.addEventListener('click',()=>goTo(i));
    thumbList.appendChild(b);
  });
}
function render(){
  const p=PRODUCTS[index], n=PRODUCTS[(index+1)%PRODUCTS.length];
  app.style.setProperty('--bg',p.bg);
  mainProduct.style.filter=p.filter+' drop-shadow(0 32px 24px rgba(0,0,0,.25))';
  mobileProduct.style.filter=p.filter+' drop-shadow(0 22px 18px rgba(0,0,0,.25))';
  mainProduct.alt=p.name; mobileProduct.alt=p.name;
  price.textContent=p.price; oldPrice.textContent=p.old; mobilePrice.textContent=p.price; mobileDescription.textContent=p.desc;
  nextThumbImg.style.filter=n.filter+' drop-shadow(0 7px 5px rgba(0,0,0,.2))';
  nextThumbName.textContent=n.name;
  $$('.mobile-thumb').forEach((el,i)=>el.classList.toggle('active',i===index));
}
function goTo(nextIndex){
  if(animating||nextIndex===index)return;
  animating=true;
  shell.classList.add('out'); mobileShell.classList.add('out');
  setTimeout(()=>{
    index=(nextIndex+PRODUCTS.length)%PRODUCTS.length;
    render();
    shell.classList.remove('out'); mobileShell.classList.remove('out');
    setTimeout(()=>animating=false,260);
  },180);
}
const next=()=>goTo((index+1)%PRODUCTS.length);
const prev=()=>goTo((index-1+PRODUCTS.length)%PRODUCTS.length);
['#nextBtn','#mobileNext','#nextThumb'].forEach(id=>$(id).addEventListener('click',next));
['#prevBtn','#mobilePrev'].forEach(id=>$(id).addEventListener('click',prev));

function setSize(size){
  selectedSize=size;
  $$('.size-btn').forEach(b=>b.classList.toggle('selected',b.dataset.size===size));
  toast('Size '+size+' selected');
}
$$('.size-btn').forEach(b=>b.addEventListener('click',()=>setSize(b.dataset.size)));

function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('show'),1500);
}
function addToCart(goCheckout=false){
  cart++; $('#cartCount').textContent=cart;
  toast((goCheckout?'Ready to buy ':'Added ')+PRODUCTS[index].name+' · '+selectedSize);
}
$('#addBtn').addEventListener('click',()=>addToCart(false));
$('#buyBtn').addEventListener('click',()=>addToCart(true));
$('#cartBtn').addEventListener('click',()=>toast(cart?cart+' item'+(cart===1?'':'s')+' in your cart':'Your cart is empty'));
$('#accountBtn').addEventListener('click',()=>toast('Account area'));
$('#lookBtn').addEventListener('click',next);

function activateCategory(category){
  $$('.category-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===category));
  $('#mobileCategoryTitle').textContent=CATEGORY_LABELS[category]||'T-shirt';
  if(category==='about') $('#aboutPanel').classList.add('open');
  else if(category==='home') goTo(0);
  else if(category==='hoodies') toast('Hoodies selected');
  else if(category==='sweatshirts') toast('Sweatshirts selected');
  else toast('T-shirt selected');
  closeDrawer();
}
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>activateCategory(b.dataset.category)));

const drawer=$('#mobileDrawer');
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false')}
function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
$('#menuBtn').addEventListener('click',openDrawer);
$('#drawerClose').addEventListener('click',closeDrawer);
$('#aboutClose').addEventListener('click',()=>$('#aboutPanel').classList.remove('open'));
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight')next();
  if(e.key==='ArrowLeft')prev();
  if(e.key==='Escape'){closeDrawer();$('#aboutPanel').classList.remove('open')}
});
buildThumbs(); render();