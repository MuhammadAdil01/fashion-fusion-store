/* Fashion Fusion — Online Clothing Store : application script */
/* ============================================================
   FASHION FUSION — application script
   Sections: 1 storage  2 seed data  3 product photography  4 helpers
             5 router   6 views      7 admin      8 auth/init
   ============================================================ */

/* ---------- 1. STORAGE (localStorage, per the local-host constraint) ---------- */
const KEY='ff_store_v7';
let DB=null, S={view:'home', params:{}, adminTab:'dash', toastId:0};

function save(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){ /* private mode: run in memory */ } }
function load(){
  try{ const raw=localStorage.getItem(KEY); if(raw) return JSON.parse(raw); }catch(e){}
  return null;
}

/* ---------- 2. SEED DATA (Products / Users / Orders / Reviews) ---------- */
const CATEGORIES=[
  {name:'Women',  blurb:'Kurtas, dresses, co-ords',      img:'categories/women.jpg'},
  {name:'Men',    blurb:'Shirts, kameez, denim',         img:'categories/men.jpg'},
  {name:'Kids',   blurb:'Everyday and party wear',       img:'categories/kids.jpg'},
  {name:'Footwear',blurb:'Khussa, sneakers, sandals',    img:'categories/footwear.jpg'},
  {name:'Accessories',blurb:'Bags, shawls, watches',     img:'categories/accessories.jpg'}
];

/* Local product photography — drop a file at images/products/<id>.<ext> and
   update the path below to swap the placeholder for the real photo. */
const PRODUCT_IMG={
  'P-1001':'products/P-1001.jpg',
  'P-1002':'products/P-1002.jpg',
  'P-1003':'products/P-1003.jpg',
  'P-1005':'products/P-1005.jpg',
  'P-1007':'products/P-1007.jpg',
  'P-2002':'products/P-2002.jpg',
  'P-2003':'products/P-2003.jpg',
  'P-2004':'products/P-2004.jpg',
  'P-2006':'products/P-2006.jpg',
  'P-3001':'products/P-3001.jpg',
  'P-3002':'products/P-3002.jpg',
  'P-3003':'products/P-3003.jpg',
  'P-3004':'products/P-3004.jpg',
  'P-4001':'products/P-4001.jpg',
  'P-4002':'products/P-4002.jpg',
  'P-4003':'products/P-4003.jpg',
  'P-4004':'products/P-4004.jpg',
  'P-5001':'products/P-5001.jpg',
  'P-5003':'products/P-5003.jpg',
  'P-5004':'products/P-5004.jpg',
  'P-5005':'products/P-5005.jpg',
  'P-5006':'products/P-5006.jpg'
};
const FALLBACK_IMG='fallback.jpg';
const HERO_IMG='hero.jpg';
const HERO_TAG_IMG='hero-tag.jpg';

function seedProducts(){
  const P=(id,name,category,type,price,was,desc,colors,sizes,stock,rating,tags)=>
    ({id,name,category,type,price,was,desc,colors,sizes,stock,rating,tags:tags||[],reviews:[],img:PRODUCT_IMG[id]||null});
  return [
    P('P-1001','Ladies Lawn Kurta','Women','kurta',4200,5600,'Hand detailing on breathable summer lawn. Straight cut with side slits and a boat neckline that sits well under a shawl.',[['Ivory','#EFE7D8'],['Mint','#CFE0D2'],['Powder blue','#C9D8E8']],['XS','S','M','L','XL'],14,4.6,['new','sale']),
    P('P-1002','Cotton Dress','Women','dress',5400,null,'Ajrak-inspired block print on mid-weight cotton. Gathered waist, full lining and functional side pockets.',[['Indigo','#2E3F6E'],['Madder red','#9E3446']],['S','M','L','XL'],9,4.4,['new']),
    P('P-1003','Silk Blend Dupatta','Women','scarf',2300,null,'Two and a half metres of silk-blend voile with a hand-rolled edge. Light enough for summer, wide enough to drape.',[['Gold','#D9A63C'],['Rose','#C9788A'],['Black','#22242C']],['One size'],26,4.2,[]),
    P('P-1005','Long Coat','Women','coat',7600,null,'Ankle-grazing coat in brushed wool-blend with a tie belt and deep front pockets. Layers over a kurta or a plain kameez.',[['Sand','#DCCFB8'],['Olive','#6E7355']],['S','M','L','XL'],11,4.3,['new']),
    P('P-1007','Ladies Jackets','Women','jacket',6900,null,'Fitted denim jacket with a soft brushed lining, patch pockets and button cuffs. Wears over a kurta or a shirt.',[['Light blue','#8FAECD'],['Black','#26262C']],['S','M','L','XL'],10,4.3,[]),

    P('P-2002','Dress Shirts','Men','shirt',5900,null,'Tailored shirt in fine cotton poplin with a spread collar and a single cuff. Sits well under a waistcoat or worn open.',[['Off white','#EDE8DC'],['Graphite','#3B3F48'],['Sage','#7C8A72']],['M','L','XL','XXL'],17,4.7,['new']),
    P('P-2003','Slim Fit Denim','Men','jeans',4800,6200,'Twelve-ounce stretch denim, slim through the thigh with a mid rise. Five pocket, riveted.',[['Mid blue','#3F5A82'],['Jet black','#26272C']],['30','32','34','36','38'],21,4.2,['sale']),
    P('P-2004','Mens Hoodies','Men','hoodie',5200,null,'Brushed fleece inside, flat-knit ribbing at the cuff. Two-way zip and a lined hood.',[['Navy','#243A5E'],['Heather grey','#9AA0A8'],['Maroon','#6E2B34']],['S','M','L','XL'],15,4.4,['new']),
    P('P-2006','printed Shirts','Men','trousers',3900,null,'Garment-dyed cotton twill with a touch of stretch. Straight leg, clean finish at the hem.',[['Khaki','#C2AE87'],['Navy','#2C3A56'],['Stone','#B9B4A6']],['30','32','34','36'],24,4.0,[]),

    P('P-3001','Kids Printed T-shirt','Kids','tshirt',1200,null,'Soft single-jersey with a water-based print that will not crack after a few washes.',[['Yellow','#E8C24A'],['Aqua','#7EC4CF'],['Coral','#E28A72']],['2Y','4Y','6Y','8Y','10Y'],44,4.5,[]),
    P('P-3002','Girls Party Frock','Kids','dress',3600,4500,'Tulle over a cotton lining so it holds its shape without scratching. Back tie sash.',[['Blush','#E9C3CB'],['Lilac','#C4B2D8']],['2Y','4Y','6Y','8Y'],12,4.6,['sale']),
    P('P-3003','Jeans Pants','Kids','jeans',2900,null,'Soft stretch denim with an adjustable elastic waist, built for a full day of play without wearing thin at the knee.',[['Indigo','#33456E'],['Black','#2A2A2E']],['2Y','4Y','6Y','8Y','10Y'],19,4.4,['new']),
    P('P-3004','Kids Denim Jacket','Kids','jacket',3200,null,'Washed denim with metal buttons and a jersey-lined body for the cooler months.',[['Light blue','#8FAECD'],['Indigo','#33456E']],['4Y','6Y','8Y','10Y'],8,4.2,[]),

    P('P-4001','Hand-stitched Khussa','Footwear','sandals',3100,null,'Leather khussa stitched in Multan, with a cushioned insole added for daily wear.',[['Tan','#B4814C'],['Black','#2A2A2E'],['Gold','#C9A24A']],['36','37','38','39','40','41','42'],18,4.7,['new']),
    P('P-4002','Canvas Sneakers','Footwear','shoes',4300,5400,'Cotton canvas upper on a vulcanised rubber sole. Breaks in within a week.',[['Off white','#EFEDE6'],['Navy','#2B3A5C'],['Olive','#6B7356']],['39','40','41','42','43','44'],23,4.3,['sale']),
    P('P-4003','Leather Formal Shoes','Footwear','shoes',8900,null,'Full-grain leather derby with a leather-lined footbed and a stitched welt.',[['Brown','#6B4A31'],['Black','#232328']],['39','40','41','42','43','44'],10,4.6,[]),
    P('P-4004','Slip-on Sandals','Footwear','sandals',2200,null,'Moulded footbed with a soft strap. Rated for the heat, not for the rain.',[['Brown','#7A5B3E'],['Grey','#7C808A']],['37','38','39','40','41','42'],31,4.0,[]),

    P('P-5001',' Simple Bags','Accessories','bag',1800,null,'Sixteen-ounce canvas with a reinforced base and an inner pocket that fits a phone and keys.',[['Natural','#DFD6C0'],['Black','#2A2B30'],['Rust','#A5573C']],['One size'],40,4.2,[]),
    P('P-5003','Leather Belt','Accessories','bag',2400,null,'Thirty-five millimetre full-grain strap with a brushed brass buckle.',[['Brown','#6A4A32'],['Black','#26262A']],['32','34','36','38','40'],27,4.1,[]),
    P('P-5004','Ladies Watches','Accessories','watch',9400,null,'Slim thirty-two millimetre steel case, sapphire-coated glass and a quick-release leather strap.',[['Silver','#C6C9CE'],['Rose gold','#D2A38F'],['Black','#2C2D33']],['One size'],6,4.5,['new']),
    P('P-5005','Hand Clutch','Accessories','bag',3300,null,'Hand clutch with a detachable chain, sized for a phone and a card holder.',[['Ivory','#EDE4D2'],['Teal','#2E6367']],['One size'],9,4.4,[]),
    P('P-5006','Mens Watches','Accessories','watch',10800,null,'Forty-two millimetre steel case with a day-date window and a genuine leather strap.',[['Black','#2C2D33'],['Brown','#6A4A32'],['Silver','#C6C9CE']],['One size'],8,4.5,[])
  ];
}

const SEED_REVIEWS=[
  ['P-1001','Ayesha Siddiqui',5,'Fabric is genuinely lawn, not a polyester mix. Embroidery survived two washes.'],
  ['P-1001','Hira Nadeem',4,'Lovely colour but runs a little long — I had it shortened by an inch.'],
  ['P-2002','Bilal Ahmed',5,'Stitching is neat and the shalwar is generous. Wore it to Eid prayers.'],
  ['P-2003','Usman Tariq',4,'Good denim for the price. Slim is truly slim, size up if you are between.'],
  ['P-4001','Fatima Khalid',5,'The insole makes all the difference. Comfortable for a whole wedding.'],
  ['P-4002','Zain Abbas',4,'Clean shape, sole is solid. Took a few days to soften.']
];

function seedDB(){
  const products=seedProducts();
  SEED_REVIEWS.forEach(([pid,name,rating,comment],i)=>{
    const p=products.find(x=>x.id===pid);
    if(p) p.reviews.push({id:'R-'+(9000+i),userId:null,name,rating,comment,date:daysAgo(4+i*3)});
  });
  return {
    products,
    categories:CATEGORIES.map(c=>({...c})),
    users:[
      {id:'U-0001',firstName:'Store',lastName:'Admin',email:'admin@fashionfusion.pk',password:'admin1234',role:'admin',
       shipping:{name:'Store Admin',phone:'0301-0000000',address:'Model Town A',city:'Bahawalpur',postal:'63100'},billing:''},
      {id:'U-0002',firstName:'Ayesha',lastName:'Siddiqui',email:'ayesha@example.com',password:'ayesha123',role:'customer',
       shipping:{name:'Ayesha Siddiqui',phone:'0312-4567890',address:'House 12, Satellite Town',city:'Bahawalpur',postal:'63100'},billing:''}
    ],
    orders:[
      {id:'ORD-24051',trackingId:'FF7QK2M',userId:'U-0002',
       items:[{productId:'P-1001',name:'Ladies Lawn Kurta',size:'M',color:'Mint',qty:1,price:4200}],
       subtotal:4200,delivery:{label:'Standard delivery',fee:200},payment:'Cash on delivery',
       shipping:{name:'Ayesha Siddiqui',phone:'0312-4567890',address:'House 12, Satellite Town',city:'Bahawalpur',postal:'63100'},
       total:4400,status:'Delivered',date:daysAgo(11)}
    ],
    cart:[],
    wishlist:[],
    session:null,
    counters:{order:24052,user:3,product:6001,review:9100}
  };
}
function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return d.toISOString()}

/* ---------- 3. PRODUCT PHOTOGRAPHY ----------
   Local images only (no external stock photography). A product stores a
   path relative to /images/; photoUrl() resolves it to a servable URL.
   Card and thumbnail containers are fixed-size with object-fit:cover, so
   the same file works at every size without a resizing service. */
function photoUrl(id){
  return `images/${id}`;
}
function productImgId(p){ return (p&&p.img)||FALLBACK_IMG; }
function imgTag(id,w,h,cls,alt,crop,eager){
  const url=photoUrl(id);
  return `<img class="${cls||''}" src="${url}" loading="${eager?'eager':'lazy'}" decoding="async" alt="${esc(alt||'')}">`;
}
function productShot(p,w,h,cls,eager){
  return imgTag(productImgId(p),w,h,cls,p.name,'entropy',eager);
}

/* ---------- 4. HELPERS ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=n=>'Rs '+Number(n||0).toLocaleString('en-PK');
const fmtDate=d=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function starStr(r){const f=Math.round(r);return '★★★★★'.slice(0,f)+'☆☆☆☆☆'.slice(0,5-f)}
function avgRating(p){
  if(!p.reviews.length) return p.rating;
  return p.reviews.reduce((a,r)=>a+r.rating,0)/p.reviews.length;
}
function toast(msg,kind){
  const el=document.createElement('div');
  el.className='toast'+(kind?' '+kind:'');
  el.textContent=msg;
  $('#toasts').appendChild(el);
  setTimeout(()=>el.remove(),3200);
}
function me(){ return DB.session ? DB.users.find(u=>u.id===DB.session) : null; }
function isAdmin(){ const u=me(); return !!u && u.role==='admin'; }
function cartCount(){ return DB.cart.reduce((a,i)=>a+i.qty,0); }
function findProduct(id){ return DB.products.find(p=>p.id===id); }
function nextId(kind,prefix,pad){
  const n=DB.counters[kind]++; save();
  return prefix+String(n).padStart(pad||4,'0');
}
function isWished(id){ return DB.wishlist.includes(id); }
function toggleWishlist(id){
  const i=DB.wishlist.indexOf(id);
  if(i>-1){ DB.wishlist.splice(i,1); toast('Removed from wishlist'); }
  else { DB.wishlist.push(id); toast('Saved to your wishlist','good'); }
  save(); paintHeader();
}
function wishIcon(id,on){
  return `<button class="wish ${on?'on':''}" data-wish="${esc(id)}" aria-label="${on?'Remove from wishlist':'Add to wishlist'}" title="Wishlist">
    <svg viewBox="0 0 20 20"><path d="M10 17S2.5 12.6 2.5 7.6C2.5 5 4.6 3 7.1 3c1.4 0 2.5.6 3 1.6.5-1 1.6-1.6 3-1.6 2.5 0 4.6 2 4.6 4.6 0 5-7.7 9.4-7.7 9.4Z"/></svg>
  </button>`;
}
function bindWish(root){
  (root||document).querySelectorAll('[data-wish]').forEach(b=>{
    b.onclick=(e)=>{ e.stopPropagation(); toggleWishlist(b.dataset.wish); render(); };
  });
}

/* ---------- 5. ROUTER ---------- */
function go(view,params){
  S.view=view; S.params=params||{};
  if(view==='product') S.pdp=null;      /* fresh colour/size/quantity each visit */
  $('#mainNav').classList.remove('open');
  closeAC();
  try{ window.scrollTo({top:0,behavior:'instant'}); }catch(e){}
  render();
}
function render(){
  paintHeader();
  const m=$('#main');
  const views={home:viewHome,shop:viewShop,product:viewProduct,cart:viewCart,
    checkout:viewCheckout,orders:viewOrders,order:viewOrder,account:viewAccount,
    support:viewSupport,admin:viewAdmin,wishlist:viewWishlist};
  m.innerHTML=(views[S.view]||viewHome)();
  if(afterRender[S.view]) afterRender[S.view]();
}
const afterRender={};

function paintHeader(){
  const nav=$('#mainNav');
  const items=[['All products','shop',{}]].concat(DB.categories.map(c=>[c.name,'shop',{category:c.name}]));
  items.push(['Support','support',{}]);
  if(isAdmin()) items.push(['Admin','admin',{}]);
  nav.innerHTML=items.map(([label,v,p])=>{
    const on=(S.view===v && (v!=='shop' || (S.params.category||'')===(p.category||'')));
    return `<button class="${on?'on':''}" data-v="${v}" data-c="${p.category||''}">${esc(label)}</button>`;
  }).join('');
  nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const c=b.dataset.c; go(b.dataset.v, c?{category:c}:{});
  });
  const n=cartCount();
  const badge=$('#cartBadge');
  badge.style.display=n?'grid':'none'; badge.textContent=n;
  const wn=DB.wishlist.length;
  const wbadge=$('#wishBadge');
  wbadge.style.display=wn?'grid':'none'; wbadge.textContent=wn;
  $('#footCats').innerHTML=DB.categories.map(c=>`<li data-c="${esc(c.name)}">${esc(c.name)}</li>`).join('');
  $('#footCats').querySelectorAll('li').forEach(li=>li.onclick=()=>go('shop',{category:li.dataset.c}));
  paintThemeBtn();
}
/* ---------- 6. VIEWS ---------- */
let F={category:'',q:'',sizes:[],colors:[],min:0,max:20000,inStock:false,sort:'featured'};

function pcardHTML(p){
  const r=avgRating(p), sale=p.was&&p.was>p.price;
  const tag = p.tags.includes('new')?'<span class="tag new">New in</span>'
            : sale?`<span class="tag">${Math.round(100-(p.price/p.was*100))}% off</span>`:'';
  return `<div class="pcard" data-id="${p.id}" role="button" tabindex="0">
    <span class="shot">${productShot(p,480,560,'')}</span>
    ${tag}
    ${wishIcon(p.id,isWished(p.id))}
    <span class="quick" data-quick="${p.id}">View</span>
    <span class="meta">
      <span class="nm">${esc(p.name)}</span>
      <span class="cat">${esc(p.category)} · ${p.colors.length} colour${p.colors.length>1?'s':''}</span>
      <span class="row">
        <span class="price">${money(p.price)}${sale?`<s>${money(p.was)}</s>`:''}</span>
        <span class="stars" title="${r.toFixed(1)} out of 5">${starStr(r)}</span>
      </span>
    </span>
  </div>`;
}
function bindCards(root){
  (root||document).querySelectorAll('.pcard').forEach(c=>{
    c.onclick=()=>go('product',{id:c.dataset.id});
    c.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go('product',{id:c.dataset.id}); } };
  });
  bindWish(root);
}

/* ----- HOME ----- */
function viewHome(){
  const fresh=DB.products.filter(p=>p.tags.includes('new')).slice(0,8);
  const sale=DB.products.filter(p=>p.was&&p.was>p.price).slice(0,4);
  return `<div class="wrap">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <span class="hero-label">New season</span>
          <h1>Built different.<br>Wear <span>yours</span>.</h1>
          <p class="lede">Streetwear-grade basics and statement pieces, picked for Bahawalpur weather. Look around without an account — you will only need one when you are ready to buy.</p>
          <div class="hero-cta">
            <button class="btn" onclick="go('shop',{})">Shop now
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </button>
            <button class="btn btn-ghost" onclick="go('shop',{category:'Women'})">Explore lookbook</button>
          </div>
          <div class="hero-features">
            <div class="hf"><span class="ic"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7.2"/><path d="M3 10h14M10 2.8c2 2 3 4.6 3 7.2s-1 5.2-3 7.2c-2-2-3-4.6-3-7.2s1-5.2 3-7.2Z"/></svg></span>
              <span><b>Worldwide shipping</b><span>Fast &amp; secure delivery</span></span></div>
            <div class="hf"><span class="ic"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5 8 14l8-8"/></svg></span>
              <span><b>Premium quality</b><span>Made to last</span></span></div>
            <div class="hf"><span class="ic"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2.5 4 5v4.5c0 4 2.6 7 6 8 3.4-1 6-4 6-8V5Z"/></svg></span>
              <span><b>Secure payments</b><span>100% protected</span></span></div>
          </div>
        </div>
        <div class="hero-media">
          <div class="frame">${imgTag(HERO_IMG,900,1125,'','A model wearing an oversized graphic tee','entropy',true)}</div>
          <div class="hero-quote">"It's not just clothing, it's a vibe."</div>
          <div class="hero-tag">${DB.products.length}+ styles</div>
        </div>
      </div>
    </section>

    <div class="stitch"></div>
    <h2 class="h-sec">Shop by category</h2>
    <p class="sec-note">Five departments, one checkout.</p>
    <div class="strip">
      ${DB.categories.map(c=>`<button class="cat-card" data-c="${esc(c.name)}">
          <span class="sw">${imgTag(c.img,340,300,'',c.name)}</span>
          <span class="lbl">${esc(c.name)}<small>${esc(c.blurb)}</small></span>
        </button>`).join('')}
    </div>

    <div class="stitch"></div>
    <h2 class="h-sec">New arrivals</h2>
    <p class="sec-note">Added to the catalogue this month.</p>
    <div class="grid">${fresh.map(pcardHTML).join('')}</div>

    <div class="promo">
      ${imgTag(HERO_TAG_IMG,1400,700,'bg','Summer sale')}
      <div class="promo-body">
        <div>
          <h3>Eid sale — up to 25% off</h3>
          <p>Selected kurtas, denim and footwear. Prices already reduced on the product page, no code needed.</p>
        </div>
        <button class="btn btn-gold" onclick="go('shop',{sale:1})">See reduced items</button>
      </div>
    </div>

    <div class="stitch"></div>
    <h2 class="h-sec">Still reduced</h2>
    <p class="sec-note">Limited sizes remaining.</p>
    <div class="grid">${sale.map(pcardHTML).join('')}</div>
  </div>`;
}
afterRender.home=()=>{
  bindCards();
  document.querySelectorAll('.cat-card').forEach(b=>b.onclick=()=>go('shop',{category:b.dataset.c}));
};

/* ----- SHOP / CATALOGUE ----- */
function applyFilters(){
  let list=DB.products.slice();
  if(F.category) list=list.filter(p=>p.category===F.category);
  if(S.params.sale) list=list.filter(p=>p.was&&p.was>p.price);
  if(F.q){
    const q=F.q.toLowerCase();
    list=list.filter(p=>(p.name+' '+p.category+' '+p.type+' '+p.desc).toLowerCase().includes(q));
  }
  if(F.sizes.length) list=list.filter(p=>p.sizes.some(s=>F.sizes.includes(s)));
  if(F.colors.length) list=list.filter(p=>p.colors.some(c=>F.colors.includes(c[0])));
  if(F.inStock) list=list.filter(p=>p.stock>0);
  list=list.filter(p=>p.price>=F.min&&p.price<=F.max);
  const by={
    'price-asc':(a,b)=>a.price-b.price,
    'price-desc':(a,b)=>b.price-a.price,
    'rating':(a,b)=>avgRating(b)-avgRating(a),
    'new':(a,b)=>(b.tags.includes('new')?1:0)-(a.tags.includes('new')?1:0)
  }[F.sort];
  if(by) list.sort(by);
  return list;
}
function allSizes(){const s=new Set();DB.products.forEach(p=>p.sizes.forEach(x=>s.add(x)));return [...s]}
function allColors(){
  const m=new Map();DB.products.forEach(p=>p.colors.forEach(([n,h])=>{if(!m.has(n))m.set(n,h)}));
  return [...m.entries()];
}
function viewShop(){
  if(S.params.category!==undefined) F.category=S.params.category;
  const list=applyFilters();
  const title=S.params.sale?'Reduced items':(F.category||'All products');
  const active=[];
  if(F.q) active.push(['search','"'+F.q+'"']);
  F.sizes.forEach(s=>active.push(['size',s]));
  F.colors.forEach(c=>active.push(['color',c]));
  if(F.inStock) active.push(['stock','In stock only']);
  return `<div class="wrap"><div class="shop">
    <aside class="filters">
      <div class="fgroup">
        <h4>Category</h4>
        <label class="fopt"><input type="radio" name="cat" value="" ${F.category?'':'checked'}> All departments</label>
        ${DB.categories.map(c=>`<label class="fopt"><input type="radio" name="cat" value="${esc(c.name)}" ${F.category===c.name?'checked':''}> ${esc(c.name)}</label>`).join('')}
      </div>
      <div class="fgroup">
        <h4>Price</h4>
        <div class="grid2" style="gap:0 8px">
          <label class="field" style="margin-bottom:6px"><span>From</span><input class="input" id="fmin" type="number" min="0" value="${F.min}"></label>
          <label class="field" style="margin-bottom:6px"><span>To</span><input class="input" id="fmax" type="number" min="0" value="${F.max}"></label>
        </div>
        <button class="btn btn-ghost btn-sm" id="applyPrice">Apply price</button>
      </div>
      <div class="fgroup">
        <h4>Size</h4>
        <div class="chipline">${allSizes().map(s=>`<button class="sizebtn ${F.sizes.includes(s)?'on':''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}</div>
      </div>
      <div class="fgroup">
        <h4>Colour</h4>
        <div class="swatches">${allColors().map(([n,h])=>`<button class="sw-dot ${F.colors.includes(n)?'on':''}" data-color="${esc(n)}" style="background:${h}" title="${esc(n)}" aria-label="${esc(n)}"></button>`).join('')}</div>
      </div>
      <div class="fgroup">
        <h4>Availability</h4>
        <label class="fopt"><input type="checkbox" id="fstock" ${F.inStock?'checked':''}> In stock only</label>
      </div>
      <div class="fgroup"><button class="btn btn-ghost btn-sm btn-block" id="clearF">Clear all filters</button></div>
    </aside>

    <section>
      <div class="shop-head">
        <div>
          <h2 class="h-sec" style="margin-bottom:2px">${esc(title)}</h2>
          <p class="sec-note" style="margin:0">${list.length} product${list.length===1?'':'s'}${F.category?' in '+esc(F.category):''}</p>
        </div>
        <label class="field" style="margin:0;min-width:186px">
          <span>Sort by</span>
          <select class="input" id="fsort">
            <option value="featured" ${F.sort==='featured'?'selected':''}>Featured</option>
            <option value="new" ${F.sort==='new'?'selected':''}>Newest first</option>
            <option value="price-asc" ${F.sort==='price-asc'?'selected':''}>Price, low to high</option>
            <option value="price-desc" ${F.sort==='price-desc'?'selected':''}>Price, high to low</option>
            <option value="rating" ${F.sort==='rating'?'selected':''}>Customer rating</option>
          </select>
        </label>
      </div>
      ${active.length?`<div class="chipline" style="margin-bottom:14px">${active.map(([k,v])=>`<button class="chip on" data-drop="${k}" data-val="${esc(v)}">${esc(v)} ✕</button>`).join('')}</div>`:''}
      ${list.length?`<div class="grid">${list.map(pcardHTML).join('')}</div>`:`
        <div class="empty">
          <h3>Nothing matched that</h3>
          <p class="muted">Try a wider price range, or start from one of these.</p>
          <div class="chipline" style="justify-content:center">
            ${DB.categories.map(c=>`<button class="chip" data-jump="${esc(c.name)}">${esc(c.name)}</button>`).join('')}
          </div>
        </div>`}
    </section>
  </div></div>`;
}
afterRender.shop=()=>{
  bindCards();
  document.querySelectorAll('input[name=cat]').forEach(r=>r.onchange=()=>{
    F.category=r.value; S.params={category:r.value}; render();
  });
  document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{
    const s=b.dataset.size; F.sizes=F.sizes.includes(s)?F.sizes.filter(x=>x!==s):F.sizes.concat(s); render();
  });
  document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{
    const c=b.dataset.color; F.colors=F.colors.includes(c)?F.colors.filter(x=>x!==c):F.colors.concat(c); render();
  });
  const st=$('#fstock'); if(st) st.onchange=()=>{F.inStock=st.checked;render()};
  const so=$('#fsort'); if(so) so.onchange=()=>{F.sort=so.value;render()};
  const ap=$('#applyPrice'); if(ap) ap.onclick=()=>{
    F.min=Math.max(0,+$('#fmin').value||0); F.max=Math.max(F.min,+$('#fmax').value||20000); render();
  };
  const cl=$('#clearF'); if(cl) cl.onclick=()=>{
    F={category:'',q:'',sizes:[],colors:[],min:0,max:20000,inStock:false,sort:'featured'};
    $('#search').value=''; S.params={}; render();
  };
  document.querySelectorAll('[data-drop]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.drop,v=b.dataset.val;
    if(k==='search'){F.q='';$('#search').value=''}
    if(k==='size') F.sizes=F.sizes.filter(x=>x!==v);
    if(k==='color') F.colors=F.colors.filter(x=>x!==v);
    if(k==='stock') F.inStock=false;
    render();
  });
  document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{
    F={category:b.dataset.jump,q:'',sizes:[],colors:[],min:0,max:20000,inStock:false,sort:'featured'};
    $('#search').value=''; go('shop',{category:b.dataset.jump});
  });
};

/* ----- WISHLIST ----- */
function viewWishlist(){
  const list=DB.wishlist.map(findProduct).filter(Boolean);
  return `<div class="wrap" style="padding-bottom:60px">
    <h2 class="h-sec" style="padding-top:26px">Your wishlist</h2>
    <p class="sec-note">Saved items stay here until you add them to the cart or remove them.</p>
    ${list.length?`<div class="grid">${list.map(pcardHTML).join('')}</div>`:`
      <div class="empty">
        <h3>Nothing saved yet</h3>
        <p class="muted">Tap the heart on any product to keep it here.</p>
        <button class="btn" onclick="go('shop',{})">Browse the catalogue</button>
      </div>`}
  </div>`;
}
afterRender.wishlist=()=>{ bindCards(); };

/* ----- PRODUCT DETAIL ----- */
const SIZE_GUIDE={
  clothing:[['Size','Chest (in)','Waist (in)','Length (in)'],['XS','34','28','25'],['S','36','30','26'],['M','38','32','27'],['L','40','34','28'],['XL','42','36','29']],
  footwear:[['Size (EU)','Foot length (cm)','UK'],['38','24.0','5'],['39','24.7','6'],['40','25.4','6.5'],['41','26.0','7.5'],['42','26.7','8'],['43','27.3','9']]
};
function stockPill(p){
  if(p.stock<=0) return '<span class="pill pill-out"><i class="dot"></i>Out of stock</span>';
  if(p.stock<=6) return `<span class="pill pill-low"><i class="dot"></i>Only ${p.stock} left</span>`;
  return '<span class="pill pill-stock"><i class="dot"></i>In stock</span>';
}
/* One curated photo per product — the thumbnail rail offers three honest
   crops of that same photo (a wide entropy crop plus top/bottom detail
   crops) rather than pretending each colourway was shot separately. */
const SHOT_CROPS=['entropy','top','bottom'];
function viewProduct(){
  const p=findProduct(S.params.id);
  if(!p) return `<div class="wrap"><div class="empty" style="margin:40px 0"><h3>That product is no longer listed</h3><button class="btn" onclick="go('shop',{})">Back to the catalogue</button></div></div>`;
  if(!S.pdp||S.pdp.id!==p.id) S.pdp={id:p.id,c:0,shotIx:0,size:p.sizes.length===1?p.sizes[0]:null,qty:1};
  const d=S.pdp, col=p.colors[d.c], r=avgRating(p), sale=p.was&&p.was>p.price;
  const guide=(p.category==='Footwear'||/^\d{2}$/.test(p.sizes[0]))?SIZE_GUIDE.footwear:SIZE_GUIDE.clothing;
  const related=DB.products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4);
  const u=me();
  const mine=p.reviews.find(rv=>u&&rv.userId===u.id);
  const imgId=productImgId(p);

  return `<div class="wrap">
    <p class="sec-note" style="padding-top:18px;margin:0">
      <button class="linkbtn" style="color:var(--muted)" onclick="go('home')">Home</button> /
      <button class="linkbtn" style="color:var(--muted)" onclick="go('shop',{category:'${esc(p.category)}'})">${esc(p.category)}</button> /
      ${esc(p.name)}
    </p>
    <div class="pdp">
      <div>
        <div class="pdp-shot" id="mainShot">${imgTag(imgId,900,1050,'',p.name,SHOT_CROPS[d.shotIx],true)}</div>
        <div class="thumbs">
          ${SHOT_CROPS.map((crop,i)=>`<button class="thumb ${i===d.shotIx?'on':''}" data-shot="${i}" title="View ${i+1}">${imgTag(imgId,140,168,'',p.name,crop,true)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          ${stockPill(p)}
          <span class="muted" style="font-size:13px">Product ID ${esc(p.id)}</span>
        </div>
        <h1>${esc(p.name)}</h1>
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
          <span class="stars">${starStr(r)}</span>
          <span class="muted" style="font-size:13.5px">${r.toFixed(1)} · ${p.reviews.length} review${p.reviews.length===1?'':'s'}</span>
        </div>
        <div class="bigprice">${money(p.price)}${sale?`<s style="font-family:var(--f-ui);font-size:14px;font-weight:400;color:var(--muted);margin-left:8px">${money(p.was)}</s>`:''}</div>
        <p style="color:var(--ink-soft);max-width:56ch;margin:14px 0 0">${esc(p.desc)}</p>

        <div class="opt-row">
          <div class="lab"><span>Colour — ${esc(col[0])}</span></div>
          <div class="swatches">
            ${p.colors.map((c,i)=>`<button class="sw-dot ${i===d.c?'on':''}" data-pc="${i}" style="background:${c[1]};width:28px;height:28px" aria-label="${esc(c[0])}" title="${esc(c[0])}"></button>`).join('')}
          </div>
        </div>

        <div class="opt-row">
          <div class="lab"><span>Size${d.size?' — '+esc(d.size):''}</span><a id="openGuide">Size guide</a></div>
          <div class="chipline">
            ${p.sizes.map(s=>`<button class="sizebtn ${d.size===s?'on':''}" data-ps="${esc(s)}" ${p.stock<=0?'disabled':''}>${esc(s)}</button>`).join('')}
          </div>
        </div>

        <div class="opt-row">
          <div class="lab"><span>Quantity</span></div>
          <div class="qty">
            <button id="qminus" aria-label="Decrease quantity">−</button>
            <span id="qval">${d.qty}</span>
            <button id="qplus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="buybar">
          <button class="btn" id="addCart" ${p.stock<=0?'disabled':''} style="flex:1;min-width:190px">${p.stock<=0?'Out of stock':'Add to cart'}</button>
          <button class="btn btn-ghost" id="buyNow" ${p.stock<=0?'disabled':''}>Buy it now</button>
          ${wishIcon(p.id,isWished(p.id))}
        </div>
        ${me()?'':'<p class="muted" style="font-size:13px;margin-top:10px">You will be asked to sign in before adding items — registration takes a minute.</p>'}

        <div style="margin-top:22px">
          <div class="acc open"><button class="acc-h">Product details</button><div class="acc-b">
            <p style="margin:0 0 8px">${esc(p.desc)}</p>
            <table class="sizetable"><tbody>
              <tr><th>Category</th><td>${esc(p.category)}</td></tr>
              <tr><th>Available colours</th><td>${p.colors.map(c=>esc(c[0])).join(', ')}</td></tr>
              <tr><th>Available sizes</th><td>${p.sizes.map(esc).join(', ')}</td></tr>
              <tr><th>Availability</th><td>${p.stock} unit${p.stock===1?'':'s'} in stock</td></tr>
            </tbody></table>
          </div></div>
          <div class="acc"><button class="acc-h">Delivery and returns</button><div class="acc-b">
            <p style="margin:0">Standard delivery Rs 200, arrives in 3&ndash;5 working days. Express delivery Rs 450, 1&ndash;2 working days. Collection from the Bahawalpur store is free. Unworn items can be exchanged within 14 days with the receipt.</p>
          </div></div>
          <div class="acc"><button class="acc-h">Size guide</button><div class="acc-b">
            <table class="sizetable"><tbody>
              ${guide.map((row,i)=>`<tr>${row.map(cell=>i===0?`<th>${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}
            </tbody></table>
          </div></div>
        </div>
      </div>
    </div>

    <div class="stitch"></div>
    <h2 class="h-sec">Customer reviews</h2>
    <p class="sec-note">Only people who have an account can post a review.</p>
    <div class="two-col" style="padding-top:0">
      <div>
        ${p.reviews.length?p.reviews.slice().reverse().map(rv=>`
          <div class="rev">
            <div class="rev-head">
              <div><div class="rev-who">${esc(rv.name)}</div><div class="muted" style="font-size:12.5px">${fmtDate(rv.date)}</div></div>
              <span class="stars">${starStr(rv.rating)}</span>
            </div>
            <p style="margin:0;color:var(--ink-soft)">${esc(rv.comment)}</p>
          </div>`).join(''):`<div class="empty"><h3>No reviews yet</h3><p class="muted">Be the first to say how it fits.</p></div>`}
      </div>
      <div class="panel">
        <h3>${mine?'Your review':'Write a review'}</h3>
        ${u?`
          <div class="starpick" id="starpick">${[1,2,3,4,5].map(i=>`<button data-r="${i}" class="${(mine?mine.rating:0)>=i?'on':''}" aria-label="${i} star">★</button>`).join('')}</div>
          <label class="field" style="margin-top:12px"><span>Your comment</span>
            <textarea class="input" id="revText" placeholder="How does it fit? How is the fabric?">${mine?esc(mine.comment):''}</textarea></label>
          <button class="btn btn-block" id="revSave">${mine?'Update review':'Post review'}</button>
        `:`<p class="muted" style="margin-top:0">Sign in to rate this product.</p>
           <button class="btn btn-block" onclick="openAuth('login')">Sign in</button>`}
        <div class="summary-rating" style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line-soft)">
          <span class="big">${r.toFixed(1)}</span>
          <span><span class="stars">${starStr(r)}</span><br><span class="muted" style="font-size:13px">${p.reviews.length} review${p.reviews.length===1?'':'s'}</span></span>
        </div>
      </div>
    </div>

    ${related.length?`<div class="stitch"></div>
      <h2 class="h-sec">You may also like</h2>
      <p class="sec-note">More from ${esc(p.category)}.</p>
      <div class="grid">${related.map(pcardHTML).join('')}</div>`:''}
  </div>`;
}
afterRender.product=()=>{
  bindCards();
  const p=findProduct(S.params.id); if(!p) return;
  const d=S.pdp;
  document.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{d.c=+b.dataset.pc;render()});
  document.querySelectorAll('[data-shot]').forEach(b=>b.onclick=()=>{d.shotIx=+b.dataset.shot;render()});
  document.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{d.size=b.dataset.ps;render()});
  $('#qminus').onclick=()=>{d.qty=Math.max(1,d.qty-1);$('#qval').textContent=d.qty};
  $('#qplus').onclick=()=>{
    if(d.qty+1>p.stock){ toast(`Only ${p.stock} in stock right now`,'bad'); return; }
    d.qty++; $('#qval').textContent=d.qty;
  };
  document.querySelectorAll('.acc-h').forEach(h=>h.onclick=()=>h.parentElement.classList.toggle('open'));
  $('#openGuide').onclick=()=>{
    const accs=document.querySelectorAll('.acc'); const g=accs[accs.length-1];
    g.classList.add('open'); g.scrollIntoView({behavior:'smooth',block:'center'});
  };
  $('#addCart').onclick=()=>addToCart(p,false);
  $('#buyNow').onclick=()=>addToCart(p,true);
  const sp=$('#starpick');
  if(sp){
    let picked=0;
    const mineR=p.reviews.find(rv=>me()&&rv.userId===me().id);
    picked=mineR?mineR.rating:0;
    sp.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      picked=+b.dataset.r;
      sp.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.r<=picked));
    });
    $('#revSave').onclick=()=>{
      const txt=$('#revText').value.trim();
      if(!picked) return toast('Choose a star rating first','bad');
      if(txt.length<4) return toast('Add a short comment','bad');
      const u=me();
      const ex=p.reviews.find(rv=>rv.userId===u.id);
      if(ex){ ex.rating=picked; ex.comment=txt; ex.date=new Date().toISOString(); toast('Review updated','good'); }
      else { p.reviews.push({id:nextId('review','R-'),userId:u.id,name:u.firstName+' '+u.lastName,rating:picked,comment:txt,date:new Date().toISOString()}); toast('Review posted','good'); }
      save(); render();
    };
  }
};

/* ----- CART ----- */
function addToCart(p,buyNow){
  if(!me()){ openAuth('login','Sign in to add items to your cart.'); return; }
  if(p.stock<=0){ toast('That item is out of stock','bad'); return; }
  const d=S.pdp;
  if(p.sizes.length>1 && !d.size){ toast('Choose a size first','bad'); return; }
  const size=d.size||p.sizes[0], color=p.colors[d.c][0];
  const line=DB.cart.find(i=>i.productId===p.id&&i.size===size&&i.color===color);
  const already=line?line.qty:0;
  if(already+d.qty>p.stock){
    toast(`You can order at most ${p.stock} of this item`,'bad'); return;   /* exception E1 in the SRS */
  }
  if(line) line.qty+=d.qty;
  else DB.cart.push({productId:p.id,name:p.name,size,color,qty:d.qty,price:p.price});
  save();
  toast(`${p.name} added to your cart`,'good');
  if(buyNow) go('cart'); else paintHeader();
}
function cartSubtotal(){ return DB.cart.reduce((a,i)=>a+i.price*i.qty,0); }
function viewCart(){
  if(!DB.cart.length) return `<div class="wrap"><div class="empty" style="margin:48px 0">
    <h3>Your cart is empty</h3>
    <p class="muted">Everything you add is kept here until you check out.</p>
    <button class="btn" onclick="go('shop',{})">Browse the catalogue</button></div></div>`;
  const sub=cartSubtotal();
  return `<div class="wrap"><div class="two-col">
    <div class="panel">
      <h3>Your cart (${cartCount()} item${cartCount()===1?'':'s'})</h3>
      ${DB.cart.map((i,ix)=>{
        const p=findProduct(i.productId);
        return `<div class="citem">
          <div class="shot">${p?productShot(p,200,240,'',true):''}</div>
          <div>
            <div class="nm">${esc(i.name)}</div>
            <div class="var">Size ${esc(i.size)} · ${esc(i.color)}${p&&p.stock<i.qty?' · <span style="color:var(--madder)">only '+p.stock+' left</span>':''}</div>
            <div style="display:flex;gap:12px;align-items:center;margin-top:8px">
              <div class="qty">
                <button data-dec="${ix}" aria-label="Decrease">−</button><span>${i.qty}</span><button data-inc="${ix}" aria-label="Increase">+</button>
              </div>
              <button class="linkbtn" data-rm="${ix}">Remove</button>
            </div>
          </div>
          <div style="text-align:right"><div class="price">${money(i.price*i.qty)}</div>
            <div class="muted" style="font-size:12.5px">${money(i.price)} each</div></div>
        </div>`;
      }).join('')}
    </div>
    <div class="panel summary">
      <h3>Order summary</h3>
      <div class="sumline"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="sumline"><span>Delivery</span><span class="muted">Chosen at checkout</span></div>
      <div class="sumline total"><span>Total so far</span><b>${money(sub)}</b></div>
      <button class="btn btn-block" style="margin-top:14px" onclick="go('checkout')">Proceed to checkout</button>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="go('shop',{})">Keep shopping</button>
      <p class="muted" style="font-size:12.5px;margin-bottom:0">Stock is only reserved once the order is placed.</p>
    </div>
  </div></div>`;
}
afterRender.cart=()=>{
  document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{
    const i=DB.cart[+b.dataset.inc], p=findProduct(i.productId);
    if(p&&i.qty+1>p.stock) return toast(`Only ${p.stock} available`,'bad');
    i.qty++; save(); render();
  });
  document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{
    const i=DB.cart[+b.dataset.dec];
    i.qty--; if(i.qty<1) DB.cart.splice(+b.dataset.dec,1);
    save(); render();
  });
  document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{
    DB.cart.splice(+b.dataset.rm,1); save(); toast('Item removed'); render();
  });
};
/* ----- CHECKOUT ----- */
const DELIVERY=[
  {id:'standard',label:'Standard delivery',desc:'3–5 working days, courier to your address',fee:200},
  {id:'express', label:'Express delivery', desc:'1–2 working days, priority courier',fee:450},
  {id:'pickup',  label:'Collect from store',desc:'Ready in 24 hours, Model Town A, Bahawalpur',fee:0}
];
const PAYMENTS=[
  {id:'cod',      label:'Cash on delivery', desc:'Pay the rider when the parcel arrives'},
  {id:'jazzcash', label:'JazzCash',         desc:'Mobile wallet transfer'},
  {id:'easypaisa',label:'EasyPaisa',        desc:'Mobile wallet transfer'},
  {id:'card',     label:'Debit or credit card',desc:'Visa and Mastercard'}
];
function deliveryById(id){ return DELIVERY.find(d=>d.id===id)||DELIVERY[0] }

function viewCheckout(){
  const u=me();
  if(!u){ setTimeout(()=>openAuth('login','Sign in to complete your order.'),30);
    return `<div class="wrap"><div class="empty" style="margin:48px 0"><h3>Sign in to check out</h3>
      <p class="muted">Registered members can place orders. Your cart is saved.</p>
      <button class="btn" onclick="openAuth('login')">Sign in</button>
      <button class="btn btn-ghost" onclick="openAuth('register')">Create an account</button></div></div>`; }
  if(!DB.cart.length) return `<div class="wrap"><div class="empty" style="margin:48px 0"><h3>There is nothing to check out</h3>
    <button class="btn" onclick="go('shop',{})">Browse the catalogue</button></div></div>`;
  if(!S.co) S.co={step:1,ship:{...u.shipping},delivery:'standard',payment:'cod',wallet:'',card:''};
  const c=S.co, sub=cartSubtotal(), del=deliveryById(c.delivery), total=sub+del.fee;

  const body = c.step===1 ? `
    <h3>Delivery address</h3>
    <div class="grid2">
      <label class="field"><span>Full name</span><input class="input" id="cname" value="${esc(c.ship.name||'')}"></label>
      <label class="field"><span>Mobile number</span><input class="input" id="cphone" value="${esc(c.ship.phone||'')}" placeholder="03xx-xxxxxxx"></label>
    </div>
    <label class="field"><span>Street address</span><input class="input" id="caddr" value="${esc(c.ship.address||'')}" placeholder="House, street, area"></label>
    <div class="grid2">
      <label class="field"><span>City</span><input class="input" id="ccity" value="${esc(c.ship.city||'')}"></label>
      <label class="field"><span>Postal code</span><input class="input" id="cpost" value="${esc(c.ship.postal||'')}"></label>
    </div>
    <p class="err" id="shipErr"></p>
    <button class="btn btn-block" id="toStep2">Continue to delivery</button>`
  : c.step===2 ? `
    <h3>Delivery option</h3>
    ${DELIVERY.map(d=>`<label class="radio-card ${c.delivery===d.id?'on':''}">
      <input type="radio" name="del" value="${d.id}" ${c.delivery===d.id?'checked':''}>
      <span><span class="t">${esc(d.label)}</span><span class="d">${esc(d.desc)}</span></span>
      <span class="amt">${d.fee?money(d.fee):'Free'}</span></label>`).join('')}
    <div class="stitch" style="margin:22px 0"></div>
    <h3>Payment method</h3>
    <div class="notice">Payments are simulated for this project. No card is charged and no bank is contacted.</div>
    ${PAYMENTS.map(p=>`<label class="radio-card ${c.payment===p.id?'on':''}">
      <input type="radio" name="pay" value="${p.id}" ${c.payment===p.id?'checked':''}>
      <span><span class="t">${esc(p.label)}</span><span class="d">${esc(p.desc)}</span></span></label>`).join('')}
    ${(c.payment==='jazzcash'||c.payment==='easypaisa')?`
      <label class="field" style="margin-top:12px"><span>Wallet mobile number</span>
        <input class="input" id="cwallet" value="${esc(c.wallet)}" placeholder="03xx-xxxxxxx"></label>`:''}
    ${c.payment==='card'?`
      <div class="grid2" style="margin-top:12px">
        <label class="field"><span>Card number</span><input class="input" id="ccard" value="${esc(c.card)}" placeholder="4xxx xxxx xxxx xxxx" maxlength="19"></label>
        <label class="field"><span>Expiry</span><input class="input" id="cexp" placeholder="MM/YY" maxlength="5"></label>
      </div>`:''}
    <p class="err" id="payErr"></p>
    <div style="display:flex;gap:10px;margin-top:6px">
      <button class="btn btn-ghost" id="backStep1">Back</button>
      <button class="btn" id="toStep3" style="flex:1">Review order</button>
    </div>`
  : `
    <h3>Review and place your order</h3>
    ${DB.cart.map(i=>{
      const p=findProduct(i.productId);
      return `<div class="citem">
        <div class="shot">${p?productShot(p,200,240,'',true):''}</div>
        <div><div class="nm">${esc(i.name)}</div><div class="var">Size ${esc(i.size)} · ${esc(i.color)} · Qty ${i.qty}</div></div>
        <div class="price">${money(i.price*i.qty)}</div></div>`;
    }).join('')}
    <div class="stitch" style="margin:18px 0"></div>
    <div class="grid2">
      <div><h4 style="margin:0 0 6px;font-size:13px">Shipping to</h4>
        <p class="muted" style="margin:0;font-size:13.5px">${esc(c.ship.name)}<br>${esc(c.ship.address)}<br>${esc(c.ship.city)} ${esc(c.ship.postal)}<br>${esc(c.ship.phone)}</p></div>
      <div><h4 style="margin:0 0 6px;font-size:13px">Delivery and payment</h4>
        <p class="muted" style="margin:0;font-size:13.5px">${esc(del.label)}<br>${esc((PAYMENTS.find(p=>p.id===c.payment)||{}).label)}</p></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:20px">
      <button class="btn btn-ghost" id="backStep2">Back</button>
      <button class="btn btn-gold" id="placeOrder" style="flex:1">Place order — ${money(total)}</button>
    </div>`;

  return `<div class="wrap"><div class="two-col">
    <div class="panel">
      <div class="steps">
        <div class="step ${c.step>1?'done':''} ${c.step===1?'on':''}">Address</div>
        <div class="step ${c.step>2?'done':''} ${c.step===2?'on':''}">Delivery &amp; payment</div>
        <div class="step ${c.step===3?'on':''}">Review</div>
      </div>
      ${body}
    </div>
    <div class="panel summary">
      <h3>Summary</h3>
      <div class="sumline"><span>Items (${cartCount()})</span><span>${money(sub)}</span></div>
      <div class="sumline"><span>${esc(del.label)}</span><span>${del.fee?money(del.fee):'Free'}</span></div>
      <div class="sumline total"><span>Total</span><b>${money(total)}</b></div>
      <p class="muted" style="font-size:12.5px;margin-bottom:0">A confirmation will be sent to ${esc(u.email)} once the order is placed.</p>
    </div>
  </div></div>`;
}
afterRender.checkout=()=>{
  const c=S.co; if(!c) return;
  const g=id=>{const e=$('#'+id);return e?e.value.trim():''};
  const t2=$('#toStep2');
  if(t2) t2.onclick=()=>{
    const s={name:g('cname'),phone:g('cphone'),address:g('caddr'),city:g('ccity'),postal:g('cpost')};
    const e=$('#shipErr');
    if(!s.name||!s.address||!s.city){ e.textContent='Name, address and city are needed to deliver the order.'; e.classList.add('on'); return; }
    if(!/^0\d{2,3}-?\d{7}$/.test(s.phone.replace(/\s/g,''))){ e.textContent='Enter a mobile number like 0312-4567890.'; e.classList.add('on'); return; }
    c.ship=s; c.step=2; render();
  };
  document.querySelectorAll('input[name=del]').forEach(r=>r.onchange=()=>{c.delivery=r.value;render()});
  document.querySelectorAll('input[name=pay]').forEach(r=>r.onchange=()=>{c.payment=r.value;render()});
  const b1=$('#backStep1'); if(b1) b1.onclick=()=>{c.step=1;render()};
  const b2=$('#backStep2'); if(b2) b2.onclick=()=>{c.step=2;render()};
  const t3=$('#toStep3');
  if(t3) t3.onclick=()=>{
    const e=$('#payErr'); e.classList.remove('on');
    if(c.payment==='jazzcash'||c.payment==='easypaisa'){
      c.wallet=g('cwallet');
      if(!/^0\d{2,3}-?\d{7}$/.test(c.wallet.replace(/\s/g,''))){ e.textContent='Enter the wallet mobile number.'; e.classList.add('on'); return; }
    }
    if(c.payment==='card'){
      c.card=g('ccard');
      if(c.card.replace(/\D/g,'').length<12){ e.textContent='Enter a card number (any 12–16 digits — this is simulated).'; e.classList.add('on'); return; }
    }
    c.step=3; render();
  };
  const po=$('#placeOrder');
  if(po) po.onclick=()=>{
    /* final stock check — SRS exception E1 */
    for(const i of DB.cart){
      const p=findProduct(i.productId);
      if(!p||p.stock<i.qty){ toast(`${i.name}: only ${p?p.stock:0} left. Adjust the quantity.`,'bad'); go('cart'); return; }
    }
    const u=me(), del=deliveryById(c.delivery), sub=cartSubtotal();
    const order={
      id:'ORD-'+nextId('order','',5).slice(-5),
      trackingId:'FF'+Math.random().toString(36).slice(2,7).toUpperCase(),
      userId:u.id, items:DB.cart.map(i=>({...i})), subtotal:sub,
      delivery:{label:del.label,fee:del.fee},
      payment:(PAYMENTS.find(p=>p.id===c.payment)||{}).label,
      shipping:{...c.ship}, total:sub+del.fee, status:'Pending', date:new Date().toISOString()
    };
    DB.cart.forEach(i=>{const p=findProduct(i.productId); if(p) p.stock=Math.max(0,p.stock-i.qty)});
    DB.orders.push(order); DB.cart=[]; u.shipping={...c.ship}; S.co=null; save();
    toast('Order placed','good');
    go('order',{id:order.id,fresh:true});
  };
};

/* ----- ORDERS ----- */
const FLOW=['Pending','Confirmed','Dispatched','Delivered'];
function myOrders(){ const u=me(); return u?DB.orders.filter(o=>o.userId===u.id).slice().reverse():[] }
function viewOrders(){
  const u=me();
  const list=myOrders();
  return `<div class="wrap" style="padding-bottom:60px">
    <h2 class="h-sec" style="padding-top:26px">Your orders</h2>
    <p class="sec-note">Track anything you have bought, or look an order up by its number.</p>
    <div class="panel" style="margin-bottom:18px">
      <div class="tools" style="margin:0">
        <input class="input" id="trackIn" placeholder="Order number, e.g. ORD-24051">
        <button class="btn btn-sm" id="trackGo">Find order</button>
      </div>
    </div>
    ${!u?`<div class="empty"><h3>Sign in to see your orders</h3>
        <button class="btn" onclick="openAuth('login')">Sign in</button></div>`
     :list.length?`<div class="panel">
        <div class="tablewrap"><table class="data">
          <thead><tr><th>Order</th><th>Placed</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>${list.map(o=>`<tr>
            <td><b>${esc(o.id)}</b><br><span class="muted">${esc(o.trackingId)}</span></td>
            <td>${fmtDate(o.date)}</td>
            <td>${o.items.reduce((a,i)=>a+i.qty,0)}</td>
            <td>${money(o.total)}</td>
            <td><span class="status st-${esc(o.status)}">${esc(o.status)}</span></td>
            <td><button class="btn btn-ghost btn-sm" data-o="${esc(o.id)}">View</button></td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>`
     :`<div class="empty"><h3>No orders yet</h3><p class="muted">When you buy something it will show up here with a tracking number.</p>
        <button class="btn" onclick="go('shop',{})">Start shopping</button></div>`}
  </div>`;
}
afterRender.orders=()=>{
  document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>go('order',{id:b.dataset.o}));
  $('#trackGo').onclick=()=>{
    const v=$('#trackIn').value.trim().toUpperCase();
    const o=DB.orders.find(x=>x.id.toUpperCase()===v||x.trackingId.toUpperCase()===v);
    if(!o) return toast('No order with that number','bad');
    go('order',{id:o.id});
  };
};
function viewOrder(){
  const o=DB.orders.find(x=>x.id===S.params.id);
  if(!o) return `<div class="wrap"><div class="empty" style="margin:48px 0"><h3>Order not found</h3>
    <button class="btn" onclick="go('orders')">Back to orders</button></div></div>`;
  const idx=FLOW.indexOf(o.status);
  const u=DB.users.find(x=>x.id===o.userId);
  return `<div class="wrap"><div class="two-col">
    <div class="panel">
      ${S.params.fresh?`<div class="notice"><b>Order confirmed.</b> A confirmation email has been sent to ${esc(u?u.email:'your address')} with the tracking number <b>${esc(o.trackingId)}</b>.</div>`:''}
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><h3 style="margin:0">${esc(o.id)}</h3>
          <span class="muted" style="font-size:13px">Placed ${fmtDate(o.date)} · tracking ${esc(o.trackingId)}</span></div>
        <span class="status st-${esc(o.status)}">${esc(o.status)}</span>
      </div>
      ${o.status==='Cancelled'?'<div class="notice" style="margin-top:14px">This order was cancelled. Nothing has been charged.</div>':`
      <div class="track">${FLOW.map((s,i)=>`<div class="n ${i<=idx?'done':''}">${s}</div>`).join('')}</div>`}
      <div class="stitch" style="margin:18px 0"></div>
      ${o.items.map(i=>{
        const p=findProduct(i.productId);
        return `<div class="citem">
          <div class="shot">${p?productShot(p,200,240,'',true):''}</div>
          <div><div class="nm">${esc(i.name)}</div><div class="var">Size ${esc(i.size)} · ${esc(i.color)} · Qty ${i.qty}</div></div>
          <div class="price">${money(i.price*i.qty)}</div></div>`;
      }).join('')}
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="go('orders')">All orders</button>
        <button class="btn btn-ghost btn-sm" onclick="go('shop',{})">Continue shopping</button>
        ${o.status==='Pending'?`<button class="btn btn-danger btn-sm" id="cancelOrder">Cancel order</button>`:''}
      </div>
    </div>
    <div class="panel summary">
      <h3>Order summary</h3>
      <div class="sumline"><span>Items</span><span>${money(o.subtotal)}</span></div>
      <div class="sumline"><span>${esc(o.delivery.label)}</span><span>${o.delivery.fee?money(o.delivery.fee):'Free'}</span></div>
      <div class="sumline total"><span>Total</span><b>${money(o.total)}</b></div>
      <div class="stitch" style="margin:16px 0"></div>
      <h4 style="margin:0 0 6px;font-size:13px">Shipping address</h4>
      <p class="muted" style="margin:0 0 12px;font-size:13.5px">${esc(o.shipping.name)}<br>${esc(o.shipping.address)}<br>${esc(o.shipping.city)} ${esc(o.shipping.postal)}<br>${esc(o.shipping.phone)}</p>
      <h4 style="margin:0 0 6px;font-size:13px">Payment method</h4>
      <p class="muted" style="margin:0;font-size:13.5px">${esc(o.payment)}</p>
    </div>
  </div></div>`;
}
afterRender.order=()=>{
  const co=$('#cancelOrder');
  if(co) co.onclick=()=>{
    const o=DB.orders.find(x=>x.id===S.params.id);
    o.status='Cancelled';
    o.items.forEach(i=>{const p=findProduct(i.productId); if(p) p.stock+=i.qty});
    save(); toast('Order cancelled'); render();
  };
};
/* ----- ACCOUNT ----- */
function viewAccount(){
  const u=me();
  if(!u){ setTimeout(()=>openAuth('login'),30);
    return `<div class="wrap"><div class="empty" style="margin:48px 0"><h3>Sign in to your account</h3>
      <button class="btn" onclick="openAuth('login')">Sign in</button></div></div>`; }
  const orders=myOrders();
  const spent=orders.filter(o=>o.status!=='Cancelled').reduce((a,o)=>a+o.total,0);
  return `<div class="wrap"><div class="two-col">
    <div class="panel">
      <h3>Your details</h3>
      <div class="grid2">
        <label class="field"><span>First name</span><input class="input" id="afirst" value="${esc(u.firstName)}"></label>
        <label class="field"><span>Last name</span><input class="input" id="alast" value="${esc(u.lastName)}"></label>
      </div>
      <label class="field"><span>Email</span><input class="input" id="aemail" type="email" value="${esc(u.email)}"></label>
      <div class="stitch" style="margin:18px 0"></div>
      <h3>Default shipping address</h3>
      <div class="grid2">
        <label class="field"><span>Full name</span><input class="input" id="asname" value="${esc(u.shipping.name||'')}"></label>
        <label class="field"><span>Mobile number</span><input class="input" id="asphone" value="${esc(u.shipping.phone||'')}"></label>
      </div>
      <label class="field"><span>Street address</span><input class="input" id="asaddr" value="${esc(u.shipping.address||'')}"></label>
      <div class="grid2">
        <label class="field"><span>City</span><input class="input" id="ascity" value="${esc(u.shipping.city||'')}"></label>
        <label class="field"><span>Postal code</span><input class="input" id="aspost" value="${esc(u.shipping.postal||'')}"></label>
      </div>
      <p class="err" id="accErr"></p>
      <button class="btn" id="saveAcc">Save changes</button>
      <div class="stitch" style="margin:18px 0"></div>
      <h3>Change password</h3>
      <div class="grid2">
        <label class="field"><span>New password</span><input class="input" id="apw1" type="password" placeholder="At least 6 characters"></label>
        <label class="field"><span>Confirm new password</span><input class="input" id="apw2" type="password"></label>
      </div>
      <button class="btn btn-ghost" id="savePw">Update password</button>
    </div>
    <div class="panel summary">
      <h3>${esc(u.firstName)} ${esc(u.lastName)}</h3>
      <p class="muted" style="margin-top:0;font-size:13.5px">${esc(u.email)}${u.role==='admin'?' · store administrator':''}</p>
      <div class="sumline"><span>Orders placed</span><span>${orders.length}</span></div>
      <div class="sumline"><span>Items in cart</span><span>${cartCount()}</span></div>
      <div class="sumline"><span>Items saved</span><span>${DB.wishlist.length}</span></div>
      <div class="sumline total"><span>Lifetime spend</span><b>${money(spent)}</b></div>
      <button class="btn btn-ghost btn-block" style="margin-top:14px" onclick="go('orders')">View orders</button>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="go('wishlist')">View wishlist</button>
      ${u.role==='admin'?`<button class="btn btn-block" style="margin-top:8px" onclick="go('admin')">Open admin panel</button>`:''}
      <button class="btn btn-danger btn-block" style="margin-top:8px" id="signOut">Sign out</button>
    </div>
  </div></div>`;
}
afterRender.account=()=>{
  const u=me(); if(!u) return;
  const v=id=>$('#'+id).value.trim();
  $('#saveAcc').onclick=()=>{
    const e=$('#accErr'); e.classList.remove('on');
    const email=v('aemail');
    if(!v('afirst')||!v('alast')){ e.textContent='First and last name are needed.'; e.classList.add('on'); return; }
    if(!/^\S+@\S+\.\S+$/.test(email)){ e.textContent='That email address does not look right.'; e.classList.add('on'); return; }
    if(DB.users.some(x=>x.email.toLowerCase()===email.toLowerCase()&&x.id!==u.id)){ e.textContent='Another account already uses that email.'; e.classList.add('on'); return; }
    u.firstName=v('afirst'); u.lastName=v('alast'); u.email=email;
    u.shipping={name:v('asname'),phone:v('asphone'),address:v('asaddr'),city:v('ascity'),postal:v('aspost')};
    save(); toast('Details saved','good'); render();
  };
  $('#savePw').onclick=()=>{
    const a=v('apw1'),b=v('apw2');
    if(a.length<6) return toast('Password must be at least 6 characters','bad');
    if(a!==b) return toast('Passwords do not match','bad');
    u.password=a; save(); toast('Password updated','good');
    $('#apw1').value=''; $('#apw2').value='';
  };
  $('#signOut').onclick=()=>{ DB.session=null; save(); toast('Signed out'); go('home'); };
};

/* ----- SUPPORT ----- */
function viewSupport(){
  return `<div class="wrap" style="padding-bottom:60px">
    <h2 class="h-sec" style="padding-top:26px">Contact and support</h2>
    <p class="sec-note">Messages are answered within one working day.</p>
    <div class="two-col" style="padding-top:0">
      <div class="panel">
        <h3>Send us a message</h3>
        <div class="grid2">
          <label class="field"><span>Your name</span><input class="input" id="sname"></label>
          <label class="field"><span>Email</span><input class="input" id="semail" type="email"></label>
        </div>
        <label class="field"><span>What is it about?</span>
          <select class="input" id="stopic">
            <option>An order I placed</option><option>Delivery or collection</option>
            <option>Returns and exchange</option><option>Sizing advice</option><option>Something else</option>
          </select></label>
        <label class="field"><span>Message</span><textarea class="input" id="smsg" placeholder="Include your order number if you have one"></textarea></label>
        <p class="err" id="sErr"></p>
        <button class="btn" id="sendMsg">Send message</button>
      </div>
      <div class="panel">
        <h3>Delivery options</h3>
        <table class="sizetable"><tbody>
          <tr><th>Option</th><th>Time</th><th>Cost</th></tr>
          ${DELIVERY.map(d=>`<tr><td>${esc(d.label)}</td><td>${esc(d.desc.split(',')[0])}</td><td>${d.fee?money(d.fee):'Free'}</td></tr>`).join('')}
        </tbody></table>
        <div class="stitch" style="margin:18px 0"></div>
        <h3>Common questions</h3>
        <div class="acc open"><button class="acc-h">Do I need an account to browse?</button>
          <div class="acc-b">No. Anyone can look through the whole catalogue. An account is only needed to add items to a cart and place an order.</div></div>
        <div class="acc"><button class="acc-h">Which payment methods work?</button>
          <div class="acc-b">Cash on delivery, JazzCash, EasyPaisa, and debit or credit card. In this project build every payment is simulated.</div></div>
        <div class="acc"><button class="acc-h">Can I exchange something?</button>
          <div class="acc-b">Unworn items with tags can be exchanged within 14 days. Bring the parcel and the order number to the Bahawalpur store, or arrange a courier pickup from the support form.</div></div>
        <div class="acc"><button class="acc-h">Where do you deliver?</button>
          <div class="acc-b">Across Pakistan by courier. Collection is available from Model Town A, Bahawalpur, usually within 24 hours of the order.</div></div>
      </div>
    </div>
  </div>`;
}
afterRender.support=()=>{
  document.querySelectorAll('.acc-h').forEach(h=>h.onclick=()=>h.parentElement.classList.toggle('open'));
  $('#sendMsg').onclick=()=>{
    const e=$('#sErr'); e.classList.remove('on');
    const n=$('#sname').value.trim(), em=$('#semail').value.trim(), m=$('#smsg').value.trim();
    if(!n||!/^\S+@\S+\.\S+$/.test(em)||m.length<8){
      e.textContent='Add your name, a valid email and a message of at least a few words.'; e.classList.add('on'); return;
    }
    toast('Message sent — we will reply by email','good');
    $('#sname').value='';$('#semail').value='';$('#smsg').value='';
  };
};
/* ---------- 7. ADMIN PANEL ---------- */
const ATABS=[['dash','Dashboard'],['products','Products'],['categories','Categories'],
             ['orders','Orders'],['customers','Customers'],['payments','Payments']];
const PRODUCT_TYPES=['tshirt','shirt','kurta','dress','hoodie','jacket','coat','trousers','jeans','shoes','sandals','scarf','bag','watch'];

function viewAdmin(){
  if(!isAdmin()){
    setTimeout(()=>openAuth('login','Sign in with an administrator account.'),30);
    return `<div class="wrap"><div class="empty" style="margin:48px 0">
      <h3>Administrator access only</h3>
      <p class="muted">Sign in with the store account to manage the catalogue, orders and customers.</p>
      <p class="muted" style="font-size:13px">Demo login — admin@fashionfusion.pk / admin1234</p>
      <button class="btn" onclick="openAuth('login')">Sign in</button></div></div>`;
  }
  const t=S.adminTab;
  return `<div class="wrap"><h2 class="h-sec" style="padding-top:26px">Store administration</h2>
  <p class="sec-note">Signed in as ${esc(me().email)}.</p>
  <div class="admin">
    <aside class="aside">
      <h4>Manage</h4>
      ${ATABS.map(([k,l])=>`<button class="${t===k?'on':''}" data-t="${k}">${l}</button>`).join('')}
    </aside>
    <section class="apanel">${adminBody(t)}</section>
  </div></div>`;
}
function adminBody(t){
  if(t==='dash') return adminDash();
  if(t==='products') return adminProducts();
  if(t==='categories') return adminCategories();
  if(t==='orders') return adminOrders();
  if(t==='customers') return adminCustomers();
  return adminPayments();
}
function adminDash(){
  const live=DB.orders.filter(o=>o.status!=='Cancelled');
  const revenue=live.reduce((a,o)=>a+o.total,0);
  const pending=DB.orders.filter(o=>o.status==='Pending').length;
  const low=DB.products.filter(p=>p.stock<=6);
  const recent=DB.orders.slice().reverse().slice(0,5);
  return `<h3 style="margin-top:0">Overview</h3>
  <div class="stats">
    <div class="stat"><b>${DB.products.length}</b><span>products listed</span></div>
    <div class="stat"><b>${DB.orders.length}</b><span>orders received</span></div>
    <div class="stat"><b>${pending}</b><span>awaiting confirmation</span></div>
    <div class="stat"><b>${DB.users.filter(u=>u.role!=='admin').length}</b><span>registered customers</span></div>
    <div class="stat"><b>${money(revenue)}</b><span>total order value</span></div>
  </div>
  <h3>Recent orders</h3>
  <div class="tablewrap"><table class="data">
    <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>${recent.length?recent.map(o=>{
      const u=DB.users.find(x=>x.id===o.userId);
      return `<tr><td><b>${esc(o.id)}</b></td><td>${u?esc(u.firstName+' '+u.lastName):'—'}</td>
        <td>${money(o.total)}</td><td><span class="status st-${esc(o.status)}">${esc(o.status)}</span></td></tr>`;
    }).join(''):'<tr><td colspan="4" class="muted">No orders yet.</td></tr>'}</tbody></table></div>
  ${low.length?`<h3 style="margin-top:22px">Running low</h3>
    <div class="tablewrap"><table class="data"><thead><tr><th>Product</th><th>Category</th><th>Stock</th></tr></thead>
    <tbody>${low.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.category)}</td>
      <td><span class="pill ${p.stock?'pill-low':'pill-out'}"><i class="dot"></i>${p.stock} left</span></td></tr>`).join('')}</tbody>
    </table></div>`:''}`;
}
function adminProducts(){
  const q=(S.aq||'').toLowerCase();
  const list=DB.products.filter(p=>!q||(p.name+p.category+p.id).toLowerCase().includes(q));
  return `<div class="tools">
    <input class="input" id="aSearch" placeholder="Search by name, category or ID" value="${esc(S.aq||'')}">
    <button class="btn btn-sm" id="newProd">Add product</button>
  </div>
  <div class="tablewrap"><table class="data">
    <thead><tr><th></th><th>ID</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th></th></tr></thead>
    <tbody>${list.map(p=>`<tr>
      <td><span style="display:block;width:40px;height:48px;border-radius:4px;overflow:hidden">${productShot(p,80,96,'')}</span></td>
      <td>${esc(p.id)}</td>
      <td><b>${esc(p.name)}</b><br><span class="muted">${p.colors.length} colours · ${p.sizes.length} sizes</span></td>
      <td>${esc(p.category)}</td>
      <td>${money(p.price)}</td>
      <td>${p.stock}</td>
      <td>${avgRating(p).toFixed(1)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-ghost btn-sm" data-edit="${esc(p.id)}">Edit</button>
        <button class="btn btn-danger btn-sm" data-del="${esc(p.id)}">Delete</button>
      </td></tr>`).join('')||'<tr><td colspan="8" class="muted">Nothing matched that search.</td></tr>'}</tbody>
  </table></div>`;
}
function adminCategories(){
  return `<div class="tools">
    <input class="input" id="newCatName" placeholder="New category name">
    <input class="input" id="newCatBlurb" placeholder="Short description">
    <button class="btn btn-sm" id="addCat">Add category</button>
  </div>
  <div class="tablewrap"><table class="data">
    <thead><tr><th>Category</th><th>Description</th><th>Products</th><th></th></tr></thead>
    <tbody>${DB.categories.map(c=>{
      const n=DB.products.filter(p=>p.category===c.name).length;
      return `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.blurb)}</td><td>${n}</td>
        <td><button class="btn btn-danger btn-sm" data-delcat="${esc(c.name)}" ${n?'disabled title="Move its products first"':''}>Remove</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
}
function adminOrders(){
  const list=DB.orders.slice().reverse();
  return `<h3 style="margin-top:0">All orders</h3>
  <p class="muted" style="margin-top:-6px">Change the status to move an order along. Cancelling returns the stock.</p>
  <div class="tablewrap"><table class="data">
    <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
    <tbody>${list.length?list.map(o=>{
      const u=DB.users.find(x=>x.id===o.userId);
      return `<tr>
        <td><b>${esc(o.id)}</b><br><span class="muted">${esc(o.trackingId)}</span></td>
        <td>${fmtDate(o.date)}</td>
        <td>${u?esc(u.firstName+' '+u.lastName):'—'}<br><span class="muted">${esc(o.shipping.city)}</span></td>
        <td>${o.items.reduce((a,i)=>a+i.qty,0)}</td>
        <td>${money(o.total)}</td>
        <td>${esc(o.payment)}</td>
        <td><select data-status="${esc(o.id)}">
          ${FLOW.concat('Cancelled').map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select></td>
        <td><button class="btn btn-ghost btn-sm" data-vieworder="${esc(o.id)}">Open</button></td>
      </tr>`;
    }).join(''):'<tr><td colspan="8" class="muted">No orders have been placed yet.</td></tr>'}</tbody>
  </table></div>`;
}
function adminCustomers(){
  const list=DB.users.filter(u=>u.role!=='admin');
  return `<h3 style="margin-top:0">Registered customers</h3>
  <div class="tablewrap"><table class="data">
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Orders</th><th></th></tr></thead>
    <tbody>${list.length?list.map(u=>{
      const n=DB.orders.filter(o=>o.userId===u.id).length;
      return `<tr><td>${esc(u.id)}</td><td><b>${esc(u.firstName+' '+u.lastName)}</b></td>
        <td>${esc(u.email)}</td><td>${esc(u.shipping.city||'—')}</td><td>${n}</td>
        <td><button class="btn btn-danger btn-sm" data-deluser="${esc(u.id)}">Remove</button></td></tr>`;
    }).join(''):'<tr><td colspan="6" class="muted">No customers have registered yet.</td></tr>'}</tbody>
  </table></div>`;
}
function adminPayments(){
  const paid=DB.orders.filter(o=>o.status==='Delivered');
  const due=DB.orders.filter(o=>['Pending','Confirmed','Dispatched'].includes(o.status));
  const cleared=paid.reduce((a,o)=>a+o.total,0), pending=due.reduce((a,o)=>a+o.total,0);
  const byMethod={};
  DB.orders.filter(o=>o.status!=='Cancelled').forEach(o=>{byMethod[o.payment]=(byMethod[o.payment]||0)+o.total});
  return `<div class="stats">
    <div class="stat"><b>${money(cleared)}</b><span>cleared — delivered orders</span></div>
    <div class="stat"><b>${money(pending)}</b><span>in transit, not yet cleared</span></div>
    <div class="stat"><b>${DB.orders.length}</b><span>transactions recorded</span></div>
  </div>
  <div class="notice">Withdrawals are simulated. No bank account is connected in this build.</div>
  <button class="btn" id="withdraw" ${cleared?'':'disabled'}>Withdraw ${money(cleared)}</button>
  <h3 style="margin-top:22px">By payment method</h3>
  <div class="tablewrap"><table class="data"><thead><tr><th>Method</th><th>Value</th></tr></thead>
    <tbody>${Object.keys(byMethod).length?Object.entries(byMethod).map(([m,v])=>
      `<tr><td>${esc(m)}</td><td>${money(v)}</td></tr>`).join(''):'<tr><td colspan="2" class="muted">No payments recorded.</td></tr>'}</tbody>
  </table></div>`;
}

afterRender.admin=()=>{
  if(!isAdmin()) return;
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.adminTab=b.dataset.t;render()});
  const s=$('#aSearch'); if(s) s.oninput=()=>{S.aq=s.value; const sel=document.activeElement===s;
    render(); if(sel){const n=$('#aSearch'); n.focus(); n.setSelectionRange(n.value.length,n.value.length);} };
  const np=$('#newProd'); if(np) np.onclick=()=>productForm(null);
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>productForm(b.dataset.edit));
  document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    const p=findProduct(b.dataset.del);
    if(!confirm(`Remove "${p.name}" from the catalogue?`)) return;
    DB.products=DB.products.filter(x=>x.id!==p.id);
    DB.cart=DB.cart.filter(i=>i.productId!==p.id);
    save(); toast('Product removed'); render();
  });
  const ac=$('#addCat'); if(ac) ac.onclick=()=>{
    const n=$('#newCatName').value.trim(), b=$('#newCatBlurb').value.trim();
    if(!n) return toast('Give the category a name','bad');
    if(DB.categories.some(c=>c.name.toLowerCase()===n.toLowerCase())) return toast('That category already exists','bad');
    DB.categories.push({name:n,blurb:b||'New department',img:FALLBACK_IMG}); save(); toast('Category added','good'); render();
  };
  document.querySelectorAll('[data-delcat]').forEach(b=>b.onclick=()=>{
    DB.categories=DB.categories.filter(c=>c.name!==b.dataset.delcat); save(); toast('Category removed'); render();
  });
  document.querySelectorAll('[data-status]').forEach(sel=>sel.onchange=()=>{
    const o=DB.orders.find(x=>x.id===sel.dataset.status), was=o.status, now=sel.value;
    if(now==='Cancelled'&&was!=='Cancelled') o.items.forEach(i=>{const p=findProduct(i.productId); if(p) p.stock+=i.qty});
    if(was==='Cancelled'&&now!=='Cancelled') o.items.forEach(i=>{const p=findProduct(i.productId); if(p) p.stock=Math.max(0,p.stock-i.qty)});
    o.status=now; save(); toast(`${o.id} marked ${now}`,'good'); render();
  });
  document.querySelectorAll('[data-vieworder]').forEach(b=>b.onclick=()=>go('order',{id:b.dataset.vieworder}));
  document.querySelectorAll('[data-deluser]').forEach(b=>b.onclick=()=>{
    const u=DB.users.find(x=>x.id===b.dataset.deluser);
    if(!confirm(`Remove ${u.firstName} ${u.lastName}? Their orders stay in the records.`)) return;
    DB.users=DB.users.filter(x=>x.id!==u.id); save(); toast('Customer removed'); render();
  });
  const w=$('#withdraw'); if(w) w.onclick=()=>toast('Withdrawal request recorded (simulated)','good');
};

function productForm(id){
  const p=id?findProduct(id):null;
  openModal(`
    <h2>${p?'Edit product':'Add a product'}</h2>
    <p class="muted" style="margin-top:0;font-size:13.5px">${p?esc(p.id):'A new ID is generated automatically.'}</p>
    <label class="field"><span>Product name</span><input class="input" id="pfName" value="${p?esc(p.name):''}"></label>
    <div class="grid2">
      <label class="field"><span>Category</span><select class="input" id="pfCat">
        ${DB.categories.map(c=>`<option ${p&&p.category===c.name?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Product type</span><select class="input" id="pfType">
        ${PRODUCT_TYPES.map(t=>`<option ${p&&p.type===t?'selected':''}>${t}</option>`).join('')}</select></label>
    </div>
    <div class="grid2">
      <label class="field"><span>Price (Rs)</span><input class="input" id="pfPrice" type="number" min="0" value="${p?p.price:''}"></label>
      <label class="field"><span>Was (optional)</span><input class="input" id="pfWas" type="number" min="0" value="${p&&p.was?p.was:''}"></label>
    </div>
    <label class="field"><span>Stock quantity</span><input class="input" id="pfStock" type="number" min="0" value="${p?p.stock:''}"></label>
    <label class="field"><span>Description</span><textarea class="input" id="pfDesc">${p?esc(p.desc):''}</textarea></label>
    <label class="field"><span>Image path or URL (optional — e.g. products/P-1234.jpg, or a full https:// link)</span>
      <input class="input" id="pfImg" placeholder="products/P-1234.jpg" value="${p&&p.img&&p.img.startsWith('http')?esc(p.img):''}"></label>
    <label class="field"><span>Sizes, separated by commas</span><input class="input" id="pfSizes" value="${p?esc(p.sizes.join(', ')):'S, M, L, XL'}"></label>
    <label class="field"><span>Colours — name:hex, separated by commas</span>
      <input class="input" id="pfColors" value="${p?esc(p.colors.map(c=>c[0]+':'+c[1]).join(', ')):'Black:#26262C, Ivory:#EFE7D8'}"></label>
    <p class="err" id="pfErr"></p>
    <div style="display:flex;gap:10px">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn" id="pfSave" style="flex:1">${p?'Save changes':'Add to catalogue'}</button>
    </div>`,'wide');
  $('#pfSave').onclick=()=>{
    const e=$('#pfErr'); e.classList.remove('on');
    const name=$('#pfName').value.trim(), price=+$('#pfPrice').value, stock=+$('#pfStock').value;
    const sizes=$('#pfSizes').value.split(',').map(s=>s.trim()).filter(Boolean);
    const colors=$('#pfColors').value.split(',').map(s=>{
      const [n,h]=s.split(':').map(x=>(x||'').trim());
      return n&&/^#[0-9a-fA-F]{3,6}$/.test(h||'')?[n,h]:null;
    }).filter(Boolean);
    if(!name){ e.textContent='The product needs a name.'; e.classList.add('on'); return; }
    if(!(price>0)){ e.textContent='Enter a price above zero.'; e.classList.add('on'); return; }
    if(!(stock>=0)){ e.textContent='Enter the stock quantity.'; e.classList.add('on'); return; }
    if(!sizes.length){ e.textContent='Add at least one size.'; e.classList.add('on'); return; }
    if(!colors.length){ e.textContent='Add at least one colour as name:hex, for example Black:#26262C.'; e.classList.add('on'); return; }
    const was=+$('#pfWas').value||null;
    const imgUrl=$('#pfImg').value.trim();
    const data={name,category:$('#pfCat').value,type:$('#pfType').value,price,was:was&&was>price?was:null,
      stock,desc:$('#pfDesc').value.trim()||'No description added yet.',sizes,colors,img:imgUrl||(p?p.img:FALLBACK_IMG)};
    if(p){ Object.assign(p,data); toast('Product updated','good'); }
    else { DB.products.push({id:'P-'+nextId('product','',4),...data,rating:0,tags:['new'],reviews:[]}); toast('Product added','good'); }
    save(); closeModal(); render();
  };
}
/* ---------- 8. MODALS, AUTH, SEARCH, THEME, INIT ---------- */
function openModal(html,cls){
  const v=$('#veil');
  v.innerHTML=`<div class="modal ${cls||''}" role="dialog" aria-modal="true" style="position:relative">
    <button class="icobtn x" onclick="closeModal()" aria-label="Close">
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4l10 10M14 4L4 14"/></svg>
    </button>${html}</div>`;
  v.classList.add('on');
  v.onclick=e=>{ if(e.target===v) closeModal(); };
  const f=v.querySelector('input'); if(f) setTimeout(()=>f.focus(),60);
}
function closeModal(){ const v=$('#veil'); v.classList.remove('on'); v.innerHTML=''; }

function openAuth(tab,message){
  tab=tab||'login';
  const body=tab==='login'?`
    <label class="field"><span>Email</span><input class="input" id="liEmail" type="email" placeholder="you@example.com"></label>
    <label class="field"><span>Password</span><input class="input" id="liPass" type="password"></label>
    <p class="err" id="liErr"></p>
    <button class="btn btn-block" id="doLogin">Sign in</button>
    <div class="notice" style="margin:14px 0 0">
      <b>Demo accounts.</b><br>
      Customer — ayesha@example.com / ayesha123<br>
      Administrator — admin@fashionfusion.pk / admin1234
    </div>`:`
    <div class="grid2">
      <label class="field"><span>First name</span><input class="input" id="rgFirst"></label>
      <label class="field"><span>Last name</span><input class="input" id="rgLast"></label>
    </div>
    <label class="field"><span>Email</span><input class="input" id="rgEmail" type="email" placeholder="you@example.com"></label>
    <div class="grid2">
      <label class="field"><span>Password</span><input class="input" id="rgPass" type="password" placeholder="At least 6 characters"></label>
      <label class="field"><span>Confirm password</span><input class="input" id="rgPass2" type="password"></label>
    </div>
    <p class="err" id="rgErr"></p>
    <button class="btn btn-block" id="doRegister">Create account</button>
    <p class="muted" style="font-size:12.5px;margin-bottom:0">Creating an account lets you buy, track orders and review what you bought.</p>`;

  openModal(`
    <h2>${tab==='login'?'Welcome back':'Create your account'}</h2>
    ${message?`<p class="muted" style="margin:0">${esc(message)}</p>`:''}
    <div class="tabs">
      <button class="${tab==='login'?'on':''}" id="tabLogin">Sign in</button>
      <button class="${tab==='register'?'on':''}" id="tabReg">Register</button>
    </div>
    ${body}`);

  $('#tabLogin').onclick=()=>openAuth('login',message);
  $('#tabReg').onclick=()=>openAuth('register',message);

  if(tab==='login'){
    const submit=()=>{
      const e=$('#liErr'); e.classList.remove('on');
      const em=$('#liEmail').value.trim().toLowerCase(), pw=$('#liPass').value;
      const u=DB.users.find(x=>x.email.toLowerCase()===em);
      if(!u||u.password!==pw){ e.textContent='That email and password do not match an account.'; e.classList.add('on'); return; }
      DB.session=u.id; save(); closeModal();
      toast(`Signed in as ${u.firstName}`,'good');
      if(S.view==='checkout'||S.view==='admin'||S.view==='account'||S.view==='orders') render(); else paintHeader();
    };
    $('#doLogin').onclick=submit;
    $('#liPass').onkeydown=ev=>{ if(ev.key==='Enter') submit(); };
  } else {
    const submit=()=>{
      const e=$('#rgErr'); e.classList.remove('on');
      const first=$('#rgFirst').value.trim(), last=$('#rgLast').value.trim();
      const em=$('#rgEmail').value.trim(), p1=$('#rgPass').value, p2=$('#rgPass2').value;
      const fail=m=>{ e.textContent=m; e.classList.add('on'); };
      if(!first||!last) return fail('Enter your first and last name.');
      if(!/^\S+@\S+\.\S+$/.test(em)) return fail('Enter a valid email address.');
      if(DB.users.some(u=>u.email.toLowerCase()===em.toLowerCase())) return fail('An account already uses that email. Sign in instead.');
      if(p1.length<6) return fail('Use a password of at least 6 characters.');
      if(p1!==p2) return fail('The two passwords do not match.');
      const u={id:nextId('user','U-'),firstName:first,lastName:last,email:em,password:p1,role:'customer',
        shipping:{name:first+' '+last,phone:'',address:'',city:'',postal:''},billing:''};
      DB.users.push(u); DB.session=u.id; save(); closeModal();
      toast(`Account created — welcome, ${first}`,'good');
      if(S.view==='checkout'||S.view==='account'||S.view==='orders') render(); else paintHeader();
    };
    $('#doRegister').onclick=submit;
    $('#rgPass2').onkeydown=ev=>{ if(ev.key==='Enter') submit(); };
  }
}

/* ----- SEARCH WITH AUTOCOMPLETE ----- */
function closeAC(){ const a=$('#ac'); if(a){ a.classList.remove('on'); a.innerHTML=''; } }
function paintAC(q){
  const a=$('#ac');
  if(!q){ closeAC(); return; }
  const t=q.toLowerCase();
  const hits=DB.products.filter(p=>(p.name+' '+p.category+' '+p.type).toLowerCase().includes(t)).slice(0,6);
  const cats=DB.categories.filter(c=>c.name.toLowerCase().includes(t));
  if(!hits.length&&!cats.length){
    /* never a dead end — offer somewhere to go */
    a.innerHTML=`<div class="ac-empty"><b>No match for “${esc(q)}”</b>
      <p class="muted" style="margin:6px 0 8px;font-size:13px">Try one of these instead.</p>
      <div class="chipline">${DB.categories.map(c=>`<button class="chip" data-acat="${esc(c.name)}">${esc(c.name)}</button>`).join('')}</div></div>`;
  } else {
    a.innerHTML=
      (cats.length?`<div class="ac-head">Categories</div>`+cats.map(c=>
        `<button class="ac-item" data-acat="${esc(c.name)}"><span class="tiny">${imgTag(c.img,80,96,'',c.name)}</span>
         <span><b>${esc(c.name)}</b><br><span class="muted" style="font-size:12.5px">${esc(c.blurb)}</span></span></button>`).join(''):'')
     +(hits.length?`<div class="ac-head">Products</div>`+hits.map(p=>
        `<button class="ac-item" data-aid="${esc(p.id)}">
          <span class="tiny">${productShot(p,80,96,'')}</span>
          <span><b>${esc(p.name)}</b><br><span class="muted" style="font-size:12.5px">${esc(p.category)} · ${money(p.price)}</span></span>
        </button>`).join(''):'')
     +`<button class="ac-item" data-aall="1" style="border-top:1px solid var(--line-soft)"><span class="muted">See all results for “${esc(q)}”</span></button>`;
  }
  a.classList.add('on');
  a.querySelectorAll('[data-aid]').forEach(b=>b.onclick=()=>{ closeAC(); go('product',{id:b.dataset.aid}); });
  a.querySelectorAll('[data-acat]').forEach(b=>b.onclick=()=>{
    F.q=''; $('#search').value=''; closeAC(); go('shop',{category:b.dataset.acat});
  });
  const all=a.querySelector('[data-aall]');
  if(all) all.onclick=()=>{ runSearch(); };
}
function runSearch(){
  const q=$('#search').value.trim();
  F.q=q; F.category=''; closeAC();
  go('shop',{});
}

/* ----- THEME ----- */
function paintThemeBtn(){
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  $('#themeBtn').innerHTML=dark
    ? `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="3.6"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5 6 6M14 14l1.5 1.5M15.5 4.5 14 6M6 14l-1.5 1.5"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 12.2A6.6 6.6 0 0 1 7.8 4a6.8 6.8 0 1 0 8.2 8.2Z"/></svg>`;
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  try{ localStorage.setItem('ff_theme',next); }catch(e){}
  paintThemeBtn();
}

/* ----- INIT ----- */
function boot(){
  DB=load();
  if(!DB||!DB.products||!DB.products.length){ DB=seedDB(); save(); }
  if(!DB.cart) DB.cart=[];
  if(!DB.wishlist) DB.wishlist=[];
  DB.categories.forEach(c=>{ if(!c.img) c.img=FALLBACK_IMG; });
  try{ const th=localStorage.getItem('ff_theme'); if(th) document.documentElement.setAttribute('data-theme',th); }catch(e){}

  $('#themeBtn').onclick=toggleTheme;
  $('#accBtn').onclick=()=>{ me()?go('account'):openAuth('login'); };
  $('#menuToggle').onclick=()=>$('#mainNav').classList.toggle('open');

  const si=$('#search');
  let tmr;
  si.oninput=()=>{ clearTimeout(tmr); tmr=setTimeout(()=>paintAC(si.value.trim()),110); };
  si.onkeydown=e=>{ if(e.key==='Enter') runSearch(); if(e.key==='Escape') closeAC(); };
  si.onfocus=()=>{ if(si.value.trim()) paintAC(si.value.trim()); };
  document.addEventListener('click',e=>{
    if(!e.target.closest('.searchbox')) closeAC();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ closeModal(); closeAC(); }
  });
  const nf=$('#newsForm');
  if(nf) nf.addEventListener('submit',e=>{
    e.preventDefault();
    const em=$('#newsEmail');
    if(!em.value.trim()||!/^\S+@\S+\.\S+$/.test(em.value.trim())){ toast('Enter a valid email address','bad'); return; }
    toast('Subscribed — welcome to the list','good'); em.value='';
  });

  render();
}
boot();
