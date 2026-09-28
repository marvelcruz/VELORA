const CATALOG={
men:{
  label:"MEN'S BESPOKE",
  title:"Power, tailored.\nMade for You.",
  hero:"Custom suits, tuxedos and coats shaped around your body, your occasion and the impression you want to leave.",
  tagline:"Boardroom.\nWedding. Black tie.",
  optionLabel:"Choose fabric",
  options:[
    {key:"Wool",short:"W",label:"Wool · Super 120s"},
    {key:"Cashmere",short:"C",label:"Cashmere blend"},
    {key:"Linen",short:"L",label:"Linen · Summer weight"},
    {key:"Polywool",short:"PW",label:"Polywool · Travel ready"}
  ],
  items:[
    {name:"Formal Suit",identity:"BOARDROOM / NAVY",image:"assets/generated-formal.svg",bg:"#b8c1c7",accent:"#213a50",price:"From $400",type:"Made to measure",desc:"A structured custom suit built for business, weddings and formal events, with proportions developed around your posture and preferred silhouette."},
    {name:"Classic Tuxedo",identity:"BLACK TIE / MIDNIGHT",image:"assets/generated-tuxedo.svg",bg:"#c7c3bd",accent:"#121212",price:"From $400",type:"Black-tie tailoring",desc:"Sharp lapels, refined finishing and premium cloth for weddings, galas and evenings where black tie is the language."},
    {name:"Embroidered Tuxedo",identity:"CEREMONY / MERLOT",image:"assets/generated-embroidered.svg",bg:"#cfb8b6",accent:"#681e30",price:"Custom quote",type:"Statement formalwear",desc:"Traditional tailoring elevated with embroidery and individual detailing for a tuxedo that feels one of one."},
    {name:"Long Coat",identity:"WINTER / CAMEL",image:"assets/generated-coat.svg",bg:"#d5c4ad",accent:"#775b3f",price:"Custom quote",type:"Bespoke outerwear",desc:"A long tailored coat designed to sit cleanly over suiting while keeping the silhouette refined and warm."},
    {name:"Asian Couture",identity:"HERITAGE / SAND",image:"assets/generated-asian.svg",bg:"#d8c7b0",accent:"#7e533a",price:"Custom quote",type:"Bespoke couture",desc:"Traditional and contemporary Asian occasionwear shaped by generations of specialist tailoring experience."}
  ]
},
women:{
  label:"WOMEN'S BESPOKE",
  title:"Structure with grace.\nCut around you.",
  hero:"Tailored suits, skirts, pants, coats and formal pieces designed for presence without sacrificing movement.",
  tagline:"Work.\nOccasion. Evening.",
  optionLabel:"Choose finish",
  options:[
    {key:"Classic",short:"CL",label:"Classic tailoring"},
    {key:"Satin",short:"ST",label:"Satin detail"},
    {key:"Contrast",short:"CT",label:"Contrast lapel"},
    {key:"Soft",short:"SF",label:"Soft structure"}
  ],
  items:[
    {name:"Formal Suit",identity:"EXECUTIVE / NOIR",image:"assets/generated-womens-suit.svg",bg:"#dcc8c2",accent:"#151515",price:"Custom quote",type:"Precision tailoring",desc:"A polished suit cut around your proportions for corporate, business and formal occasions."},
    {name:"Designer Tuxedo",identity:"EVENING / ONYX",image:"assets/generated-womens-tuxedo.svg",bg:"#d4ceb8",accent:"#151515",price:"Custom quote",type:"Designer formalwear",desc:"Premium fabrics and distinctive lapel details give this tuxedo a sharper evening identity."},
    {name:"Formal Dress",identity:"EVENING / PLUM",image:"assets/generated-womens-dress.svg",bg:"#d8c4ce",accent:"#5c1938",price:"Custom quote",type:"Made to measure",desc:"A graceful made-to-measure evening dress with fluid drape, a defined waist and a refined formal silhouette."},
    {name:"Long Coat",identity:"WINTER / IVORY",image:"assets/generated-coat.svg",bg:"#e4ddd0",accent:"#8a7967",price:"Custom quote",type:"Tailored outerwear",desc:"A long coat in a refined light palette, designed for warmth, elegance and easy layering."},
    {name:"Culottes",identity:"MODERN / BLACK",image:"assets/generated-culottes.svg",bg:"#e3d8d5",accent:"#111111",price:"Custom quote",type:"Contemporary tailoring",desc:"Wide-leg culottes with a modern proportion that works from office styling to evening dressing."}
  ]
},
accessories:{
  label:"ACCESSORIES",
  title:"Small details.\nStrong identity.",
  hero:"The final ten percent changes the whole look — shoes, ties, cufflinks and pocket squares chosen to complete the tailoring.",
  tagline:"Finish the suit.\nOwn the detail.",
  optionLabel:"Choose detail",
  options:[
    {key:"Classic",short:"CL",label:"Classic"},
    {key:"Bold",short:"BD",label:"Bold"},
    {key:"Formal",short:"FM",label:"Formal"},
    {key:"Gift",short:"GF",label:"Gift ready"}
  ],
  items:[
    {name:"Formal Shoes",identity:"SHOES / COGNAC",image:"assets/generated-accessories.svg",bg:"#dec7a8",accent:"#a96521",price:"Enquire",type:"Leather footwear",desc:"Polished formal shoes in a warm cognac tone, built to finish tailored looks with a richer base."},
    {name:"Plaid Tie",identity:"TIE / CHECK",image:"assets/generated-accessories.svg",bg:"#cad5e2",accent:"#b31d26",price:"Enquire",type:"Silk accessory",desc:"A patterned tie that brings color and rhythm into a clean suit without overpowering it."},
    {name:"Cufflinks",identity:"CUFFLINKS / BLUE",image:"assets/generated-accessories.svg",bg:"#c6cfdb",accent:"#264f96",price:"Enquire",type:"Formal finishing",desc:"Cufflinks designed as a precise finishing touch for French cuffs, tuxedos and formal shirts."},
    {name:"Pocket Square",identity:"POCKET / TEAL",image:"assets/generated-accessories.svg",bg:"#bdd6d3",accent:"#047d82",price:"Enquire",type:"Silk detail",desc:"A teal patterned pocket square that adds controlled color and texture against dark tailoring."},
    {name:"Gift Box",identity:"GIFT / BURNT ORANGE",image:"assets/generated-accessories.svg",bg:"#e3c0a5",accent:"#b84c1c",price:"Enquire",type:"Curated gift",desc:"A presentation box for ties, cufflinks and finishing accessories — built for gifting or a complete formal set."}
  ]
}
};

let category="men";
let activeIndex=0;
let selectedOption="Wool";
let isAnimating=false;
let isMobile=window.innerWidth<640;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const showroom=$("#showroom");
const carouselStage=$("#carouselStage");
const mobileCarouselStage=$("#mobileCarouselStage");
const fallback="oversized-tee.webp";
const cfg=()=>CATALOG[category];
const items=()=>cfg().items;

function preloadAll(){
  Object.values(CATALOG).forEach(group=>{
    group.items.forEach(item=>{
      const img=new Image();
      img.src=item.image;
    });
  });
}
preloadAll();

window.addEventListener("resize",()=>{isMobile=window.innerWidth<640});

function safeImage(img,src){
  img.onerror=()=>{img.onerror=null;img.src=fallback};
  img.src=src||fallback;
}

function roleFor(i){
  const n=items().length;
  const center=activeIndex;
  const left=(activeIndex+n-1)%n;
  const right=(activeIndex+1)%n;
  const back=(activeIndex+2)%n;
  if(i===center)return "center";
  if(i===left)return "left";
  if(i===right)return "right";
  if(i===back)return "back";
  return "hidden";
}

function buildCarousel(stage){
  stage.innerHTML="";
  items().forEach((item,i)=>{
    const wrap=document.createElement("div");
    wrap.className="carousel-item role-"+roleFor(i);
    wrap.dataset.index=i;
    const img=document.createElement("img");
    img.draggable=false;
    img.alt=item.name;
    safeImage(img,item.image);
    wrap.appendChild(img);
    stage.appendChild(wrap);
  });
}

function updateRoles(stage){
  [...stage.children].forEach((el,i)=>{
    el.className="carousel-item role-"+roleFor(i);
  });
}

function setOptions(){
  const opts=cfg().options;
  [$("#desktopFabrics"),$("#mobileFabrics")].forEach(row=>{
    row.innerHTML="";
    opts.forEach((o,i)=>{
      const b=document.createElement("button");
      b.className="fabric-btn interactive"+(i===0?" selected":"");
      b.dataset.fabric=o.key;
      b.textContent=o.short;
      b.title=o.label;
      b.onclick=()=>selectOption(o.key);
      row.appendChild(b);
    });
  });
  selectedOption=opts[0].key;
  $("#fabricName").textContent=opts[0].label;
  $("#optionLabelDesktop").textContent=cfg().optionLabel;
  $("#optionLabelMobile").textContent=cfg().optionLabel;
}

function renderData(){
  const p=items()[activeIndex];
  showroom.style.setProperty("--bg",p.bg);
  showroom.style.setProperty("--accent",p.accent);

  $("#desktopItemName").textContent=p.name;
  $("#mobileItemName").textContent=p.name;
  $("#mobileItemName").dataset.identity=p.identity;
  $("#priceLabel").textContent=p.price;
  $("#mobilePrice").textContent=p.price;
  $("#detailType").textContent=p.identity;
  $("#mobileDescription").textContent=p.desc;

  $("#microLabel").textContent="RIVAADO · "+cfg().label;
  $("#heroTitle").innerHTML=cfg().title.replace("\n","<br>");
  $("#heroDescription").textContent=cfg().hero;
  $("#tagline").innerHTML=cfg().tagline.replace("\n","<br>");
  $("#ghostWord").textContent=category==="accessories"?"DETAILS":category==="women"?"FORM": "BESPOKE";
}

function render(){
  updateRoles(carouselStage);
  updateRoles(mobileCarouselStage);
  renderData();
}

function navigate(direction){
  if(isAnimating)return;
  isAnimating=true;
  const n=items().length;
  activeIndex=direction==="next"?(activeIndex+1)%n:(activeIndex+n-1)%n;
  render();
  setTimeout(()=>{isAnimating=false},650);
}

$("#nextBtn").onclick=()=>navigate("next");
$("#mobileNext").onclick=()=>navigate("next");
$("#prevBtn").onclick=()=>navigate("prev");
$("#mobilePrev").onclick=()=>navigate("prev");

function selectOption(key){
  selectedOption=key;
  const o=cfg().options.find(x=>x.key===key);
  $$(".fabric-btn").forEach(b=>b.classList.toggle("selected",b.dataset.fabric===key));
  $("#fabricName").textContent=o?o.label:key;
  toast((o?o.label:key)+" selected");
}

function switchCategory(nextCategory){
  if(nextCategory==="about"){openAbout();closeDrawer();return}
  if(!CATALOG[nextCategory])return;
  if(isAnimating)return;
  category=nextCategory;
  activeIndex=0;
  $$(".category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
  $("#mobileCategoryTitle").textContent=category[0].toUpperCase()+category.slice(1);
  setOptions();
  buildCarousel(carouselStage);
  buildCarousel(mobileCarouselStage);
  renderData();
  closeDrawer();
}
$$("[data-category]").forEach(b=>b.addEventListener("click",()=>switchCategory(b.dataset.category)));

function toast(msg){
  const t=$("#toast");
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>t.classList.remove("show"),1400);
}

function openAbout(){$("#aboutPanel").classList.add("open")}
function openBooking(){$("#bookingPanel").classList.add("open")}
function closeDrawer(){
  $("#mobileDrawer").classList.remove("open");
  $("#mobileDrawer").setAttribute("aria-hidden","true");
}

$("#menuBtn").onclick=()=>{
  $("#mobileDrawer").classList.add("open");
  $("#mobileDrawer").setAttribute("aria-hidden","false");
};
$("#drawerClose").onclick=closeDrawer;
$("#aboutClose").onclick=()=>$("#aboutPanel").classList.remove("open");
$("#bookingClose").onclick=()=>$("#bookingPanel").classList.remove("open");
["#bookTop","#bookMain","#bookMobile","#aboutBook"].forEach(id=>$(id).onclick=openBooking);
$("#discoverLink").onclick=e=>{e.preventDefault();openBooking()};
$("#enquireMobile").onclick=()=>{
  window.location.href="mailto:Info@rivaado.com?subject="+encodeURIComponent("Rivaado enquiry: "+items()[activeIndex].name)
};
$("#contactBtn").onclick=openAbout;

$("#bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  const name=(fd.get("name")||"").toString().trim();
  $("#bookingStatus").textContent="Thank you"+(name?", "+name:"")+". Your fitting request is ready to confirm with Rivaado.";
});

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight")navigate("next");
  if(e.key==="ArrowLeft")navigate("prev");
  if(e.key==="Escape"){
    $("#aboutPanel").classList.remove("open");
    $("#bookingPanel").classList.remove("open");
    closeDrawer();
  }
});

setOptions();
buildCarousel(carouselStage);
buildCarousel(mobileCarouselStage);
renderData();
