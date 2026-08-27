const state = {
  language: localStorage.getItem("pricecompare_language") || "uz",
  currency: localStorage.getItem("pricecompare_currency") || "UZS",
  theme: localStorage.getItem("pricecompare_theme") || "light",
  comparison: JSON.parse(localStorage.getItem("pricecompare_comparison") || "[]"),
  products: JSON.parse(localStorage.getItem("pricecompare_products_cache") || "[]")
};

const translations = {
  uz: { title:"Mahsulotlarni taqqoslash", subtitle:"4 tagacha mahsulot tanlab, xususiyatlarini solishtiring", clear:"Tozalash", empty:"Hali mahsulot tanlanmagan", emptyText:"Taqqoslash uchun kamida 2 ta mahsulot qo'shing.", products:"Mahsulotlarni ko'rish", name:"Nomi", brand:"Brend", price:"Narx", rating:"Reyting", stock:"Holati", store:"Do'kon" },
  ru: { title:"Сравнение товаров", subtitle:"Выберите до 4 товаров", clear:"Очистить", empty:"Товары не выбраны", emptyText:"Добавьте минимум 2 товара для сравнения.", products:"Показать товары", name:"Название", brand:"Бренд", price:"Цена", rating:"Рейтинг", stock:"Наличие", store:"Магазин" },
  en: { title:"Product comparison", subtitle:"Select up to 4 products", clear:"Clear", empty:"No products selected", emptyText:"Add at least 2 products to compare.", products:"Show products", name:"Name", brand:"Brand", price:"Price", rating:"Rating", stock:"Stock", store:"Store" }
};

const rates = { UZS:1, USD:1/12650, EUR:0.92/12650, JPY:155/12650, RUB:82/12650 };
const symbols = { UZS:"so'm", USD:"$", EUR:"€", JPY:"¥", RUB:"₽" };
const baseThemes = ["light","dark","neon","black"];
const allThemes = [...baseThemes,"blue","purple","cyber","aurora","galaxy","matrix"];
const themeNames = {
  light:{uz:"Yorug‘",ru:"Светлая",en:"Light"}, dark:{uz:"Qorong‘i",ru:"Тёмная",en:"Dark"}, neon:{uz:"Neon",ru:"Neon",en:"Neon"}, black:{uz:"Qora",ru:"Чёрная",en:"Black"},
  blue:{uz:"Ko‘k",ru:"Синяя",en:"Blue"}, purple:{uz:"Binafsha",ru:"Фиолетовая",en:"Purple"}, cyber:{uz:"Cyber",ru:"Cyber",en:"Cyber"}, aurora:{uz:"Aurora",ru:"Aurora",en:"Aurora"}, galaxy:{uz:"Galaxy",ru:"Galaxy",en:"Galaxy"}, matrix:{uz:"Matrix",ru:"Matrix",en:"Matrix"}
};

function t(key){ return translations[state.language]?.[key] || translations.uz[key] || key; }
function escapeHtml(v){return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function formatPrice(v){ const n=Number(v||0)* (rates[state.currency]||1); if(!n)return "—"; return new Intl.NumberFormat(state.language === "ru" ? "ru-RU" : state.language === "en" ? "en-US" : "uz-UZ",{maximumFractionDigits:state.currency === "UZS" || state.currency === "JPY" ? 0 : 2}).format(n)+" "+symbols[state.currency]; }
function applyTheme(theme){ state.theme=theme; document.body.dataset.theme=theme; localStorage.setItem("pricecompare_theme",theme); renderThemes(); }
function renderThemes(){ const panel=document.getElementById("compareThemePanel"); panel.innerHTML=(localStorage.getItem("pricecompare_show_homepage_themes")==="true"?allThemes:baseThemes).map(id=>`<button class="theme-option ${id===state.theme?"active":""}" data-theme="${id}" type="button">${escapeHtml(themeNames[id][state.language])}</button>`).join(""); panel.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>applyTheme(b.dataset.theme)); }
function renderText(){document.getElementById("comparePageTitle").textContent=t("title");document.getElementById("comparePageSubtitle").textContent=t("subtitle");document.getElementById("compareClearText").textContent=t("clear");document.getElementById("compareEmptyTitle").textContent=t("empty");document.getElementById("compareEmptyText").textContent=t("emptyText");document.querySelector(".compare-empty a").textContent=t("products");renderThemes();}
function render(){
  const products=state.comparison.map(id=>state.products.find(p=>String(p.id)===String(id))).filter(Boolean);
  const empty=document.getElementById("comparePageEmpty"), wrap=document.getElementById("comparePageTableWrap"), table=document.getElementById("comparePageTable");
  if(products.length<2){empty.style.display="block";wrap.style.display="none";return;}
  empty.style.display="none";wrap.style.display="block";
  const row=(label,fn)=>`<tr><td>${label}</td>${products.map(p=>`<td>${fn(p)}</td>`).join("")}</tr>`;
  table.innerHTML=`<tr><th>${t("name")}</th>${products.map(p=>`<th>${escapeHtml(p.name||"-")}</th>`).join("")}</tr>`+
    row(t("brand"),p=>escapeHtml(p.brand||"-"))+row(t("price"),p=>`<strong>${formatPrice(p.price)}</strong>`)+row(t("rating"),p=>escapeHtml(p.rating||"-"))+row(t("stock"),p=>escapeHtml(p.stock||"-"))+row(t("store"),p=>escapeHtml(p.store||p.source||"-"));
}

document.getElementById("compareLanguage").value=state.language;
document.getElementById("compareLanguage").onchange=e=>{state.language=e.target.value;localStorage.setItem("pricecompare_language",state.language);renderText();render();};
document.getElementById("compareClear").onclick=()=>{state.comparison=[];localStorage.setItem("pricecompare_comparison","[]");render();};
document.getElementById("compareThemeBtn").onclick=()=>document.getElementById("compareThemePanel").classList.toggle("active");
document.body.dataset.theme=state.theme;renderText();render();
