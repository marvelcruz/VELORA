const products=[
  {name:'Berry Plain Tee',bg:'#e93447',price:'₦15,000',old:'₦20,000',filter:'hue-rotate(342deg) saturate(1.5) brightness(1.15)',copy:'Soft, oversized cotton T-shirt in a bold berry shade, with a relaxed fit and a clean minimalist finish.'},
  {name:'Brown Plain Tee',bg:'#817067',price:'₦15,000',old:'₦20,000',filter:'hue-rotate(310deg) saturate(.35) brightness(.67)',copy:'A soft brown oversized tee with an easy drape, everyday comfort and a refined neutral tone.'},
  {name:'Black Plain Tee',bg:'#37393c',price:'₦15,000',old:'₦20,000',filter:'grayscale(1) brightness(.3) contrast(1.45)',copy:'A deep black heavyweight tee with relaxed proportions and a clean modern silhouette.'},
  {name:'Milk Plain Tee',bg:'#ddd5a7',price:'₦15,000',old:'₦20,000',filter:'grayscale(1) sepia(.4) brightness(1.72) contrast(.72)',copy:'A warm milk-tone tee with a soft oversized shape and an effortless minimal finish.'},
  {name:'White Plain Tee',bg:'#f1efeb',price:'₦15,000',old:'₦20,000',filter:'grayscale(1) brightness(1.9) contrast(.62)',copy:'A crisp white oversized T-shirt designed for comfort, balance and everyday layering.'}
];
let current=0,bag=0,selectedSize='XL',locked=false;
const stage=document.getElementById('productStage');
const wrap=document.getElementById('productWrap');
const img=document.getElementById('productImage');
const mini=document.getElementById('miniImage');
const miniName=document.getElementById('miniName');
const price=document.getElementById('price');
const oldPrice=document.getElementById('oldPrice');
const mobilePrice=document.getElementById('mobilePrice');
const mobileCopy=document.getElementById('mobileCopy');
const colorRow=document.getElementById('colorRow');
const mobileThumbStack=document.getElementById('mobileThumbStack');

products.forEach((p,i)=>{
  const b=document.createElement('button');
  b.className='color-dot';
  b.style.setProperty('--dot',p.bg);
  b.setAttribute('aria-label',p.name);
  b.onclick=()=>go(i);
  colorRow.appendChild(b);
  const t=document.createElement('button');
  t.className='mobile-thumb';
  t.innerHTML='<img src="oversized-tee.webp" alt=""><span>'+p.name+'</span>';
  t.onclick=()=>go(i);
  mobileThumbStack.appendChild(t);
});
function applySizeButtons(){
  document.querySelectorAll('.size-row button').forEach(btn=>{
    btn.classList.toggle('selected',btn.textContent===selectedSize);
    btn.onclick=()=>{selectedSize=btn.textContent;applySizeButtons();}
  });
}
function render(){
  const p=products[current],next=products[(current+1)%products.length];
  stage.style.setProperty('--bg',p.bg);
  img.style.filter=p.filter+' drop-shadow(0 28px 22px rgba(0,0,0,.28))';
  mini.style.filter=next.filter+' drop-shadow(0 12px 10px rgba(0,0,0,.18))';
  miniName.textContent=next.name;
  price.textContent=p.price;oldPrice.textContent=p.old;mobilePrice.textContent=p.price;mobileCopy.textContent=p.copy;
  [...colorRow.children].forEach((x,i)=>x.classList.toggle('selected',i===current));
  [...mobileThumbStack.children].forEach((x,i)=>{
    x.classList.toggle('active',i===current);
    const ti=x.querySelector('img');ti.style.filter=products[i].filter;
  });
}
function go(i){
  if(locked||i===current)return;
  locked=true;wrap.classList.add('switching');
  setTimeout(()=>{current=(i+products.length)%products.length;render();wrap.classList.remove('switching');setTimeout(()=>locked=false,350)},220);
}
document.getElementById('nextProduct').onclick=()=>go((current+1)%products.length);
document.getElementById('prevProduct').onclick=()=>go((current-1+products.length)%products.length);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go((current+1)%products.length);if(e.key==='ArrowLeft')go((current-1+products.length)%products.length)});
function add(){
  bag++;document.getElementById('bagCount').textContent=bag;
}
document.getElementById('addToCart').onclick=add;
document.getElementById('buyNow').onclick=add;
applySizeButtons();render();