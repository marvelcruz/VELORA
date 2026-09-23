const products = [
  {name:'Oxide', colour:'#86182d', shade:'#5b0d1c', ink:'#fff7f4', soft:'#18080d', filter:'none', alt:'Burgundy oversized T-shirt'},
  {name:'Midnight', colour:'#242629', shade:'#111214', ink:'#f7f4ef', soft:'#111214', filter:'grayscale(1) brightness(.37) contrast(1.4)', alt:'Black oversized T-shirt'},
  {name:'Bone', colour:'#e7ddbd', shade:'#c4b88f', ink:'#211d16', soft:'#211d16', filter:'grayscale(1) sepia(.5) brightness(1.72) contrast(.72)', alt:'Cream oversized T-shirt'},
  {name:'Cocoa', colour:'#66483e', shade:'#3c2923', ink:'#fff8f2', soft:'#21100c', filter:'hue-rotate(305deg) saturate(.38) brightness(.76)', alt:'Brown oversized T-shirt'}
];
let current=0, size='M', bag=0, locked=false;
const stage=document.querySelector('#stage'), shirt=document.querySelector('#shirt'), wrap=document.querySelector('#productWrap');
const colourName=document.querySelector('#colourName'), edition=document.querySelector('#edition'), swatches=document.querySelector('#swatches');
products.forEach((p,i)=>{const b=document.createElement('button');b.className='swatch'+(i===0?' selected':'');b.style.setProperty('--swatch',p.colour);b.ariaLabel=`Show ${p.name}`;b.onclick=()=>go(i,i>current?1:-1);swatches.appendChild(b)});
function render(){const p=products[current];stage.style.setProperty('--product-colour',p.colour);stage.style.setProperty('--product-shade',p.shade);stage.style.setProperty('--ink',p.ink);stage.style.setProperty('--soft',p.soft);shirt.style.filter=`${p.filter} drop-shadow(0 30px 24px rgba(10,4,6,.38))`;shirt.alt=p.alt+' on a wooden hanger';colourName.textContent=p.name;edition.textContent=`0${current+1} / 04`;[...swatches.children].forEach((x,i)=>x.classList.toggle('selected',i===current));}
function go(next,dir){if(locked||next===current)return;locked=true;wrap.style.setProperty('--dir',`${dir*80}px`);wrap.style.setProperty('--tilt',`${dir*5}deg`);wrap.classList.add('changing');setTimeout(()=>{current=(next+products.length)%products.length;render();wrap.style.setProperty('--dir',`${dir*-80}px`);requestAnimationFrame(()=>{wrap.classList.remove('changing');setTimeout(()=>locked=false,430)})},320)}
document.querySelector('#next').onclick=()=>go((current+1)%products.length,1);document.querySelector('#prev').onclick=()=>go((current-1+products.length)%products.length,-1);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')document.querySelector('#next').click();if(e.key==='ArrowLeft')document.querySelector('#prev').click()});
document.querySelector('#sizes').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;document.querySelectorAll('.sizes button').forEach(b=>b.classList.remove('selected'));e.target.classList.add('selected');size=e.target.textContent});
document.querySelector('#addButton').onclick=()=>{bag++;document.querySelector('#bagCount').textContent=bag;const t=document.querySelector('#toast');t.textContent=`Added ${products[current].name} · ${size} to your bag`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
render();
