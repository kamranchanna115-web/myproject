const products=[
{id:1,name:"Graveborn Oversized Tee",price:42,cat:["new","gothic"],tag:"NEW",tone:"#111",desc:"Heavyweight oversized cotton tee with a distressed graveyard graphic."},
{id:2,name:"Nocturne Sigil Tee",price:38,cat:["gothic"],tag:"BEST SELLER",tone:"#151515",desc:"A clean gothic sigil printed on a premium heavyweight silhouette."},
{id:3,name:"Ritual // 01 Tee",price:45,cat:["new","gothic"],tag:"LIMITED",tone:"#171717",desc:"Limited-run ritual graphic with cracked ink texture."},
{id:4,name:"Custom Black Label Tee",price:39,cat:["custom"],tag:"CUSTOM",tone:"#0b0b0b",desc:"Start with a blank heavyweight tee and make it yours."},
{id:5,name:"Ashes & Roses Tee",price:40,cat:["gothic"],tag:"",tone:"#202020",desc:"Dark botanical artwork on a relaxed fit cotton tee."},
{id:6,name:"After Midnight Tee",price:36,cat:["sale"],tag:"SALE",tone:"#121212",desc:"Minimal midnight typography, now at a reduced price."},
{id:7,name:"Vowbreaker Tee",price:44,cat:["new","gothic"],tag:"NEW",tone:"#101010",desc:"Sharp gothic lettering with a worn-in vintage finish."},
{id:8,name:"Your Art // Custom",price:39,cat:["custom"],tag:"CUSTOM",tone:"#090909",desc:"Upload your artwork and create a one-of-one Arrax piece."}
];
let cart=JSON.parse(localStorage.getItem("arraxCart")||"[]"), wishes=JSON.parse(localStorage.getItem("arraxWish")||"[]"), currentCat="all", shirt="#0b0b0b";
const money=n=>"$"+n.toFixed(2);
function renderProducts(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 let list=products.filter(p=>(currentCat==="all"||p.cat.includes(currentCat)) && (!q||p.name.toLowerCase().includes(q)));
 document.getElementById("productGrid").innerHTML=list.map(p=>`
 <article class="product-card" onclick="showProduct(${p.id})">
  ${p.tag?`<span class="badge">${p.tag}</span>`:""}<button class="heart" onclick="event.stopPropagation();toggleWish(${p.id})">${wishes.includes(p.id)?"♥":"♡"}</button>
  <div class="product-image"><div class="product-shirt" style="background:${p.tone}"><span>${p.id===8?"YOUR ART":"ARRAX"}</span></div></div>
  <div class="product-info"><h3>${p.name}<strong>${money(p.price)}</strong></h3><p>Heavyweight cotton • Unisex fit</p></div>
 </article>`).join("")||"<p>No pieces found in the darkness.</p>";
}
function showProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`<div class="detail"><div class="detail-image"><div class="product-shirt" style="background:${p.tone};width:55%;height:65%"><span>ARRAX</span></div></div><div><p class="eyebrow">${p.tag||"ARRAX COLLECTION"}</p><h2>${p.name}</h2><p class="price">${money(p.price)}</p><p>${p.desc}</p><p class="muted">100% premium cotton • heavyweight 240 GSM • relaxed/unisex fit</p><label class="eyebrow">SIZE<select id="detailSize" style="display:block;width:100%;margin-top:8px"><option>S</option><option selected>M</option><option>L</option><option>XL</option><option>2XL</option></select></label><br><button class="btn primary full" onclick="addToCart(${p.id},document.getElementById('detailSize').value)">ADD TO BAG</button><br><br><button class="btn ghost full" onclick="closeModal()">CONTINUE SHOPPING</button></div></div>`;
 openModal();
}
function addToCart(id,size="M",custom=null){
 const key=custom?custom.key:id+"-"+size, found=cart.find(x=>x.key===key);
 if(found)found.qty++;else{const p=custom||products.find(x=>x.id===id);cart.push({key,id:p.id,name:p.name,price:p.price,size,qty:1,custom:!!custom,preview:custom?.preview||""})}
 save();toast("Added to your bag.");closeModal();openCart();
}
function addCustom(){
 const text=document.getElementById("customText").value||"ARRAX", color=document.getElementById("printColor").value;
 addToCart(4,document.querySelector(".sizes .selected")?.textContent||"M",{key:"custom-"+Date.now(),id:4,name:"Custom Black Label Tee",price:39,preview:text});
}
function save(){localStorage.setItem("arraxCart",JSON.stringify(cart));localStorage.setItem("arraxWish",JSON.stringify(wishes));updateCounts();renderCart()}
function updateCounts(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("wishCount").textContent=wishes.length}
function renderCart(){
 const el=document.getElementById("cartItems"),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 document.getElementById("cartTotal").textContent=money(total);
 el.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><div class="cart-thumb">${x.custom?(x.preview||"CUSTOM"):"ARRAX"}</div><div><h4>${x.name}</h4><p>Size ${x.size} • ${money(x.price)}</p><div class="qty"><button onclick="changeQty(${i},-1)">−</button> ${x.qty} <button onclick="changeQty(${i},1)">+</button></div></div><button class="heart" style="position:static" onclick="removeCart(${i})">×</button></div>`).join(""):`<div style="text-align:center;padding:60px 20px;color:#777">Your bag is empty.<br><br><a href="#shop" class="btn ghost" onclick="closeDrawers()">EXPLORE THE DROP</a></div>`;
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save()}
function removeCart(i){cart.splice(i,1);save()}
function openCart(){renderCart();document.getElementById("cartDrawer").classList.add("open");document.getElementById("drawerBackdrop").classList.add("show")}
function closeDrawers(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("drawerBackdrop").classList.remove("show")}
function openModal(){document.getElementById("modal").classList.add("open")}
function closeModal(){document.getElementById("modal").classList.remove("open")}
function toggleWish(id){wishes.includes(id)?wishes=wishes.filter(x=>x!==id):wishes.push(id);save();renderProducts();toast(wishes.includes(id)?"Saved to wishlist":"Removed from wishlist")}
function showWishlist(){showPage("Wishlist",wishes.length?`<p>You saved ${wishes.length} piece${wishes.length>1?"s":""}.</p>${wishes.map(id=>{let p=products.find(x=>x.id===id);return `<p><strong>${p.name}</strong> — ${money(p.price)}</p>`}).join("")}":"<p>Your wishlist is empty.</p>")}
function checkout(){
 if(!cart.length){toast("Your bag is empty.");return}
 closeDrawers();showPage("CHECKOUT",`<form onsubmit="placeOrder(event)" class="checkout-form"><label>EMAIL<input required type="email" placeholder="you@example.com"></label><label>FULL NAME<input required placeholder="Your name"></label><label>ADDRESS<input required placeholder="Street address"></label><label>CITY / POSTAL CODE<input required placeholder="City, ZIP / Postal code"></label><label>PAYMENT METHOD<select><option>Card •••• 4242 (demo)</option><option>Cash on Delivery</option></select></label><div class="custom-price"><span>Total</span><strong>${money(cart.reduce((s,x)=>s+x.price*x.qty,0))}</strong></div><button class="btn primary full">PLACE ORDER</button><p class="muted">Demo checkout — connect Stripe/PayPal or your local payment gateway before accepting real payments.</p></form>`);
}
function placeOrder(e){e.preventDefault();cart=[];save();showPage("ORDER CONFIRMED",`<h2>THANK YOU.</h2><p>Your Arrax order has been received. In a production store, this is where your payment processor and order-management system would confirm the transaction.</p><button class="btn primary" onclick="closeModal();location.hash='shop'">BACK TO SHOP</button>`)}
function showAccount(){showPage("YOUR ACCOUNT",`<p>Sign in to view orders, track deliveries, manage addresses and save your favorite pieces.</p><form class="checkout-form"><label>EMAIL<input type="email" placeholder="you@example.com"></label><label>PASSWORD<input type="password" placeholder="••••••••"></label><button class="btn primary full" type="button" onclick="toast('Demo account login — connect your auth provider here.')">SIGN IN</button></form>`)}
function showPage(title,body){
 document.getElementById("modalContent").innerHTML=`<p class="eyebrow">ARRAX</p><h2>${title}</h2>${body||pageText(title)}`;openModal();
}
function pageText(t){let m={FAQ:"<p><strong>How long does shipping take?</strong><br>Standard delivery typically takes 3–7 business days after production.</p><p><strong>Can I return a custom shirt?</strong><br>Custom products are generally final sale unless they arrive damaged or incorrect.</p>", "Size Guide":"<p>Our tees use a relaxed unisex fit. S, M, L, XL and 2XL are available. Add a measurement chart here before launch.</p>","Shipping":"<p>Orders are processed after purchase. Delivery estimates and shipping charges are shown at checkout based on destination.</p>","Returns":"<p>Request eligible returns within your stated return window. Items should be unworn, unwashed and in original condition.</p>","Privacy Policy":"<p>Arrax collects only the information needed to process orders, provide support and operate the store. Replace this placeholder with your jurisdiction-specific privacy policy before launch.</p>","Terms & Conditions":"<p>Use of this demo storefront is subject to your final terms, product rules, payment conditions and applicable law. Replace this placeholder before launch.</p>","Refund Policy":"<p>Approved refunds are returned through the original payment method where possible. Define your exact refund timelines before launch.</p>","Contact":"<p>Email: hello@arrax.example</p><p>Replace this demo address with your real support email, social accounts and business details.</p>"};return m[t]||"<p>ARRAX — dark streetwear for the unordinary.</p>"}
function updatePreview(){const x=document.getElementById("printPreview");x.textContent=document.getElementById("customText").value||"ARRAX";x.style.color=document.getElementById("printColor").value}
function setShirt(c,b){shirt=c;document.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector(".tee").style.background=c}
function pickSize(b){document.querySelectorAll(".sizes button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")}
function previewUpload(e){if(e.target.files[0])toast("Artwork selected — live image upload preview can be connected to your storage/print service.")}
function toggleSearch(){const x=document.getElementById("searchBar");x.style.display=x.style.display==="block"?"none":"block";if(x.style.display==="block")document.getElementById("searchInput").focus()}
function toggleMenu(){document.querySelector(".site-header nav").style.display=document.querySelector(".site-header nav").style.display==="flex"?"none":"flex"}
function subscribe(e){e.preventDefault();toast("Welcome to the inner circle.")}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentCat=b.dataset.cat;renderProducts()}));
renderProducts();renderCart();updateCounts();
