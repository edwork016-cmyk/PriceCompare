// ==========================================
// PRICECOMPARE - FRONTEND SCRIPT
// Node.js + Express Backend bilan ishlaydi
// ==========================================


// ==========================================
// HTML ELEMENTLARI
// ==========================================

const searchInput = document.getElementById("search");
const storeFilter = document.getElementById("storeFilter");
const sortSelect = document.getElementById("sort");
const priceRange = document.getElementById("priceRange");
const priceDisplay = document.getElementById("priceDisplay");
const clearFiltersBtn = document.getElementById("clearFilters");

const productsContainer = document.getElementById("products");
const noResults = document.getElementById("noResults");

const count = document.getElementById("count");
const avgPrice = document.getElementById("avgPrice");

const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");
const themeOptions = document.querySelectorAll(".theme-option");

const languageSelect = document.getElementById("languageSelect");
const currencySelect = document.getElementById("currencySelect");

const favoritesBtn = document.querySelector(".favorites-btn");
const favCount = document.getElementById("favCount");
const favTotal = document.getElementById("favTotal");

const favoritesModal = document.getElementById("favoritesModal");
const closeModal = document.getElementById("closeModal");
const favoritesList = document.getElementById("favoritesList");


// ==========================================
// MA'LUMOTLAR
// ==========================================

let products = [];

let favorites =
    JSON.parse(localStorage.getItem("priceCompareFavorites")) || [];

let currentLanguage =
    localStorage.getItem("priceCompareLanguage") || "ru";

let currentCurrency =
    localStorage.getItem("priceCompareCurrency") || "USD";

let currentTheme =
    localStorage.getItem("priceCompareTheme") || "light";


// ==========================================
// VALYUTA KURSLARI
// Hozircha demo kurslar
// ==========================================

const exchangeRates = {
    USD: 1,
    UZS: 12600,
    EUR: 0.92,
    JPY: 150
};


// ==========================================
// TILLAR
// ==========================================

const translations = {

    ru: {
        heroTitle: "Сравнивайте цены за несколько секунд",
        heroText: "Найдите самое выгодное предложение среди популярных товаров",
        allStores: "Все магазины",
        cheap: "Сначала дешёвые",
        expensive: "Сначала дорогие",
        ratingSort: "По рейтингу",
        newest: "Новые",
        clear: "Очистить",
        productsFound: "Товаров найдено",
        stores: "Магазина",
        averagePrice: "Средняя цена",
        favorites: "В избранном",
        notFound: "Товары не найдены",
        tryAgain: "Попробуйте изменить параметры поиска",
        footerText: "Сервис поиска и сравнения товаров.",
        favoritesTitle: "Избранные товары",
        searchPlaceholder: "Поиск товара...",
        viewProduct: "Посмотреть товар",
        remove: "Удалить",
        emptyFavorites: "Избранное пусто",
        searching: "Поиск товаров...",
        searchError: "Не удалось загрузить товары",
        enterSearch: "Введите название товара"
    },

    uz: {
        heroTitle: "Narxlarni bir necha soniyada solishtiring",
        heroText: "Ommabop mahsulotlar orasidan eng yaxshi taklifni toping",
        allStores: "Barcha do'konlar",
        cheap: "Avval arzonlari",
        expensive: "Avval qimmatlari",
        ratingSort: "Reyting bo'yicha",
        newest: "Yangilari",
        clear: "Tozalash",
        productsFound: "Mahsulot topildi",
        stores: "Do'kon",
        averagePrice: "O'rtacha narx",
        favorites: "Sevimlilarda",
        notFound: "Mahsulot topilmadi",
        tryAgain: "Qidiruv parametrlarini o'zgartirib ko'ring",
        footerText: "Mahsulotlarni qidirish va solishtirish xizmati.",
        favoritesTitle: "Sevimli mahsulotlar",
        searchPlaceholder: "Mahsulot qidirish...",
        viewProduct: "Mahsulotni ko'rish",
        remove: "O'chirish",
        emptyFavorites: "Sevimlilar bo'sh",
        searching: "Mahsulotlar qidirilmoqda...",
        searchError: "Mahsulotlarni yuklab bo'lmadi",
        enterSearch: "Mahsulot nomini kiriting"
    },

    en: {
        heroTitle: "Compare prices in seconds",
        heroText: "Find the best offer among popular products",
        allStores: "All stores",
        cheap: "Cheapest first",
        expensive: "Most expensive",
        ratingSort: "By rating",
        newest: "Newest",
        clear: "Clear",
        productsFound: "Products found",
        stores: "Stores",
        averagePrice: "Average price",
        favorites: "Favorites",
        notFound: "Products not found",
        tryAgain: "Try changing your search settings",
        footerText: "Product search and comparison service.",
        favoritesTitle: "Favorite products",
        searchPlaceholder: "Search product...",
        viewProduct: "View product",
        remove: "Remove",
        emptyFavorites: "Favorites are empty",
        searching: "Searching products...",
        searchError: "Could not load products",
        enterSearch: "Enter a product name"
    }

};


// ==========================================
// NARXNI FORMATLASH
// ==========================================

function formatPrice(price) {

    const convertedPrice =
        Number(price) * exchangeRates[currentCurrency];

    return new Intl.NumberFormat(
        currentLanguage === "uz"
            ? "uz-UZ"
            : currentLanguage === "ru"
            ? "ru-RU"
            : "en-US",
        {
            style: "currency",
            currency: currentCurrency,

            maximumFractionDigits:
                currentCurrency === "UZS" ||
                currentCurrency === "JPY"
                    ? 0
                    : 2
        }
    ).format(convertedPrice);

}


// ==========================================
// BACKEND ORQALI QIDIRISH
// GET /api/search?q=iphone
// ==========================================

async function searchProducts(query) {

    if (!query || !query.trim()) {

        alert(
            translations[currentLanguage].enterSearch
        );

        return;
    }


    productsContainer.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
        ">
            <i
                class="fa-solid fa-spinner fa-spin"
                style="
                    font-size: 40px;
                    color: var(--primary);
                "
            ></i>

            <p style="
                margin-top: 20px;
                font-size: 17px;
            ">
                ${translations[currentLanguage].searching}
            </p>
        </div>
    `;

    noResults.style.display = "none";


    try {

        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query.trim())}`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Search error"
            );

        }


        products = data.products || [];


        renderProducts();


    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        products = [];

        count.textContent = "0";

        avgPrice.textContent =
            formatPrice(0);

        productsContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
            ">
                <i
                    class="fa-solid fa-triangle-exclamation"
                    style="
                        font-size: 45px;
                        color: #ef4444;
                    "
                ></i>

                <h2 style="margin-top: 20px">
                    ${translations[currentLanguage].searchError}
                </h2>

                <p style="margin-top: 10px">
                    ${error.message}
                </p>
            </div>
        `;

    }

}


// ==========================================
// MAHSULOTLARNI KO'RSATISH
// ==========================================

function renderProducts() {

    let list = [...products];

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const maxPrice =
        Number(priceRange.value);


    // ======================================
    // LOKAL QIDIRUV
    // ======================================

    if (searchText) {

        list = list.filter(product => {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            const brand =
                String(product.brand || "")
                    .toLowerCase();

            return (
                name.includes(searchText) ||
                category.includes(searchText) ||
                brand.includes(searchText)
            );

        });

    }


    // ======================================
    // DO'KON FILTRI
    // ======================================

    if (storeFilter.value !== "all") {

        list = list.filter(product =>
            product.store === storeFilter.value
        );

    }


    // ======================================
    // NARX FILTRI
    // API narxlari USD hisoblanadi
    // ======================================

    list = list.filter(product =>
        Number(product.price) <= maxPrice
    );


    // ======================================
    // SARALASH
    // ======================================

    switch (sortSelect.value) {

        case "cheap":

            list.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

            break;


        case "expensive":

            list.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

            break;


        case "rating":

            list.sort(
                (a, b) =>
                    Number(b.rating) -
                    Number(a.rating)
            );

            break;


        case "newest":

            list.sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

            break;

    }


    // ======================================
    // STATISTIKA
    // ======================================

    count.textContent =
        list.length;


    if (list.length > 0) {

        const totalPrice =
            list.reduce(
                (sum, product) =>
                    sum + Number(product.price),
                0
            );

        const average =
            totalPrice / list.length;

        avgPrice.textContent =
            formatPrice(average);

    } else {

        avgPrice.textContent =
            formatPrice(0);

    }


    // ======================================
    // NATIJA TOPILMADI
    // ======================================

    if (list.length === 0) {

        productsContainer.innerHTML = "";

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    // ======================================
    // PRODUCT CARDS
    // ======================================

    productsContainer.innerHTML =
        list.map(product => {

            const isFavorite =
                favorites.some(
                    item =>
                        Number(item.id) ===
                        Number(product.id)
                );


            return `

                <div class="product">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${escapeHtml(product.name)}"
                            loading="lazy"
                            onerror="this.src='https://placehold.co/400x400?text=No+Image'"
                        >


                        <button
                            class="favorite-btn ${isFavorite ? "active" : ""}"
                            onclick="toggleFavorite(${Number(product.id)})"
                            title="Favorite"
                        >

                            <i class="
                                fa-${isFavorite ? "solid" : "regular"}
                                fa-heart
                            "></i>

                        </button>

                    </div>


                    <div class="product-content">


                        <span class="store">

                            <i class="fa-solid fa-store"></i>

                            ${escapeHtml(product.store || "Unknown")}

                        </span>


                        <h3>
                            ${escapeHtml(product.name)}
                        </h3>


                        <p class="category">

                            ${escapeHtml(product.brand || "")}
                            ${product.brand && product.category ? " • " : ""}
                            ${escapeHtml(product.category || "")}

                        </p>


                        <div class="price">

                            ${formatPrice(product.price)}

                        </div>


                        <div class="rating">

                            <i class="fa-solid fa-star"></i>

                            ${Number(product.rating || 0).toFixed(1)}

                        </div>


                        <button
                            class="buy-btn"
                            onclick="viewProduct(${Number(product.id)})"
                        >

                            ${translations[currentLanguage].viewProduct}

                        </button>


                    </div>

                </div>

            `;

        }).join("");

}


// ==========================================
// HTML XAVFSIZLIGI
// ==========================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// FAVORITE QO'SHISH / OLIB TASHLASH
// ==========================================

function toggleFavorite(id) {

    const product =
        products.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!product) return;


    const exists =
        favorites.some(
            item =>
                Number(item.id) === Number(id)
        );


    if (exists) {

        favorites =
            favorites.filter(
                item =>
                    Number(item.id) !== Number(id)
            );

    } else {

        favorites.push(product);

    }


    saveFavorites();

    updateFavorites();

    renderProducts();


    if (
        favoritesModal &&
        favoritesModal.style.display === "flex"
    ) {

        renderFavorites();

    }

}

window.toggleFavorite =
    toggleFavorite;


// ==========================================
// FAVORITELARNI SAQLASH
// ==========================================

function saveFavorites() {

    localStorage.setItem(
        "priceCompareFavorites",
        JSON.stringify(favorites)
    );

}


// ==========================================
// FAVORITELAR SONI
// ==========================================

function updateFavorites() {

    favCount.textContent =
        favorites.length;

    favTotal.textContent =
        favorites.length;

}


// ==========================================
// FAVORITEDAN O'CHIRISH
// ==========================================

function removeFavorite(id) {

    favorites =
        favorites.filter(
            item =>
                Number(item.id) !== Number(id)
        );


    saveFavorites();

    updateFavorites();

    renderFavorites();

    renderProducts();

}

window.removeFavorite =
    removeFavorite;


// ==========================================
// FAVORITES MODAL
// ==========================================

if (favoritesBtn) {

    favoritesBtn.addEventListener(
        "click",
        () => {

            renderFavorites();

            favoritesModal.style.display =
                "flex";

        }
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            favoritesModal.style.display =
                "none";

        }
    );

}


if (favoritesModal) {

    favoritesModal.addEventListener(
        "click",
        event => {

            if (
                event.target === favoritesModal
            ) {

                favoritesModal.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// FAVORITELARNI KO'RSATISH
// ==========================================

function renderFavorites() {

    if (!favoritesList) return;


    if (favorites.length === 0) {

        favoritesList.innerHTML = `

            <div class="empty-favorites">

                <i
                    class="fa-regular fa-heart"
                    style="font-size: 45px"
                ></i>

                <h3 style="margin-top: 15px">

                    ${translations[currentLanguage].emptyFavorites}

                </h3>

            </div>

        `;

        return;

    }


    favoritesList.innerHTML =
        favorites.map(product => `

            <div class="favorite-item">


                <img
                    src="${product.image}"
                    alt="${escapeHtml(product.name)}"
                    onerror="this.src='https://placehold.co/100x100?text=No+Image'"
                >


                <div class="favorite-info">

                    <h3>
                        ${escapeHtml(product.name)}
                    </h3>

                    <p>
                        ${escapeHtml(product.store || "")}
                        •
                        ${formatPrice(product.price)}
                    </p>

                </div>


                <button
                    class="remove-favorite"
                    onclick="removeFavorite(${Number(product.id)})"
                >

                    <i class="fa-solid fa-trash"></i>

                    ${translations[currentLanguage].remove}

                </button>


            </div>

        `).join("");

}


// ==========================================
// PRODUCT HAQIDA MA'LUMOT
// ==========================================

function viewProduct(id) {

    const product =
        products.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!product) return;


    alert(
        `${product.name}\n\n` +
        `Store: ${product.store}\n` +
        `Brand: ${product.brand || "Unknown"}\n` +
        `Price: ${formatPrice(product.price)}\n` +
        `Rating: ${Number(product.rating || 0).toFixed(1)} ⭐`
    );

}

window.viewProduct =
    viewProduct;


// ==========================================
// ENTER BOSIB QIDIRISH
// ==========================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            const query =
                searchInput.value.trim();

            searchProducts(query);

        }

    }
);


// ==========================================
// DO'KON FILTRI
// ==========================================

storeFilter.addEventListener(
    "change",
    renderProducts
);


// ==========================================
// SORT
// ==========================================

sortSelect.addEventListener(
    "change",
    renderProducts
);


// ==========================================
// NARX SLIDER
// ==========================================

priceRange.addEventListener(
    "input",
    () => {

        priceDisplay.textContent =
            `≤ ${formatPrice(
                Number(priceRange.value)
            )}`;

        renderProducts();

    }
);


// ==========================================
// FILTERLARNI TOZALASH
// ==========================================

clearFiltersBtn.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        storeFilter.value = "all";

        sortSelect.value = "cheap";

        priceRange.value = 2000;


        priceDisplay.textContent =
            `≤ ${formatPrice(2000)}`;


        renderProducts();

    }
);


// ==========================================
// TILNI O'ZGARTIRISH
// ==========================================

function changeLanguage() {

    currentLanguage =
        languageSelect.value;


    localStorage.setItem(
        "priceCompareLanguage",
        currentLanguage
    );


    document.querySelectorAll(
        "[data-i18n]"
    ).forEach(element => {

        const key =
            element.dataset.i18n;


        if (
            translations[currentLanguage][key]
        ) {

            element.textContent =
                translations[currentLanguage][key];

        }

    });


    searchInput.placeholder =
        translations[currentLanguage]
            .searchPlaceholder;


    priceDisplay.textContent =
        `≤ ${formatPrice(
            Number(priceRange.value)
        )}`;


    renderProducts();


    if (
        favoritesModal &&
        favoritesModal.style.display === "flex"
    ) {

        renderFavorites();

    }

}


languageSelect.addEventListener(
    "change",
    changeLanguage
);


// ==========================================
// VALYUTANI O'ZGARTIRISH
// ==========================================

currencySelect.addEventListener(
    "change",
    () => {

        currentCurrency =
            currencySelect.value;


        localStorage.setItem(
            "priceCompareCurrency",
            currentCurrency
        );


        priceDisplay.textContent =
            `≤ ${formatPrice(
                Number(priceRange.value)
            )}`;


        renderProducts();


        if (
            favoritesModal &&
            favoritesModal.style.display === "flex"
        ) {

            renderFavorites();

        }

    }
);


// ==========================================
// TEMA
// ==========================================

function setTheme(theme) {

    currentTheme =
        theme;


    document.body.setAttribute(
        "data-theme",
        theme
    );


    localStorage.setItem(
        "priceCompareTheme",
        theme
    );


    themeOptions.forEach(option => {

        option.classList.toggle(
            "active",
            option.dataset.theme === theme
        );

    });

}


// ==========================================
// THEME PANEL
// ==========================================

themeBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        themePanel.classList.toggle(
            "show"
        );

    }
);


// ==========================================
// 10 TA TEMANI TANLASH
// ==========================================

themeOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            setTheme(
                option.dataset.theme
            );


            themePanel.classList.remove(
                "show"
            );

        }
    );

});


// ==========================================
// TASHQARIGA BOSILSA YOPILADI
// ==========================================

document.addEventListener(
    "click",
    event => {

        if (
            themePanel &&
            themeBtn &&
            !themePanel.contains(event.target) &&
            !themeBtn.contains(event.target)
        ) {

            themePanel.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// START
// ==========================================

function startApp() {

    // Saqlangan til
    languageSelect.value =
        currentLanguage;


    // Saqlangan valuta
    currencySelect.value =
        currentCurrency;


    // Saqlangan tema
    setTheme(currentTheme);


    // Tilni yuklash
    changeLanguage();


    // Favorites soni
    updateFavorites();


    // Narx slider yozuvi
    priceDisplay.textContent =
        `≤ ${formatPrice(
            Number(priceRange.value)
        )}`;


    // Boshlang'ich mahsulot qidiruvi
    searchProducts("phone");

}


// APP START

startApp();