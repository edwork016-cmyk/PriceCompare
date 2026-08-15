const API_URL = "/api/search";

const searchInput = document.getElementById("search");
const productsContainer = document.getElementById("products");

const storeFilter = document.getElementById("storeFilter");
const sortSelect = document.getElementById("sort");
const priceRange = document.getElementById("priceRange");
const priceDisplay = document.getElementById("priceDisplay");
const clearFilters = document.getElementById("clearFilters");

const countElement = document.getElementById("count");
const avgPriceElement = document.getElementById("avgPrice");
const favCountElement = document.getElementById("favCount");
const favTotalElement = document.getElementById("favTotal");

const languageSelect = document.getElementById("languageSelect");
const currencySelect = document.getElementById("currencySelect");

const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");

const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesModal = document.getElementById("favoritesModal");
const favoritesList = document.getElementById("favoritesList");
const closeModal = document.getElementById("closeModal");

let products = [];

let favorites = JSON.parse(
    localStorage.getItem("pricecompareFavorites")
) || [];

let currentLanguage =
    localStorage.getItem("pricecompareLanguage") || "ru";

let currentCurrency =
    localStorage.getItem("pricecompareCurrency") || "USD";

let currentTheme =
    localStorage.getItem("pricecompareTheme") || "light";


const translations = {
    ru: {
        search: "Поиск товара...",
        heroTitle: "Сравнивайте цены за несколько секунд",
        heroText: "Найдите самое выгодное предложение среди популярных товаров",
        allSources: "Все источники",
        cheap: "Сначала дешёвые",
        expensive: "Сначала дорогие",
        rating: "По рейтингу",
        clear: "Очистить",
        products: "Товаров найдено",
        sources: "Источников",
        average: "Средняя цена",
        favorites: "В избранном",
        view: "Посмотреть товар",
        favoriteTitle: "Избранное",
        empty: "Введите название товара для поиска 🔎",
        loading: "Товары загружаются...",
        notFound: "Товары не найдены",
        footer: "Сервис поиска и сравнения товаров."
    },

    uz: {
        search: "Mahsulot qidirish...",
        heroTitle: "Narxlarni bir necha soniyada solishtiring",
        heroText: "Mashhur mahsulotlar orasidan eng yaxshi taklifni toping",
        allSources: "Barcha manbalar",
        cheap: "Avval arzonlari",
        expensive: "Avval qimmatlari",
        rating: "Reyting bo'yicha",
        clear: "Tozalash",
        products: "Mahsulot topildi",
        sources: "Manbalar",
        average: "O'rtacha narx",
        favorites: "Sevimlilarda",
        view: "Mahsulotni ko'rish",
        favoriteTitle: "Sevimlilar",
        empty: "Qidirish uchun mahsulot nomini yozing 🔎",
        loading: "Mahsulotlar yuklanmoqda...",
        notFound: "Mahsulotlar topilmadi",
        footer: "Mahsulotlarni qidirish va solishtirish xizmati."
    },

    en: {
        search: "Search for a product...",
        heroTitle: "Compare prices in just a few seconds",
        heroText: "Find the best offer among popular products",
        allSources: "All sources",
        cheap: "Cheapest first",
        expensive: "Most expensive first",
        rating: "By rating",
        clear: "Clear",
        products: "Products found",
        sources: "Sources",
        average: "Average price",
        favorites: "In favorites",
        view: "View product",
        favoriteTitle: "Favorites",
        empty: "Enter a product name to search 🔎",
        loading: "Loading products...",
        notFound: "No products found",
        footer: "Product search and comparison service."
    }
};


const rates = {
    USD: 1,
    UZS: 12500,
    EUR: 0.92,
    JPY: 150,
    RUB: 100
};


function t(key) {
    return translations[currentLanguage][key] || key;
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatPrice(usdPrice) {

    const value =
        Number(usdPrice || 0) * rates[currentCurrency];

    if (currentCurrency === "UZS") {
        return `${Math.round(value).toLocaleString("uz-UZ")} so'm`;
    }

    if (currentCurrency === "EUR") {
        return `€${value.toFixed(2)}`;
    }

    if (currentCurrency === "JPY") {
        return `¥${Math.round(value).toLocaleString()}`;
    }

    if (currentCurrency === "RUB") {
        return `₽${Math.round(value).toLocaleString()}`;
    }

    return `$${value.toFixed(2)}`;
}


function updatePriceRangeMax() {
    // Update slider max based on current currency
    // We want max $2000 USD equivalent
    const maxUSD = 2000;
    const maxInCurrentCurrency = maxUSD * rates[currentCurrency];
    priceRange.max = Math.round(maxInCurrentCurrency);
}


function getMaxPriceInUSD() {
    // The slider value is in the current currency, so divide by rate to get USD
    return Number(priceRange.value) / rates[currentCurrency];
}


function updatePriceDisplay() {
    // Get the max price in USD first, then format it in current currency
    const maxPriceUSD = getMaxPriceInUSD();
    priceDisplay.textContent =
        `≤ ${formatPrice(maxPriceUSD)}`;
}


function updateLanguage() {

    document.documentElement.lang = currentLanguage;

    searchInput.placeholder = t("search");

    document.getElementById("heroTitle").textContent =
        t("heroTitle");

    document.getElementById("heroText").textContent =
        t("heroText");

    storeFilter.options[0].textContent =
        t("allSources");

    sortSelect.options[0].textContent =
        t("cheap");

    sortSelect.options[1].textContent =
        t("expensive");

    sortSelect.options[2].textContent =
        t("rating");

    document.getElementById("clearText").textContent =
        t("clear");

    document.getElementById("productsText").textContent =
        t("products");

    document.getElementById("sourcesText").textContent =
        t("sources");

    document.getElementById("averageText").textContent =
        t("average");

    document.getElementById("favoritesText").textContent =
        t("favorites");

    document.getElementById("favoritesTitle").textContent =
        t("favoriteTitle");

    document.getElementById("footerText").textContent =
        t("footer");

    applyFilters();
}


function updateStats(list) {

    countElement.textContent = list.length;

    if (list.length === 0) {
        avgPriceElement.textContent = formatPrice(0);
    } else {

        const total =
            list.reduce(
                (sum, product) =>
                    sum + Number(product.price || 0),
                0
            );

        avgPriceElement.textContent =
            formatPrice(total / list.length);
    }

    favCountElement.textContent = favorites.length;
    favTotalElement.textContent = favorites.length;
}


function showMessage(message) {

    productsContainer.innerHTML = `
        <div class="empty-message">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}


function showLoading() {

    productsContainer.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>${escapeHTML(t("loading"))}</p>
        </div>
    `;
}


async function searchProducts() {

    const query = searchInput.value.trim();

    if (!query) {
        products = [];
        updateStats([]);
        showMessage(t("empty"));
        return;
    }

    showLoading();

    try {

        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Search error"
            );
        }

        products = data.products || [];

        applyFilters();

    } catch (error) {

        console.error(error);

        products = [];

        updateStats([]);

        showMessage("❌ " + error.message);
    }
}


function applyFilters() {

    let filtered = [...products];

    const maxPrice = getMaxPriceInUSD();

    filtered = filtered.filter(
        product =>
            Number(product.price || 0) <= maxPrice
    );

    if (storeFilter.value !== "all") {

        filtered = filtered.filter(
            product =>
                product.store === storeFilter.value
        );
    }

    if (sortSelect.value === "cheap") {

        filtered.sort(
            (a, b) =>
                Number(a.price) - Number(b.price)
        );
    }

    if (sortSelect.value === "expensive") {

        filtered.sort(
            (a, b) =>
                Number(b.price) - Number(a.price)
        );
    }

    if (sortSelect.value === "rating") {

        filtered.sort(
            (a, b) =>
                Number(b.rating || 0) -
                Number(a.rating || 0)
        );
    }

    updateStats(filtered);

    renderProducts(filtered);
}


function renderProducts(list) {

    productsContainer.innerHTML = "";

    if (products.length === 0) {
        showMessage(t("empty"));
        return;
    }

    if (list.length === 0) {
        showMessage(t("notFound"));
        return;
    }

    list.forEach(product => {

        const isFavorite =
            favorites.some(
                item =>
                    String(item.id) === String(product.id)
            );

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <button
                    class="favorite-btn ${isFavorite ? "active" : ""}"
                    data-id="${escapeHTML(product.id)}"
                    type="button"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <div class="product-store">
                    <i class="fa-solid fa-store"></i>
                    ${escapeHTML(product.store || "Demo Catalog")}
                </div>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-brand">
                    ${escapeHTML(product.brand || product.category || "")}
                </p>

                <div class="rating">
                    ★ ${Number(product.rating || 0).toFixed(1)}
                </div>

                <div class="price">
                    ${formatPrice(product.price)}
                </div>

                <a
                    class="view-product"
                    href="${escapeHTML(product.url || "#")}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${t("view")}
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>

            </div>
        `;

        const favoriteButton =
            card.querySelector(".favorite-btn");

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(product);
        });

        productsContainer.appendChild(card);
    });
}


function toggleFavorite(product) {

    const index =
        favorites.findIndex(
            item =>
                String(item.id) === String(product.id)
        );

    if (index === -1) {
        favorites.push(product);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem(
        "pricecompareFavorites",
        JSON.stringify(favorites)
    );

    applyFilters();
}


function renderFavorites() {

    favoritesList.innerHTML = "";

    if (favorites.length === 0) {

        favoritesList.innerHTML = `
            <div class="empty-message">
                <p>${t("favorites")} — 0</p>
            </div>
        `;

        return;
    }

    favorites.forEach(product => {

        const item =
            document.createElement("div");

        item.className = "favorite-item";

        item.innerHTML = `

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
            >

            <div>

                <h4>${escapeHTML(product.name)}</h4>

                <p>${formatPrice(product.price)}</p>

                ${product.url ? `
                <a
                    class="view-product-favorite"
                    href="${escapeHTML(product.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${t("view")}
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
                ` : ""}

            </div>

            <button
                class="remove-favorite"
                type="button"
            >
                ×
            </button>
        `;

        item
            .querySelector(".remove-favorite")
            .addEventListener("click", () => {

                favorites = favorites.filter(
                    favorite =>
                        String(favorite.id) !==
                        String(product.id)
                );

                localStorage.setItem(
                    "pricecompareFavorites",
                    JSON.stringify(favorites)
                );

                updateStats(products);

                renderFavorites();

                applyFilters();
            });

        favoritesList.appendChild(item);
    });
}


/* EVENTS */

let searchTimer;

searchInput.addEventListener("input", () => {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {

        if (searchInput.value.trim().length >= 2) {
            searchProducts();
        }

    }, 500);
});


searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchProducts();
    }
});


storeFilter.addEventListener(
    "change",
    applyFilters
);

sortSelect.addEventListener(
    "change",
    applyFilters
);

priceRange.addEventListener("input", () => {
    updatePriceDisplay();
    applyFilters();
});


clearFilters.addEventListener("click", () => {

    searchInput.value = "";

    storeFilter.value = "all";
    sortSelect.value = "cheap";

    // Set price range to max for current currency
    const maxUSD = 2000;
    priceRange.value = Math.round(maxUSD * rates[currentCurrency]);

    updatePriceDisplay();

    products = [];

    updateStats([]);

    showMessage(t("empty"));
});


languageSelect.addEventListener("change", () => {

    currentLanguage =
        languageSelect.value;

    localStorage.setItem(
        "pricecompareLanguage",
        currentLanguage
    );

    updateLanguage();
});


currencySelect.addEventListener("change", () => {

    currentCurrency =
        currencySelect.value;

    localStorage.setItem(
        "pricecompareCurrency",
        currentCurrency
    );

    updatePriceRangeMax();

    updatePriceDisplay();

    applyFilters();
});


themeBtn.addEventListener("click", () => {
    themePanel.classList.toggle("show");
});


document.querySelectorAll(".theme-option").forEach(button => {

    button.addEventListener("click", () => {

        currentTheme =
            button.dataset.theme;

        document.body.dataset.theme =
            currentTheme;

        localStorage.setItem(
            "pricecompareTheme",
            currentTheme
        );

        themePanel.classList.remove("show");
    });

});


favoritesBtn.addEventListener("click", () => {

    renderFavorites();

    favoritesModal.classList.add("show");
});


closeModal.addEventListener("click", () => {
    favoritesModal.classList.remove("show");
});


favoritesModal.addEventListener("click", event => {

    if (event.target === favoritesModal) {
        favoritesModal.classList.remove("show");
    }

});


/* START */

document.body.dataset.theme = currentTheme;

languageSelect.value = currentLanguage;
currencySelect.value = currentCurrency;

updatePriceRangeMax();

updatePriceDisplay();
updateLanguage();
updateStats([]);

searchInput.value = "iphone";

searchProducts();