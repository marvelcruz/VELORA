const quotes=[
  {q:'“The fit changed the way I carried myself the moment I put it on.”',c:'Private client · Calgary'},
  {q:'“The process felt personal from the first measurement to the final fitting.”',c:'Private client · Bespoke suit'},
  {q:'“Beautiful fabric, clean finishing and a silhouette that actually feels like me.”',c:'Private client · Formalwear'}
];
let quoteIndex=0;
const quote=document.getElementById('quote'), client=document.getElementById('client');
function renderQuote(){quote.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320});quote.textContent=quotes[quoteIndex].q;client.textContent=quotes[quoteIndex].c}
document.getElementById('nextQuote').onclick=()=>{quoteIndex=(quoteIndex+1)%quotes.length;renderQuote()};
document.getElementById('prevQuote').onclick=()=>{quoteIndex=(quoteIndex-1+quotes.length)%quotes.length;renderQuote()};
const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');if(open){nav.style.display='flex';nav.style.position='absolute';nav.style.top='70px';nav.style.left='0';nav.style.right='0';nav.style.flexDirection='column';nav.style.background='#fbf8f3';nav.style.padding='20px';nav.style.borderBottom='1px solid rgba(23,19,16,.18)'}else{nav.removeAttribute('style')}});
document.getElementById('appointmentForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);document.getElementById('formStatus').textContent=`Thanks, ${fd.get('name')}. Your appointment request is ready to be connected to email/CRM.`;e.currentTarget.reset()});