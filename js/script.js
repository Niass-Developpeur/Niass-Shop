/* ==========================================================================
   NIASS-SHOP — script.js
   Données produits + panier (localStorage) + rendu dynamique des pages
   + filtres/tri + validation formulaires + petites animations.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. DONNÉES PRODUITS (à remplacer plus tard par un vrai backend/API)
   -------------------------------------------------------------------------- */
const NIASS_PRODUCTS = [
  { id: 1,  name: "Boubou Wax Éclat",        category: "femme",   price: 25000, oldPrice: 32000, image: "https://placehold.co/600x800/16233F/FAF5EC?text=Boubou+Wax",        images: ["https://placehold.co/600x800/16233F/FAF5EC?text=Boubou+Wax","https://placehold.co/600x800/24365C/FAF5EC?text=Vue+2","https://placehold.co/600x800/B8432E/FAF5EC?text=Vue+3"], sizes:["S","M","L","XL"], colors:["#16233F","#B8432E","#D9A441"], badge:"promo", popularity: 92, rating:4.6, desc:"Boubou en tissu wax authentique, coupe fluide et confortable, idéal pour les grandes occasions. Motifs colorés tissés avec finitions cousues main." },
  { id: 2,  name: "Chemise Lin Dakar",       category: "homme",   price: 18000, image: "https://placehold.co/600x800/F0E4CC/16233F?text=Chemise+Lin",                    images: ["https://placehold.co/600x800/F0E4CC/16233F?text=Chemise+Lin","https://placehold.co/600x800/E4D8BE/16233F?text=Vue+2"], sizes:["M","L","XL","XXL"], colors:["#F0E4CC","#16233F"], badge:"new", popularity: 78, rating:4.3, desc:"Chemise en lin léger, coupe droite, parfaite pour le climat de Dakar. Respirante et facile d'entretien." },
  { id: 3,  name: "Robe Bazin Riche",        category: "femme",   price: 42000, image: "https://placehold.co/600x800/B8432E/FAF5EC?text=Bazin+Riche",                    images: ["https://placehold.co/600x800/B8432E/FAF5EC?text=Bazin+Riche","https://placehold.co/600x800/96331F/FAF5EC?text=Vue+2"], sizes:["S","M","L"], colors:["#B8432E","#16233F"], badge:"new", popularity: 88, rating:4.8, desc:"Robe en bazin riche brodée main, tissu glacé haut de gamme. Une pièce d'exception pour vos cérémonies." },
  { id: 4,  name: "Ensemble Enfant Baobab",  category: "enfant",  price: 12000, image: "https://placehold.co/600x800/D9A441/16233F?text=Ensemble+Enfant",               images: ["https://placehold.co/600x800/D9A441/16233F?text=Ensemble+Enfant","https://placehold.co/600x800/B8842A/16233F?text=Vue+2"], sizes:["2-4 ans","5-7 ans","8-10 ans"], colors:["#D9A441","#16233F"], badge:"", popularity: 65, rating:4.4, desc:"Ensemble deux pièces confortable pour enfant, tissu doux et résistant, parfait pour l'école ou les fêtes." },
  { id: 5,  name: "Sneakers Teranga",        category: "chaussures", price: 27000, oldPrice: 31000, image: "https://placehold.co/600x800/16233F/D9A441?text=Sneakers",                images: ["https://placehold.co/600x800/16233F/D9A441?text=Sneakers","https://placehold.co/600x800/24365C/D9A441?text=Vue+2"], sizes:["39","40","41","42","43","44"], colors:["#16233F","#FAF5EC"], badge:"promo", popularity: 95, rating:4.7, desc:"Sneakers unisexe légères et résistantes, semelle amortissante, pour un style urbain toute la journée." },
  { id: 6,  name: "Kaftan Homme Prestige",   category: "homme",   price: 35000, image: "https://placehold.co/600x800/24365C/FAF5EC?text=Kaftan",                        images: ["https://placehold.co/600x800/24365C/FAF5EC?text=Kaftan","https://placehold.co/600x800/16233F/FAF5EC?text=Vue+2"], sizes:["M","L","XL","XXL"], colors:["#24365C","#221D17"], badge:"", popularity: 71, rating:4.5, desc:"Kaftan brodé traditionnel revisité, tissu premium, coupe moderne pour un look élégant et intemporel." },
  { id: 7,  name: "Jupe Ankara Moderne",     category: "femme",   price: 15000, image: "https://placehold.co/600x800/D9A441/221D17?text=Jupe+Ankara",                   images: ["https://placehold.co/600x800/D9A441/221D17?text=Jupe+Ankara","https://placehold.co/600x800/B8842A/221D17?text=Vue+2"], sizes:["S","M","L","XL"], colors:["#D9A441","#B8432E","#16233F"], badge:"new", popularity: 74, rating:4.2, desc:"Jupe taille haute en wax ankara, coupe crayon, idéale pour un look bureau chic et coloré." },
  { id: 8,  name: "Sac Cabas Tissé",         category: "accessoires", price: 9500, image: "https://placehold.co/600x800/F0E4CC/16233F?text=Sac+Cabas",                    images: ["https://placehold.co/600x800/F0E4CC/16233F?text=Sac+Cabas","https://placehold.co/600x800/E4D8BE/16233F?text=Vue+2"], sizes:["Taille unique"], colors:["#F0E4CC","#B8432E"], badge:"", popularity: 58, rating:4.1, desc:"Sac cabas tissé à la main, spacieux et robuste, un accessoire authentique pour toutes vos sorties." },
  { id: 9,  name: "Polo Casual Homme",       category: "homme",   price: 13500, image: "https://placehold.co/600x800/16233F/FAF5EC?text=Polo+Casual",                   images: ["https://placehold.co/600x800/16233F/FAF5EC?text=Polo+Casual","https://placehold.co/600x800/24365C/FAF5EC?text=Vue+2"], sizes:["S","M","L","XL"], colors:["#16233F","#B8432E","#F0E4CC"], badge:"", popularity: 66, rating:4.0, desc:"Polo en coton piqué, coupe régulière, un basique confortable pour toutes les journées." },
  { id: 10, name: "Sandales Cuir Gorée",     category: "chaussures", price: 16000, image: "https://placehold.co/600x800/B8842A/16233F?text=Sandales+Cuir",               images: ["https://placehold.co/600x800/B8842A/16233F?text=Sandales+Cuir","https://placehold.co/600x800/D9A441/16233F?text=Vue+2"], sizes:["37","38","39","40","41","42"], colors:["#B8842A","#221D17"], badge:"", popularity: 60, rating:4.3, desc:"Sandales artisanales en cuir véritable, confortables et durables, fabriquées localement." },
  { id: 11, name: "Robe Enfant Fleurie",     category: "enfant",  price: 11000, image: "https://placehold.co/600x800/B8432E/FAF5EC?text=Robe+Enfant",                   images: ["https://placehold.co/600x800/B8432E/FAF5EC?text=Robe+Enfant","https://placehold.co/600x800/96331F/FAF5EC?text=Vue+2"], sizes:["2-4 ans","5-7 ans","8-10 ans"], colors:["#B8432E","#D9A441"], badge:"new", popularity: 55, rating:4.5, desc:"Robe légère et joyeuse pour petite fille, tissu doux hypoallergénique, coupe confortable pour jouer toute la journée." },
  { id: 12, name: "Bijoux Perles Wolof",     category: "accessoires", price: 7000, image: "https://placehold.co/600x800/D9A441/16233F?text=Bijoux",                       images: ["https://placehold.co/600x800/D9A441/16233F?text=Bijoux","https://placehold.co/600x800/B8842A/16233F?text=Vue+2"], sizes:["Taille unique"], colors:["#D9A441","#16233F","#B8432E"], badge:"promo", oldPrice: 9000, popularity: 80, rating:4.6, desc:"Parure de perles artisanales, faite main, pour sublimer toutes vos tenues traditionnelles ou modernes." },
];

const CATEGORY_LABELS = {
  femme: "Femme", homme: "Homme", enfant: "Enfant",
  chaussures: "Chaussures", accessoires: "Accessoires"
};

/* --------------------------------------------------------------------------
   2. UTILITAIRES
   -------------------------------------------------------------------------- */
const formatPrice = (n) => n.toLocaleString("fr-FR") + " FCFA";
const getParam = (name) => new URLSearchParams(window.location.search).get(name);
const findProduct = (id) => NIASS_PRODUCTS.find(p => p.id === Number(id));

/* --------------------------------------------------------------------------
   3. PANIER (localStorage)
   -------------------------------------------------------------------------- */
const CART_KEY = "niass_cart";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(id, size, color, qty = 1){
  const cart = getCart();
  const existing = cart.find(l => l.id === id && l.size === size && l.color === color);
  if (existing){ existing.qty += qty; }
  else { cart.push({ id, size, color, qty }); }
  saveCart(cart);
  updateCartBadge();
  showToast("Article ajouté au panier !");
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function updateCartQty(index, qty){
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function cartCount(){ return getCart().reduce((sum, l) => sum + l.qty, 0); }

function cartLinesWithData(){
  return getCart().map(line => {
    const product = findProduct(line.id);
    return product ? { ...line, product } : null;
  }).filter(Boolean);
}

function cartTotal(){
  return cartLinesWithData().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}

function updateCartBadge(){
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = cartCount();
  });
}

/* --------------------------------------------------------------------------
   4. TOAST (confirmation ajout panier)
   -------------------------------------------------------------------------- */
function showToast(message){
  let container = document.getElementById("toastContainer");
  if (!container){
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = 1080;
    document.body.appendChild(container);
  }
  const toastEl = document.createElement("div");
  toastEl.className = "toast toast-niass align-items-center border-0";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
    </div>`;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 2200 });
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

/* --------------------------------------------------------------------------
   5. RENDU — CARTE PRODUIT (réutilisé partout)
   -------------------------------------------------------------------------- */
function productCardHTML(p){
  const badge = p.badge === "promo"
    ? `<span class="badge-sale">-${Math.round(100 - (p.price / p.oldPrice) * 100)}%</span>`
    : p.badge === "new" ? `<span class="badge-new">Nouveau</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : "";
  return `
  <div class="col-6 col-md-4 col-lg-3 reveal">
    <div class="product-card">
      <a href="${location.pathname.includes('/pages/') ? '' : 'pages/'}produit-detail.html?id=${p.id}" class="text-decoration-none">
        <div class="product-img-wrap">
          ${badge}
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <button class="btn-quick-add" type="button" aria-label="Ajout rapide au panier" onclick="event.preventDefault(); addToCart(${p.id}, '${p.sizes[0]}', '${p.colors[0]}', 1);">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1a1 1 0 0 1 1-1h1.22a1 1 0 0 1 .98.804L3.36 2H14.5a.5.5 0 0 1 .49.598l-1.5 7.5A.5.5 0 0 1 13 10.5H4a.5.5 0 0 1-.49-.402L2.01 2.61 1.61 1H1a1 1 0 0 1-1-1zm3.14 3 1.05 5.5h8.32l1.3-6.5H3.51z"/><path d="M6 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>
          </button>
        </div>
      </a>
      <div class="product-body">
        <div class="product-cat">${CATEGORY_LABELS[p.category] || p.category}</div>
        <a href="${location.pathname.includes('/pages/') ? '' : 'pages/'}produit-detail.html?id=${p.id}" class="text-decoration-none">
          <div class="product-name">${p.name}</div>
        </a>
        <div class="stars mb-1" aria-label="Note ${p.rating} sur 5">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5-Math.round(p.rating))}</div>
        <div>${oldPrice}<span class="price">${formatPrice(p.price)}</span></div>
      </div>
    </div>
  </div>`;
}

/* --------------------------------------------------------------------------
   6. PAGE ACCUEIL — produits vedettes
   -------------------------------------------------------------------------- */
function renderFeaturedProducts(){
  const el = document.getElementById("featuredProducts");
  if (!el) return;
  const featured = [...NIASS_PRODUCTS].sort((a,b) => b.popularity - a.popularity).slice(0,8);
  el.innerHTML = featured.map(productCardHTML).join("");
  observeReveal();
}

/* --------------------------------------------------------------------------
   7. PAGE CATALOGUE — filtres + tri + pagination
   -------------------------------------------------------------------------- */
const CATALOG_STATE = { category: [], maxPrice: 50000, sort: "popularity", page: 1, perPage: 8 };

function initCatalogPage(){
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const catFromUrl = getParam("categorie");
  if (catFromUrl) CATALOG_STATE.category = [catFromUrl];

  document.querySelectorAll(".filter-category").forEach(cb => {
    if (CATALOG_STATE.category.includes(cb.value)) cb.checked = true;
    cb.addEventListener("change", () => {
      CATALOG_STATE.category = [...document.querySelectorAll(".filter-category:checked")].map(c => c.value);
      CATALOG_STATE.page = 1;
      renderCatalog();
    });
  });

  const priceRange = document.getElementById("priceRange");
  if (priceRange){
    priceRange.addEventListener("input", (e) => {
      CATALOG_STATE.maxPrice = Number(e.target.value);
      document.getElementById("priceRangeValue").textContent = formatPrice(CATALOG_STATE.maxPrice);
      CATALOG_STATE.page = 1;
      renderCatalog();
    });
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect){
    sortSelect.addEventListener("change", (e) => {
      CATALOG_STATE.sort = e.target.value;
      renderCatalog();
    });
  }

  const resetBtn = document.getElementById("resetFilters");
  if (resetBtn){
    resetBtn.addEventListener("click", () => {
      CATALOG_STATE.category = [];
      CATALOG_STATE.maxPrice = 50000;
      CATALOG_STATE.page = 1;
      document.querySelectorAll(".filter-category").forEach(cb => cb.checked = false);
      if (priceRange){ priceRange.value = 50000; document.getElementById("priceRangeValue").textContent = formatPrice(50000); }
      renderCatalog();
    });
  }

  renderCatalog();
}

function renderCatalog(){
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  let list = NIASS_PRODUCTS.filter(p => p.price <= CATALOG_STATE.maxPrice);
  if (CATALOG_STATE.category.length){
    list = list.filter(p => CATALOG_STATE.category.includes(p.category));
  }

  switch (CATALOG_STATE.sort){
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    case "popularity":
    default: list.sort((a,b) => b.popularity - a.popularity);
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / CATALOG_STATE.perPage));
  CATALOG_STATE.page = Math.min(CATALOG_STATE.page, totalPages);
  const start = (CATALOG_STATE.page - 1) * CATALOG_STATE.perPage;
  const pageItems = list.slice(start, start + CATALOG_STATE.perPage);

  const resultCount = document.getElementById("resultCount");
  if (resultCount) resultCount.textContent = `${total} article${total>1?'s':''}`;

  grid.innerHTML = pageItems.length
    ? pageItems.map(productCardHTML).join("")
    : `<div class="col-12 text-center py-5"><p class="fs-5 text-muted">Aucun article ne correspond à ces filtres.</p></div>`;

  renderPagination(totalPages);
  observeReveal();
}

function renderPagination(totalPages){
  const pag = document.getElementById("catalogPagination");
  if (!pag) return;
  if (totalPages <= 1){ pag.innerHTML = ""; return; }
  let html = "";
  for (let i=1; i<=totalPages; i++){
    html += `<li class="page-item ${i===CATALOG_STATE.page ? 'active':''}">
      <button class="page-link" onclick="goToCatalogPage(${i})">${i}</button>
    </li>`;
  }
  pag.innerHTML = html;
}
function goToCatalogPage(n){
  CATALOG_STATE.page = n;
  renderCatalog();
  document.getElementById("catalogGrid").scrollIntoView({ behavior:"smooth", block:"start" });
}

/* --------------------------------------------------------------------------
   8. PAGE FICHE PRODUIT
   -------------------------------------------------------------------------- */
let PDP_STATE = { size: null, color: null, qty: 1, mainImage: 0 };

function initProductDetailPage(){
  const wrap = document.getElementById("pdpWrap");
  if (!wrap) return;

  const id = getParam("id");
  const product = findProduct(id) || NIASS_PRODUCTS[0];
  PDP_STATE = { size: product.sizes[0], color: product.colors[0], qty: 1, mainImage: 0 };

  document.title = `${product.name} — NIASS-SHOP`;
  document.getElementById("pdpBreadcrumb").textContent = product.name;
  document.getElementById("pdpName").textContent = product.name;
  document.getElementById("pdpCategory").textContent = CATEGORY_LABELS[product.category] || product.category;
  document.getElementById("pdpDesc").textContent = product.desc;
  document.getElementById("pdpStars").innerHTML = "★".repeat(Math.round(product.rating)) + "☆".repeat(5-Math.round(product.rating));
  document.getElementById("pdpRatingNum").textContent = `(${product.rating}/5)`;

  const priceEl = document.getElementById("pdpPrice");
  priceEl.innerHTML = (product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : "") + formatPrice(product.price);

  const mainImgEl = document.getElementById("pdpMainImg");
  mainImgEl.src = product.images[0];
  mainImgEl.alt = product.name;

  document.getElementById("pdpThumbs").innerHTML = product.images.map((img, i) => `
    <div class="col-4">
      <div class="pdp-thumb ${i===0?'active':''}" onclick="setPdpImage(${i})">
        <img src="${img}" alt="Vue ${i+1} de ${product.name}">
      </div>
    </div>`).join("");

  document.getElementById("pdpSizes").innerHTML = product.sizes.map((s,i) => `
    <button type="button" class="size-option ${i===0?'active':''}" onclick="setPdpSize('${s}', this)">${s}</button>
  `).join("");

  document.getElementById("pdpColors").innerHTML = product.colors.map((c,i) => `
    <span class="swatch ${i===0?'active':''}" style="background:${c}" role="button" aria-label="Couleur ${c}" onclick="setPdpColor('${c}', this)"></span>
  `).join("");

  document.getElementById("pdpQty").value = 1;
  document.getElementById("pdpAddToCart").onclick = () => {
    addToCart(product.id, PDP_STATE.size, PDP_STATE.color, PDP_STATE.qty);
  };

  window._currentPdpProduct = product;

  // Zoom au clic sur l'image principale
  const mainImgWrap = document.getElementById("pdpMainImgWrap");
  mainImgWrap.addEventListener("click", () => mainImgWrap.classList.toggle("zoomed"));

  // Produits similaires (même catégorie)
  const related = NIASS_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
  document.getElementById("relatedProducts").innerHTML = related.map(productCardHTML).join("");

  observeReveal();
}

function setPdpImage(i){
  const product = window._currentPdpProduct;
  document.getElementById("pdpMainImg").src = product.images[i];
  document.querySelectorAll(".pdp-thumb").forEach((el, idx) => el.classList.toggle("active", idx===i));
}
function setPdpSize(s, el){
  PDP_STATE.size = s;
  document.querySelectorAll("#pdpSizes .size-option").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}
function setPdpColor(c, el){
  PDP_STATE.color = c;
  document.querySelectorAll("#pdpColors .swatch").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}
function changePdpQty(delta){
  const input = document.getElementById("pdpQty");
  PDP_STATE.qty = Math.max(1, Number(input.value) + delta);
  input.value = PDP_STATE.qty;
}

/* --------------------------------------------------------------------------
   9. PAGE PANIER
   -------------------------------------------------------------------------- */
function renderCartPage(){
  const container = document.getElementById("cartLines");
  if (!container) return;

  const lines = cartLinesWithData();

  if (!lines.length){
    container.innerHTML = `
      <div class="text-center py-5">
        <p class="fs-5 mb-3">Votre panier est vide.</p>
        <a href="produits.html" class="btn btn-niass-primary">Découvrir la boutique</a>
      </div>`;
  } else {
    container.innerHTML = lines.map((l, i) => `
      <div class="cart-line d-flex align-items-center gap-3">
        <img src="${l.product.image}" alt="${l.product.name}">
        <div class="flex-grow-1">
          <div class="fw-bold" style="font-family:var(--font-display); color:var(--niass-navy);">${l.product.name}</div>
          <div class="text-muted small mb-1">Taille : ${l.size} • Couleur : <span class="swatch" style="width:14px;height:14px;vertical-align:-2px;background:${l.color}"></span></div>
          <div class="qty-control">
            <button type="button" aria-label="Diminuer la quantité" onclick="updateCartQty(${i}, ${l.qty - 1})">−</button>
            <input type="text" readonly value="${l.qty}" aria-label="Quantité">
            <button type="button" aria-label="Augmenter la quantité" onclick="updateCartQty(${i}, ${l.qty + 1})">+</button>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold mb-2">${formatPrice(l.product.price * l.qty)}</div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${i})">Supprimer</button>
        </div>
      </div>
    `).join("");
  }

  const total = cartTotal();
  const shipping = total > 0 && total < 25000 ? 2000 : 0;
  document.getElementById("cartSubtotal").textContent = formatPrice(total);
  document.getElementById("cartShipping").textContent = shipping === 0 ? "Gratuite" : formatPrice(shipping);
  document.getElementById("cartTotal").textContent = formatPrice(total + shipping);

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.disabled = lines.length === 0;
}

/* --------------------------------------------------------------------------
   10. VALIDATION FORMULAIRES (contact / newsletter / inscription)
   -------------------------------------------------------------------------- */
function initFormValidation(){
  document.querySelectorAll("form.needs-validation").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (form.checkValidity()){
        form.classList.remove("was-validated");
        form.reset();
        const successId = form.dataset.successTarget;
        if (successId){
          const el = document.getElementById(successId);
          if (el){
            el.classList.remove("d-none");
            setTimeout(() => el.classList.add("d-none"), 4000);
          }
        } else {
          showToast("Formulaire envoyé avec succès !");
        }
      }
      form.classList.add("was-validated");
    }, false);
  });
}

/* --------------------------------------------------------------------------
   11. ANIMATIONS AU SCROLL (IntersectionObserver)
   -------------------------------------------------------------------------- */
function observeReveal(){
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   12. INITIALISATION GLOBALE
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderFeaturedProducts();
  initCatalogPage();
  initProductDetailPage();
  renderCartPage();
  initFormValidation();
  observeReveal();

  // Navbar : surligner le lien actif selon la page courante
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-niass .nav-link").forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === path) link.classList.add("active");
  });
});
