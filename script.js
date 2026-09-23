const products = [
  {name:'Oxide', paper:'#e8b0a8', end:'#b94755', filter:'none', alt:'Burgundy oversized T-shirt'},
  {name:'Midnight', paper:'#96999d', end:'#3c4147', filter:'grayscale(1) brightness(.37) contrast(1.4)', alt:'Black oversized T-shirt'},
  {name:'Bone', paper:'#ede4c1', end:'#c8bd8d', filter:'grayscale(1) sepia(.5) brightness(1.72) contrast(.72)', alt:'Cream oversized T-shirt'},
  {name:'Cocoa', paper:'#b49b91', end:'#6f544b', filter:'hue-rotate(305deg) saturate(.38) brightness(.76)', alt:'Brown oversized T-shirt'}
];
let current=0, size='M', bag=0, locked=false;
const stage=document.querySelector('#stage'), shirt=document.querySelector('#shirt'), wrap=document.querySelector('#productWrap');
const colourName=document.querySelector('#colourName'), edition=document.querySelector('#edition'), swatches=document.querySelector('#swatches');
products.forEach((p,i)=>{const b=document.createElement('button');b.className='swatch'+(i===0?' selected':'');b.style.setProperty('--swatch',p.end);b.ariaLabel=`Show ${p.name}`;b.onclick=()=>go(i,i>current?1:-1);swatches.appendChild(b)});
function render(){const p=products[current];stage.style.setProperty('--paper',p.paper);stage.style.background=`radial-gradient(circle at 55% 43%,rgba(255,255,255,.2),transparent 29%),linear-gradient(115deg,${p.paper},${p.end})`;shirt.style.filter=`${p.filter} drop-shadow(0 30px 24px rgba(20,8,10,.27))`;shirt.alt=p.alt+' on a wooden hanger';colourName.textContent=p.name;edition.textContent=`0${current+1} / 04`;[...swatches.children].forEach((x,i)=>x.classList.toggle('selected',i===current));}
function go(next,dir){if(locked||next===current)return;locked=true;wrap.style.setProperty('--dir',`${dir*80}px`);wrap.style.setProperty('--tilt',`${dir*5}deg`);wrap.classList.add('changing');setTimeout(()=>{current=(next+products.length)%products.length;render();wrap.style.setProperty('--dir',`${dir*-80}px`);requestAnimationFrame(()=>{wrap.classList.remove('changing');setTimeout(()=>locked=false,430)})},320)}
document.querySelector('#next').onclick=()=>go((current+1)%products.length,1);document.querySelector('#prev').onclick=()=>go((current-1+products.length)%products.length,-1);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')document.querySelector('#next').click();if(e.key==='ArrowLeft')document.querySelector('#prev').click()});
document.querySelector('#sizes').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;document.querySelectorAll('.sizes button').forEach(b=>b.classList.remove('selected'));e.target.classList.add('selected');size=e.target.textContent});
document.querySelector('#addButton').onclick=()=>{bag++;document.querySelector('#bagCount').textContent=bag;const t=document.querySelector('#toast');t.textContent=`Added ${products[current].name} · ${size} to your bag`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
render();
