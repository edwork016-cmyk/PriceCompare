// ======================================================
// PRICECOMPARE FRONTEND
// Uzum Market + Yandex Market
// ======================================================

const state = {
    products: [],
    filteredProducts: [],
    favorites: JSON.parse(
        localStorage.getItem("pricecompare_favorites") || "[]"
    ),
    comparison: JSON.parse(
        localStorage.getItem("pricecompare_comparison") || "[]"
    ),
    language:
        localStorage.getItem("pricecompare_language") || "uz",
    currency:
        localStorage.getItem("pricecompare_currency") || "UZS",
    theme:
        localStorage.getItem("pricecompare_theme") || "light"
};


// ======================================================
// ELEMENTS
// ======================================================

const searchInput =
    document.getElementById("search");

const searchButton =
    document.getElementById("searchButton");

const productsContainer =
    document.getElementById("products");

const sortSelect =
    document.getElementById("sort");

const priceRange =
    document.getElementById("priceRange");

const priceInput =
    document.getElementById("priceInput");

const priceDisplay =
    document.getElementById("priceDisplay");

const clearFilters =
    document.getElementById("clearFilters");

const languageSelect =
    document.getElementById("languageSelect");

const currencySelect =
    document.getElementById("currencySelect");

const themeBtn =
    document.getElementById("themeBtn");

const themePanel =
    document.getElementById("themePanel");

const favoritesBtn =
    document.getElementById("favoritesBtn");

const favoritesModal =
    document.getElementById("favoritesModal");

const closeModal =
    document.getElementById("closeModal");

const favoritesList =
    document.getElementById("favoritesList");

const compareNavBtn =
    document.getElementById("compareNavBtn");

const compareSection =
    document.getElementById("compareSection");

const compareBackBtn =
    document.getElementById("compareBackBtn");

const clearComparison =
    document.getElementById("clearComparison");

const compareTable =
    document.getElementById("compareTable");

const compareEmpty =
    document.getElementById("compareEmpty");

const compareTableWrap =
    document.getElementById("compareTableWrap");

const compareGoProducts =
    document.getElementById("compareGoProducts");


// ======================================================
// CURRENCY
// ======================================================

const currencyRates = {
    UZS: 1,
    USD: 1 / 12650,
    EUR: 0.92 / 12650,
    JPY: 155 / 12650,
    RUB: 82 / 12650
};

const currencySymbols = {
    UZS: "so'm",
    USD: "$",
    EUR: "€",
    JPY: "¥",
    RUB: "₽"
};


// ======================================================
// TRANSLATIONS
// ======================================================

const translations = {

    uz: {
        heroTitle:
            "Narxlarni bir necha soniyada solishtiring",

        heroText:
            "Uzum Market va Yandex Market mahsulotlarini bir joyda solishtiring",

        search:
            "Mahsulot qidirish...",

        searchButton:
            "Qidirish",

        cheap:
            "Avval arzonlari",

        expensive:
            "Avval qimmatlari",

        rating:
            "Reyting bo'yicha",

        clear:
            "Tozalash",

        products:
            "Mahsulot topildi",

        sources:
            "Manba",

        average:
            "O'rtacha narx",

        favorites:
            "Sevimlilarda",

        compare:
            "Taqqoslash",

        added:
            "Tanlandi",

        view:
            "Ko'rish",

        noProducts:
            "Mahsulot topilmadi",

        searchFirst:
            "Mahsulot qidiring",

        loading:
            "Mahsulotlar qidirilmoqda...",

        favoritesTitle:
            "Sevimlilar",

        noFavorites:
            "Hozircha sevimli mahsulotlar yo'q",

        remove:
            "O'chirish",

        compareTitle:
            "Mahsulotlarni taqqoslash",

        compareSubtitle:
            "4 tagacha mahsulot tanlab, xususiyatlarini solishtiring",

        back:
            "Mahsulotlarga",

        clearCompare:
            "Tozalash",

        emptyCompare:
            "Hali mahsulot tanlanmagan",

        emptyCompareText:
            "Taqqoslash uchun kamida 2 ta mahsulot qo'shing.",

        showProducts:
            "Mahsulotlarni ko'rish",

        name:
            "Nomi",

        brand:
            "Brend",

        price:
            "Narx",

        ratingLabel:
            "Reyting",

        stock:
            "Holati",

        store:
            "Do'kon"
    },

    ru: {
        heroTitle:
            "Сравнивайте цены за несколько секунд",

        heroText:
            "Сравнивайте товары Uzum Market и Yandex Market в одном месте",

        search:
            "Поиск товара...",

        searchButton:
            "Поиск",

        cheap:
            "Сначала дешевые",

        expensive:
            "Сначала дорогие",

        rating:
            "По рейтингу",

        clear:
            "Очистить",

        products:
            "Найдено товаров",

        sources:
            "Источники",

        average:
            "Средняя цена",

        favorites:
            "В избранном",

        compare:
            "Сравнить",

        added:
            "Выбрано",

        view:
            "Открыть",

        noProducts:
            "Товары не найдены",

        searchFirst:
            "Найдите товар",

        loading:
            "Поиск товаров...",

        favoritesTitle:
            "Избранное",

        noFavorites:
            "Избранных товаров пока нет",

        remove:
            "Удалить",

        compareTitle:
            "Сравнение товаров",

        compareSubtitle:
            "Выберите до 4 товаров",

        back:
            "К товарам",

        clearCompare:
            "Очистить",

        emptyCompare:
            "Товары не выбраны",

        emptyCompareText:
            "Добавьте минимум 2 товара для сравнения.",

        showProducts:
            "Показать товары",

        name:
            "Название",

        brand:
            "Бренд",

        price:
            "Цена",

        ratingLabel:
            "Рейтинг",

        stock:
            "Наличие",

        store:
            "Магазин"
    },

    en: {
        heroTitle:
            "Compare prices in seconds",

        heroText:
            "Compare products from Uzum Market and Yandex Market in one place",

        search:
            "Search for a product...",

        searchButton:
            "Search",

        cheap:
            "Cheapest first",

        expensive:
            "Most expensive",

        rating:
            "By rating",

        clear:
            "Clear",

        products:
            "Products found",

        sources:
            "Sources",

        average:
            "Average price",

        favorites:
            "Favorites",

        compare:
            "Compare",

        added:
            "Selected",

        view:
            "View",

        noProducts:
            "No products found",

        searchFirst:
            "Search for a product",

        loading:
            "Searching products...",

        favoritesTitle:
            "Favorites",

        noFavorites:
            "No favorite products yet",

        remove:
            "Remove",

        compareTitle:
            "Product comparison",

        compareSubtitle:
            "Select up to 4 products",

        back:
            "Products",

        clearCompare:
            "Clear",

        emptyCompare:
            "No products selected",

        emptyCompareText:
            "Add at least 2 products to compare.",

        showProducts:
            "Show products",

        name:
            "Name",

        brand:
            "Brand",

        price:
            "Price",

        ratingLabel:
            "Rating",

        stock:
            "Stock",

        store:
            "Store"
    }
};


// ======================================================
// INIT
// ======================================================

function init() {

    document.body.dataset.theme =
        state.theme;

    languageSelect.value =
        state.language;

    currencySelect.value =
        state.currency;

    updateTranslations();
    updateCounts();
    updateCompare();

}

init();


// ======================================================
// TRANSLATION
// ======================================================

function t(key) {

    return (
        translations[state.language]?.[key] ||
        translations.uz[key] ||
        key
    );

}

function updateTranslations() {

    document.getElementById("heroTitle").textContent =
        t("heroTitle");

    document.getElementById("heroText").textContent =
        t("heroText");

    searchInput.placeholder =
        t("search");

    searchButton.innerHTML =
        `<i class="fa-solid fa-search"></i> ${t("searchButton")}`;

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

    document.getElementById("compareTitle").textContent =
        t("compareTitle");

    document.getElementById("compareSubtitle").textContent =
        t("compareSubtitle");

    document.getElementById("compareBackText").textContent =
        t("back");

    document.getElementById("clearCompareText").textContent =
        t("clearCompare");

    document.getElementById("compareEmptyTitle").textContent =
        t("emptyCompare");

    document.getElementById("compareEmptyText").textContent =
        t("emptyCompareText");

    document.getElementById("compareGoProductsText").textContent =
        t("showProducts");

    document.getElementById("favoritesTitle").textContent =
        t("favoritesTitle");

    if (state.products.length) {
        renderProducts();
    }

}


// ======================================================
// SEARCH
// ======================================================

searchButton.addEventListener(
    "click",
    searchProducts
);

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchProducts();
        }

    }
);


function normalizeSearchText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\u0400-\u04ff\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


function productMatchesQuery(product, query) {

    const normalizedQuery =
        normalizeSearchText(query);

    if (!normalizedQuery) {
        return false;
    }

    const searchText =
        normalizeSearchText(
            [
                product?.name,
                product?.title,
                product?.brand,
                product?.category,
                product?.description,
                product?.model
            ]
                .filter(Boolean)
                .join(" ")
        );

    if (!searchText) {
        return false;
    }

    const groupDefinitions = {
        headphone: [
            "headphone",
            "earphone",
            "earbuds"
        ]
    };

    for (const [group, groupWords] of Object.entries(groupDefinitions)) {

        const forbiddenGroups = {
            headphone: [
                "headphone",
                "earphone",
                "earbuds"
            ]
        };

        const forbidden =
            forbiddenGroups[group] || [];

        if (
            forbidden.some(word =>
                searchText.includes(
                    normalizeSearchText(word)
                )
            )
        ) {
            return false;
        }

        const matched =
            groupWords.some(word =>
                searchText.includes(
                    normalizeSearchText(word)
                )
            );

        if (!matched) {
            continue;
        }

        const queryWords =
            normalizedQuery
                .split(" ")
                .filter(word => word.length >= 3);

        const matchedWords =
            queryWords.filter(word =>
                searchText.includes(word)
            );

        if (
            queryWords.length >= 2 &&
            matchedWords.length === 0
        ) {
            return false;
        }

        return true;
    }

    const words =
        normalizedQuery
            .split(" ")
            .filter(word => word.length >= 3);

    if (!words.length) {
        return false;
    }

    const matched =
        words.filter(word =>
            searchText.includes(word)
        );

    return (
        matched.length >=
        Math.max(1, Math.ceil(words.length / 2))
    );

}


function filterRelevantProducts(products, query) {

    return products.filter(product =>
        productMatchesQuery(product, query)
    );

}


async function searchProducts() {

    const query =
        searchInput.value.trim();

    if (!query) {

        productsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>${t("searchFirst")}</p>
            </div>
        `;

        return;
    }


    productsContainer.innerHTML = `
        <div class="loading-message">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>${t("loading")}</p>
        </div>
    `;


    try {

        const response =
            await fetch(
                `/api/search?q=${encodeURIComponent(query)}`
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "API error"
            );
        }


        state.products =
            Array.isArray(data.products)
                ? data.products
                : [];


        state.filteredProducts =
            [...state.products];


        // Maximum price filterni avtomatik moslaymiz

        const prices =
            state.products
                .map(p => Number(p.price || 0))
                .filter(p => p > 0);


        if (prices.length) {

            const max =
                Math.ceil(
                    Math.max(...prices) /
                    100000
                ) * 100000;

            priceRange.max =
                convertFromUZS(max);

            priceRange.value =
                priceRange.max;

        }


        updatePriceText();
        updateStats();
        renderProducts();

    }

    catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <div class="error-message">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>Ma'lumot olishda xatolik yuz berdi</p>
                <small>${error.message}</small>
            </div>
        `;

    }

}


// ======================================================
// IMAGE URL
// ======================================================

function getImageUrl(product) {

    if (!product.image) {
        return "";
    }


    if (typeof product.image === "string") {
        return product.image;
    }


    if (product.image.link) {

        return (
            product.image.link.high ||
            product.image.link.low ||
            ""
        );

    }


    return "";

}


// ======================================================
// PRICE
// ======================================================

function convertFromUZS(
    uzs
) {

    const rate =
        currencyRates[state.currency] ||
        1;

    return uzs * rate;

}


function formatPrice(
    uzs
) {

    const value =
        convertFromUZS(
            Number(uzs || 0)
        );


    if (!value) {
        return "Narx mavjud emas";
    }


    const locales = {
        UZS: "uz-UZ",
        USD: "en-US",
        EUR: "de-DE",
        JPY: "ja-JP",
        RUB: "ru-RU"
    };


    return new Intl.NumberFormat(
        locales[state.currency] || "uz-UZ",
        {
            maximumFractionDigits:
                state.currency === "UZS" ||
                state.currency === "JPY"
                    ? 0
                    : 2
        }
    ).format(value)
        + " "
        + currencySymbols[state.currency];

}


function isValidProductUrl(url) {

    if (!url || typeof url !== "string") {
        return false;
    }

    const value = url.trim();

    if (!value) return false;
    if (value === "#") return false;
    if (value === "null") return false;
    if (value === "undefined") return false;
    if (value.startsWith("javascript:")) return false;

    try {

        const parsed = new URL(value);

        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {
        return false;
    }

}


function getProductUrl(product) {

    const candidates = [
        product?.url,
        product?.productUrl
    ];

    for (const candidate of candidates) {
        if (isValidProductUrl(candidate)) {
            return candidate.trim();
        }
    }

    const productName =
        String(
            product?.name ||
            product?.title ||
            "product"
        ).trim();

    const source =
        String(
            product?.source ||
            product?.store ||
            ""
        ).toLowerCase();

    const query =
        encodeURIComponent(productName || "product");

    if (source.includes("uzum")) {
        return `https://uzum.uz/ru/search?query=${query}`;
    }

    if (source.includes("yandex")) {
        return `https://market.yandex.uz/search?text=${query}`;
    }

    return `https://www.google.com/search?q=${query}`;

}


// ======================================================
// PRODUCTS RENDER
// ======================================================

function renderProducts() {

    let products =
        [...state.products];


    const maxPrice =
        Number(priceRange.value || Infinity);


    products =
        products.filter(product => {

            if (!product.price) {
                return false;
            }

            return (
                convertFromUZS(
                    Number(product.price)
                ) <= maxPrice
            );

        });


    if (sortSelect.value === "cheap") {

        products.sort(
            (a, b) =>
                Number(a.price || 0) -
                Number(b.price || 0)
        );

    }


    if (sortSelect.value === "expensive") {

        products.sort(
            (a, b) =>
                Number(b.price || 0) -
                Number(a.price || 0)
        );

    }


    if (sortSelect.value === "rating") {

        products.sort(
            (a, b) =>
                Number(b.rating || 0) -
                Number(a.rating || 0)
        );

    }


    state.filteredProducts =
        products;


    if (!products.length) {

        productsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-box-open"></i>
                <p>${t("noProducts")}</p>
            </div>
        `;

        return;
    }


    productsContainer.innerHTML =
        products.map(
            productCard
        ).join("");

}


// ======================================================
// PRODUCT CARD
// ======================================================

function productCard(product) {

    const image =
        getImageUrl(product);


    const favorite =
        state.favorites.includes(
            product.id
        );


    const compared =
        state.comparison.includes(
            product.id
        );


    const rating =
        Number(product.rating || 0);


    const stars =
        rating
            ? "★".repeat(
                Math.round(rating)
            )
            : "☆";


    return `
        <article
            class="product-card"
            data-id="${escapeHtml(product.id)}"
        >

            <div class="product-image
                ${image ? "" : "no-image"}">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(product.name)}"
                                loading="lazy"
                                onerror="this.parentElement.classList.add('no-image'); this.remove();"
                            >
                        `
                        : `
                            <i class="fa-solid fa-image"></i>
                        `
                }


                <button
                    class="favorite-btn ${favorite ? "active" : ""}"
                    onclick="toggleFavorite('${escapeJs(product.id)}')"
                    title="Favorite"
                >
                    <i class="${
                        favorite
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>
                </button>

            </div>


            <div class="product-content">

                <span class="product-store">
                    ${
                        product.source === "uzum"
                            ? "Uzum Market"
                            : "Yandex Market"
                    }
                </span>


                <h3 class="product-name">
                    ${escapeHtml(product.name)}
                </h3>


                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>


                <div class="product-rating">
                    ${
                        rating
                            ? `${stars} ${rating}/5`
                            : "Reyting mavjud emas"
                    }
                </div>


                <div class="product-meta">
                    ${escapeHtml(product.stock || "Mavjud")}
                </div>


                <div class="product-actions">

                    <a
                        href="${escapeHtml(getProductUrl(product))}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        ${t("view")}
                    </a>


                    <button
                        class="compare-btn"
                        onclick="toggleCompare('${escapeJs(product.id)}')"
                    >
                        <i class="fa-solid fa-code-compare"></i>

                        ${
                            compared
                                ? t("added")
                                : t("compare")
                        }
                    </button>

                </div>

            </div>

        </article>
    `;

}


// ======================================================
// FAVORITES
// ======================================================

window.toggleFavorite =
function(id) {

    const index =
        state.favorites.indexOf(id);


    if (index === -1) {

        state.favorites.push(id);

    } else {

        state.favorites.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "pricecompare_favorites",
        JSON.stringify(state.favorites)
    );


    updateCounts();
    renderProducts();
    renderFavorites();

};


// ======================================================
// FAVORITES MODAL
// ======================================================

favoritesBtn.addEventListener(
    "click",
    () => {

        renderFavorites();

        favoritesModal.classList.add(
            "active"
        );

    }
);


closeModal.addEventListener(
    "click",
    () => {

        favoritesModal.classList.remove(
            "active"
        );

    }
);


favoritesModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            favoritesModal
        ) {

            favoritesModal.classList.remove(
                "active"
            );

        }

    }
);


function renderFavorites() {

    const items =
        state.products.filter(
            product =>
                state.favorites.includes(
                    product.id
                )
        );


    if (!items.length) {

        favoritesList.innerHTML = `
            <div class="empty-message">
                ${t("noFavorites")}
            </div>
        `;

        return;
    }


    favoritesList.innerHTML =
        items.map(
            product => {

                const image =
                    getImageUrl(product);


                return `
                    <div class="favorite-item">

                        ${
                            image
                                ? `<img src="${escapeHtml(image)}">`
                                : `<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;">
                                    <i class="fa-solid fa-image"></i>
                                  </div>`
                        }


                        <div class="favorite-item-info">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${formatPrice(product.price)}
                            </span>

                        </div>


                        <button
                            onclick="toggleFavorite('${escapeJs(product.id)}')"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
                `;

            }
        ).join("");

}


// ======================================================
// COMPARE
// ======================================================

window.toggleCompare =
function(id) {

    const index =
        state.comparison.indexOf(id);


    if (index !== -1) {

        state.comparison.splice(
            index,
            1
        );

    } else {

        if (state.comparison.length >= 4) {

            alert(
                "Maksimum 4 ta mahsulot tanlash mumkin."
            );

            return;

        }

        state.comparison.push(id);

    }


    localStorage.setItem(
        "pricecompare_comparison",
        JSON.stringify(state.comparison)
    );


    updateCounts();
    renderProducts();
    updateCompare();

};


compareNavBtn.addEventListener(
    "click",
    () => {

        compareSection.classList.add(
            "active"
        );

        compareSection.scrollIntoView({
            behavior: "smooth"
        });

        updateCompare();

    }
);


compareBackBtn.addEventListener(
    "click",
    () => {

        compareSection.classList.remove(
            "active"
        );

        document
            .getElementById("productsSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


compareGoProducts.addEventListener(
    "click",
    () => {

        compareSection.classList.remove(
            "active"
        );

        document
            .getElementById("productsSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


clearComparison.addEventListener(
    "click",
    () => {

        state.comparison = [];

        localStorage.setItem(
            "pricecompare_comparison",
            "[]"
        );

        updateCounts();
        updateCompare();
        renderProducts();

    }
);


function updateCompare() {

    const products =
        state.comparison
            .map(id =>
                state.products.find(
                    product =>
                        product.id === id
                )
            )
            .filter(Boolean);


    if (products.length < 2) {

        compareEmpty.style.display =
            "block";

        compareTableWrap.style.display =
            "none";

        return;

    }


    compareEmpty.style.display =
        "none";

    compareTableWrap.style.display =
        "block";


    compareTable.innerHTML = `

        <tr>
            <th>${t("name")}</th>
            ${products.map(
                p => `<th>${escapeHtml(p.name)}</th>`
            ).join("")}
        </tr>


        <tr>
            <td>${t("brand")}</td>
            ${products.map(
                p => `<td>${escapeHtml(p.brand || "-")}</td>`
            ).join("")}
        </tr>


        <tr>
            <td>${t("price")}</td>
            ${products.map(
                p => `<td><strong>${formatPrice(p.price)}</strong></td>`
            ).join("")}
        </tr>


        <tr>
            <td>${t("ratingLabel")}</td>
            ${products.map(
                p => `<td>${p.rating || "-"}</td>`
            ).join("")}
        </tr>


        <tr>
            <td>${t("stock")}</td>
            ${products.map(
                p => `<td>${escapeHtml(p.stock || "-")}</td>`
            ).join("")}
        </tr>


        <tr>
            <td>${t("store")}</td>
            ${products.map(
                p => `<td>${escapeHtml(p.store || "-")}</td>`
            ).join("")}
        </tr>

    `;

}


// ======================================================
// STATS
// ======================================================

function updateStats() {

    const products =
        state.filteredProducts.length
            ? state.filteredProducts
            : state.products;


    document.getElementById(
        "count"
    ).textContent =
        products.length;


    const sources =
        new Set(
            state.products.map(
                p => p.source
            )
        );


    document.getElementById(
        "favTotal"
    ).textContent =
        sources.size;


    const prices =
        products
            .map(
                p => Number(p.price || 0)
            )
            .filter(
                p => p > 0
            );


    if (prices.length) {

        const average =
            prices.reduce(
                (a, b) => a + b,
                0
            ) / prices.length;


        document.getElementById(
            "avgPrice"
        ).textContent =
            formatPrice(average);

    } else {

        document.getElementById(
            "avgPrice"
        ).textContent =
            "Narx mavjud emas";

    }

}


function updateCounts() {

    document
        .querySelectorAll("#favCount")
        .forEach(
            element => {

                element.textContent =
                    state.favorites.length;

            }
        );


    document.getElementById(
        "compareCount"
    ).textContent =
        state.comparison.length;

}


// ======================================================
// FILTERS
// ======================================================

sortSelect.addEventListener(
    "change",
    () => {

        renderProducts();
        updateStats();

    }
);


let isSyncingPriceControls = false;


priceRange.addEventListener(
    "input",
    () => {

        if (isSyncingPriceControls) {
            return;
        }

        isSyncingPriceControls = true;

        const max =
            Number(priceRange.max || 2000000);

        const value =
            Math.min(
                Math.max(
                    Number(priceRange.value || 0),
                    0
                ),
                max
            );

        priceRange.value =
            String(value);

        priceInput.value =
            formatPriceValue(value);

        isSyncingPriceControls = false;

        renderProducts();
        updateStats();

    }
);


priceInput.addEventListener(
    "input",
    () => {

        if (isSyncingPriceControls) {
            return;
        }

        const max =
            Number(priceRange.max || 2000000);

        const digits =
            String(priceInput.value)
                .replace(/\D/g, "");

        let value =
            digits ? Number(digits) : 0;

        if (!Number.isFinite(value) || value < 0) {
            value = 0;
        }

        if (max > 0 && value > max) {
            value = max;
        }

        isSyncingPriceControls = true;

        priceRange.value =
            String(value);

        priceInput.value =
            formatPriceValue(value);

        isSyncingPriceControls = false;

        renderProducts();
        updateStats();

    }
);


function formatPriceValue(value) {

    const numericValue =
        Math.max(
            0,
            Math.round(Number(value || 0))
        );

    return new Intl.NumberFormat(
        "ru-RU"
    ).format(numericValue)
        + " "
        + currencySymbols[state.currency];

}


function updatePriceText() {

    const max =
        Number(
            priceRange.max || 2000000
        );

    const value =
        Math.min(
            Math.max(
                Number(priceRange.value || 0),
                0
            ),
            max
        );

    if (Number(priceRange.value) > max) {
        priceRange.value =
            String(max);
    }

    if (priceRange) {
        const percent =
            max > 0
                ? (value / max) * 100
                : 0;

        priceRange.style.setProperty(
            "--value",
            `${Math.min(100, Math.max(0, percent))}%`
        );
    }

    if (priceInput && !isSyncingPriceControls) {
        priceInput.value =
            formatPriceValue(value);
    }

    if (priceDisplay) {
        priceDisplay.textContent =
            "≤";
    }

}


clearFilters.addEventListener(
    "click",
    () => {

        sortSelect.value =
            "cheap";

        if (priceRange.max) {
            priceRange.value =
                priceRange.max;
        }

        if (!priceRange.max || Number(priceRange.max) <= 0) {
            priceRange.max =
                2000000;
            priceRange.value =
                2000000;
        }

        updatePriceText();
        renderProducts();
        updateStats();

    }
);


// ======================================================
// CURRENCY
// ======================================================

currencySelect.addEventListener(
    "change",
    () => {

        state.currency =
            currencySelect.value;

        localStorage.setItem(
            "pricecompare_currency",
            state.currency
        );


        if (state.products.length) {

            const prices =
                state.products
                    .map(p => Number(p.price || 0))
                    .filter(p => p > 0);


            if (prices.length) {

                const max =
                    Math.ceil(
                        Math.max(...prices) /
                        100000
                    ) * 100000;


                priceRange.max =
                    Math.max(
                        convertFromUZS(max),
                        2000000
                    );

                priceRange.value =
                    priceRange.max;

            } else {
                priceRange.max =
                    2000000;
                priceRange.value =
                    2000000;
            }

        } else {
            priceRange.max =
                2000000;
            priceRange.value =
                2000000;
        }


        updatePriceText();
        renderProducts();
        updateStats();
        updateCompare();

    }
);


// ======================================================
// LANGUAGE
// ======================================================

languageSelect.addEventListener(
    "change",
    () => {

        state.language =
            languageSelect.value;

        localStorage.setItem(
            "pricecompare_language",
            state.language
        );

        updateTranslations();

    }
);


// ======================================================
// THEME
// ======================================================

themeBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        themePanel.classList.toggle(
            "active"
        );

    }
);


document
    .querySelectorAll(".theme-option")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const theme =
                        button.dataset.theme;

                    state.theme =
                        theme;

                    document.body.dataset.theme =
                        theme;

                    localStorage.setItem(
                        "pricecompare_theme",
                        theme
                    );

                    themePanel.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


document.addEventListener(
    "click",
    event => {

        if (
            !themePanel.contains(event.target) &&
            event.target !== themeBtn
        ) {

            themePanel.classList.remove(
                "active"
            );

        }

    }
);


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeJs(value) {

    return String(value ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");

}


// ======================================================
// AUTO UPDATE
// ======================================================

updatePriceText();
updateCounts();