// ============================================================
// PRICECOMPARE
// FRONTEND
// Uzum Market + Yandex Market
// ============================================================

"use strict";


// ============================================================
// STATE
// ============================================================

const currentCurrency = "UZS";
const SHOW_HOMEPAGE_CURRENCY_KEY =
    "pricecompare_show_homepage_currency";

const state = {
    products: [],
    filteredProducts: [],

    favorites: JSON.parse(
        localStorage.getItem("pricecompare_favorites") || "[]"
    ),

    comparison: [],

    language:
        localStorage.getItem("pricecompare_language") || "uz",

    currency:
        localStorage.getItem("pricecompare_currency") || currentCurrency,

    theme:
        localStorage.getItem("pricecompare_theme") || "light",

    showThemeWidget:
        localStorage.getItem(
            "pricecompare_show_theme_widget"
        ) === "1",

    showHomepageCurrency:
        localStorage.getItem(
            SHOW_HOMEPAGE_CURRENCY_KEY
        ) === "true"

};

const storedComparison = JSON.parse(
    localStorage.getItem("pricecompare_comparison") || "[]"
);
state.comparison = Array.isArray(storedComparison)
    ? storedComparison.filter(product => product && typeof product === "object")
    : [];

localStorage.setItem(
    "pricecompare_comparison",
    JSON.stringify(state.comparison)
);


// ============================================================
// DOM ELEMENTS
// ============================================================

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

const mainCurrencyControl =
    document.getElementById("mainCurrencyControl");

const mainCurrencySelect =
    document.getElementById("mainCurrencySelect");

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


// ============================================================
// SETTINGS DOM
// ============================================================

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettingsModal =
    document.getElementById("closeSettingsModal");

const openAllThemesBtn =
    document.getElementById("openAllThemesBtn");

const settingsLanguageOptions =
    document.getElementById("settingsLanguageOptions");

const settingsThemeOptions =
    document.getElementById("settingsThemeOptions");


// ============================================================
// MAIN PAGE CONTROLS
// ============================================================

const mainThemeControl =
    document.getElementById("mainThemeControl");

const mainThemeBtn =
    document.getElementById("mainThemeBtn");

const mainThemeDropdown =
    document.getElementById("mainThemeDropdown");

const toggleThemeWidget =
    document.getElementById("toggleThemeWidget");

const toggleHomepageCurrency =
    document.getElementById("toggleHomepageCurrency");

const settingsCurrencyOptions =
    document.getElementById("settingsCurrencyOptions");


// ============================================================
const uzsSymbol = "so'm";

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

const currencyNames = {
    uz: { UZS: "UZS — o'zbek so'mi", USD: "USD — AQSH dollari", EUR: "EUR — Yevro", RUB: "RUB — Rossiya rubli", JPY: "JPY — Yaponiya iyenasi" },
    ru: { UZS: "UZS — узбекский сум", USD: "USD — доллар США", EUR: "EUR — евро", RUB: "RUB — российский рубль", JPY: "JPY — японская иена" },
    en: { UZS: "UZS — Uzbek so'm", USD: "USD — US Dollar", EUR: "EUR — Euro", RUB: "RUB — Russian Ruble", JPY: "JPY — Japanese Yen" }
};


// ============================================================
// THEMES
// ============================================================

const themeList = [
    {
        id: "light",
        icon: "fa-sun"
    },

    {
        id: "dark",
        icon: "fa-moon"
    },

    {
        id: "blue",
        icon: "fa-water"
    },

    {
        id: "purple",
        icon: "fa-gem"
    },

    {
        id: "cyber",
        icon: "fa-microchip"
    },

    {
        id: "aurora",
        icon: "fa-wind"
    },

    {
        id: "galaxy",
        icon: "fa-meteor"
    },

    {
        id: "matrix",
        icon: "fa-code"
    },

    {
        id: "black",
        icon: "fa-circle"
    },

    {
        id: "sunset",
        icon: "fa-cloud-sun"
    }
];


const themePreviewColors = {
    light: [
        "#f4f7fb",
        "#2563eb",
        "#ffffff"
    ],

    dark: [
        "#0f172a",
        "#2563eb",
        "#172033"
    ],

    blue: [
        "#0b1220",
        "#3b82f6",
        "#101a2e"
    ],

    purple: [
        "#140f22",
        "#9333ea",
        "#1c1533"
    ],

    cyber: [
        "#05070a",
        "#00e6a8",
        "#0b1015"
    ],

    aurora: [
        "#061019",
        "#22d3ee",
        "#0c1c2b"
    ],

    galaxy: [
        "#0a0714",
        "#a855f7",
        "#150f28"
    ],

    matrix: [
        "#000200",
        "#22ff66",
        "#030b03"
    ],

    black: [
        "#000000",
        "#2563eb",
        "#0d0d0d"
    ],

    sunset: [
        "#1c0f14",
        "#f97316",
        "#2a161c"
    ]
};


// ============================================================
// TRANSLATIONS
// ============================================================

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
            "Do'kon",

        priceUnavailable:
            "Narx mavjud emas",

        settings:
            "Sozlamalar",

        language:
            "Til",

        currency:
            "Valyuta",

        themes:
            "Mavzular",

        allThemes:
            "10 ta mavzu",

        save:
            "Saqlash",

        close:
            "Yopish",

        selected:
            "Tanlangan",

        active:
            "Faol",

        themeUpdated:
            "Mavzu yangilandi",

        mainPageControls:
            "Bosh sahifa boshqaruvi",

        showThemeWidget:
            "Bosh sahifada mavzularni ko'rsatish",

        showHomepageCurrency:
            "Bosh sahifada valyuta boshqaruvini ko'rsatish",

        ratingUnavailable:
            "Reyting mavjud emas",

        available:
            "Mavjud",

        apiError:
            "Ma'lumot olishda xatolik yuz berdi",

        apiUnavailable:
            "Ma'lumot manbasi vaqtincha ishlamayapti.",

        quotaExceeded:
            "Ma'lumot manbasi limiti tugagan. Keyinroq qayta urinib ko'ring.",

        maximumCompare:
            "Maksimum 4 ta mahsulot tanlash mumkin."
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
            "Магазин",

        priceUnavailable:
            "Цена недоступна",

        settings:
            "Настройки",

        language:
            "Язык",

        currency:
            "Валюта",

        themes:
            "Темы",

        allThemes:
            "10 тем",

        save:
            "Сохранить",

        close:
            "Закрыть",

        selected:
            "Выбрано",

        active:
            "Активна",

        themeUpdated:
            "Тема обновлена",

        mainPageControls:
            "Управление главной страницей",

        showThemeWidget:
            "Показать темы на главной странице",

        showHomepageCurrency:
            "Показать управление валютой на главной странице",

        ratingUnavailable:
            "Рейтинг недоступен",

        available:
            "В наличии",

        apiError:
            "Произошла ошибка при получении данных",

        apiUnavailable:
            "Источник данных временно недоступен.",

        quotaExceeded:
            "Лимит источника данных исчерпан. Попробуйте позже.",

        maximumCompare:
            "Можно выбрать максимум 4 товара."
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
            "Store",

        priceUnavailable:
            "Price unavailable",

        settings:
            "Settings",

        language:
            "Language",

        currency:
            "Currency",

        themes:
            "Themes",

        allThemes:
            "10 Themes",

        save:
            "Save",

        close:
            "Close",

        selected:
            "Selected",

        active:
            "Active",

        themeUpdated:
            "Theme updated",

        mainPageControls:
            "Main Page Controls",

        showThemeWidget:
            "Show Themes on Main Page",

        showHomepageCurrency:
            "Show currency controls on the main page",

        ratingUnavailable:
            "Rating unavailable",

        available:
            "Available",

        apiError:
            "An error occurred while getting data",

        apiUnavailable:
            "The data source is temporarily unavailable.",

        quotaExceeded:
            "The data source limit has been reached. Try again later.",

        maximumCompare:
            "You can select a maximum of 4 products."
    }
};


// ============================================================
// TRANSLATION FUNCTION
// ============================================================

function t(key) {

    return (
        translations[state.language]?.[key] ||
        translations.uz[key] ||
        key
    );
}

const languageNames = {
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English"
};


// ============================================================
// INIT
// ============================================================

function init() {

    document.body.dataset.theme =
        state.theme;

    if (languageSelect) {
        languageSelect.value =
            state.language;
    }

    state.products = [];
    state.filteredProducts = [];

    updateTranslations();

    updateCounts();

    updateStats();

    updateCompare();

    renderSettingsPanel();

    syncQuickThemePanelActiveState();

    renderMainThemeDropdown();

    applyMainControlsVisibility();

    resetPriceControls();
}


init();


// ============================================================
// UPDATE TRANSLATIONS
// ============================================================

function updateTranslations() {

    const setText = (id, key) => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                t(key);
        }
    };


    setText(
        "heroTitle",
        "heroTitle"
    );

    setText(
        "heroText",
        "heroText"
    );

    setText(
        "clearText",
        "clear"
    );

    setText(
        "productsText",
        "products"
    );

    setText(
        "sourcesText",
        "sources"
    );

    setText(
        "averageText",
        "average"
    );

    setText(
        "favoritesText",
        "favorites"
    );

    setText(
        "compareTitle",
        "compareTitle"
    );

    setText(
        "compareSubtitle",
        "compareSubtitle"
    );

    setText(
        "compareBackText",
        "back"
    );

    setText(
        "clearCompareText",
        "clearCompare"
    );

    setText(
        "compareEmptyTitle",
        "emptyCompare"
    );

    setText(
        "compareEmptyText",
        "emptyCompareText"
    );

    setText(
        "compareGoProductsText",
        "showProducts"
    );

    setText(
        "favoritesTitle",
        "favoritesTitle"
    );


    if (searchInput) {
        searchInput.placeholder =
            t("search");
    }


    if (searchButton) {
        searchButton.innerHTML =
            `<i class="fa-solid fa-search"></i> ${t("searchButton")}`;
    }


    setText(
        "allThemesText",
        "allThemes"
    );

    setText(
        "settingsTitle",
        "settings"
    );

    setText(
        "settingsLanguageLabel",
        "language"
    );

    setText(
        "settingsCurrencyLabel",
        "currency"
    );

    setText(
        "settingsThemeLabel",
        "themes"
    );

    setText(
        "settingsMainControlsLabel",
        "mainPageControls"
    );

    setText(
        "toggleThemeWidgetText",
        "showThemeWidget"
    );

    setText(
        "toggleHomepageCurrencyText",
        "showHomepageCurrency"
    );

    // Select labels
    updateSortOptions();


    if (state.products.length) {
        renderProducts();
    }


    renderSettingsPanel();

    renderMainThemeDropdown();

    updatePriceText();
}


// ============================================================
// SORT OPTIONS
// ============================================================

function updateSortOptions() {

    if (!sortSelect) {
        return;
    }

    const current =
        sortSelect.value || "cheap";

    sortSelect.innerHTML = `
        <option value="cheap">
            ${t("cheap")}
        </option>

        <option value="expensive">
            ${t("expensive")}
        </option>

        <option value="rating">
            ${t("rating")}
        </option>
    `;

    sortSelect.value =
        current;
}


// ============================================================
// SEARCH EVENTS
// ============================================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchProducts
    );
}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                searchProducts();
            }

        }
    );
}


// ============================================================
// NORMALIZE SEARCH
// ============================================================

function normalizeSearchText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(
            /[^a-z0-9\u0400-\u04ff\u00c0-\u024f\s]/gi,
            " "
        )
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// PRODUCT MATCH
// ============================================================

function productMatchesQuery(product, query) {

    const normalizedQuery =
        normalizeSearchText(query);

    if (!normalizedQuery) {
        return true;
    }


    const searchText =
        normalizeSearchText([
            product?.name,
            product?.title,
            product?.brand,
            product?.category,
            product?.description,
            product?.model
        ]
            .filter(Boolean)
            .join(" "));


    if (!searchText) {
        return false;
    }


    const words =
        normalizedQuery
            .split(" ")
            .filter(word => word.length >= 2);


    if (!words.length) {
        return true;
    }


    if (words.length === 1) {
        return searchText.includes(words[0]);
    }


    const matched =
        words.filter(word =>
            searchText.includes(word)
        );


    return (
        matched.length >=
        Math.ceil(words.length / 2)
    );
}


// ============================================================
// SEARCH PRODUCTS
// ============================================================

async function searchProducts() {

    const query =
        searchInput?.value.trim() || "";


    if (!query) {

        state.products = [];

        state.filteredProducts = [];

        productsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>${t("searchFirst")}</p>
            </div>
        `;

        updateStats();

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
                `/api/search?q=${encodeURIComponent(query)}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        let data;

        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        if (!response.ok) {

            const error =
                data?.error || "";

            if (
                error ===
                "API_QUOTA_EXCEEDED"
            ) {

                const err =
                    new Error(
                        data?.message ||
                        t("quotaExceeded")
                    );

                err.code =
                    "API_QUOTA_EXCEEDED";

                throw err;
            }


            if (
                error ===
                "API_UNAVAILABLE"
            ) {

                const err =
                    new Error(
                        data?.message ||
                        t("apiUnavailable")
                    );

                err.code =
                    "API_UNAVAILABLE";

                throw err;
            }


            throw new Error(
                data?.message ||
                `HTTP ${response.status}`
            );
        }


        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                data?.message ||
                data?.error ||
                "API error"
            );
        }


        const apiProducts =
            Array.isArray(data.products)
                ? data.products
                : [];


        // ================================================
        // NORMALIZE PRODUCTS
        // ================================================

        state.products =
            apiProducts
                .filter(product =>
                    product &&
                    (
                        product.id ||
                        product.name ||
                        product.title
                    )
                )
                .map(normalizeProduct);


        state.filteredProducts =
            [...state.products];


        // ================================================
        // RESET PRICE FILTER TO API MAX
        // ================================================

        setPriceRangeFromProducts();


        // ================================================
        // RENDER
        // ================================================

        renderProducts();

        updateStats();

        updateCompare();

        renderFavorites();


    } catch (error) {

        console.error(
            "PRICECOMPARE SEARCH ERROR:",
            error
        );


        state.products = [];

        state.filteredProducts = [];


        let message =
            t("apiError");


        if (
            error?.code ===
            "API_QUOTA_EXCEEDED"
        ) {

            message =
                t("quotaExceeded");

        } else if (
            error?.code ===
            "API_UNAVAILABLE"
        ) {

            message =
                t("apiUnavailable");

        } else if (
            error instanceof TypeError
        ) {

            message =
                t("apiUnavailable");
        }


        productsContainer.innerHTML = `
            <div class="error-message">
                <i class="fa-solid fa-circle-exclamation"></i>

                <p>
                    ${escapeHtml(message)}
                </p>

                ${
                    error?.message
                        ? `
                            <small>
                                ${escapeHtml(
                                    error.message
                                )}
                            </small>
                        `
                        : ""
                }
            </div>
        `;


        updateStats();

    }
}


// ============================================================
// NORMALIZE PRODUCT
// ============================================================

function normalizeProduct(product) {

    const id =
        product?.id ??
        product?.productId ??
        product?.sku ??
        (
            String(
                product?.name ||
                product?.title ||
                Math.random()
            )
            + "-"
            + Math.random()
        );


    let source =
        String(
            product?.source ||
            product?.store ||
            ""
        ).toLowerCase();


    if (
        source.includes("uzum")
    ) {
        source = "uzum";

    } else if (
        source.includes("yandex")
    ) {
        source = "yandex";
    }


    const price =
        Number(product?.price);


    return {
        ...product,

        id: String(id),

        name:
            String(
                product?.name ||
                product?.title ||
                "Unknown product"
            ),

        price:
            Number.isFinite(price) &&
            price > 0
                ? price
                : null,

        rating:
            Number.isFinite(
                Number(product?.rating)
            )
                ? Number(product.rating)
                : 0,

        brand:
            product?.brand ||
            "",

        category:
            product?.category ||
            "",

        stock:
            product?.stock ||
            "",

        store:
            product?.store ||
            (
                source === "uzum"
                    ? "Uzum Market"
                    : source === "yandex"
                        ? "Yandex Market"
                        : ""
            ),

        source,

        productUrl:
            product?.productUrl ||
            null,

        url:
            product?.url ||
            null
    };
}


// ============================================================
// IMAGE URL
// ============================================================

function getImageUrl(product) {

    if (!product?.image) {
        return "";
    }


    if (
        typeof product.image ===
        "string"
    ) {

        return product.image;
    }


    if (
        product.image.link
    ) {

        if (
            typeof product.image.link ===
            "string"
        ) {
            return product.image.link;
        }


        return (
            product.image.link.high ||
            product.image.link.low ||
            ""
        );
    }


    if (
        product.image.url
    ) {

        return product.image.url;
    }


    return "";
}


// ============================================================
// ============================================================
// FORMAT PRICE
// ============================================================

function formatPrice(uzs) {

    const number =
        Number(uzs);


    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {

        return t("priceUnavailable");
    }


    const value = convertFromUZS(number);
    const decimals = state.currency === "UZS" || state.currency === "JPY" ? 0 : 2;

    return (
        new Intl.NumberFormat(
            "ru-RU",
            {
                maximumFractionDigits: decimals
            }
        ).format(value)
        +
        " "
        +
        currencySymbols[state.currency] || uzsSymbol
    );
}

function convertFromUZS(uzs) {
    const value = Number(uzs);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return value * (currencyRates[state.currency] || 1);
}


// ============================================================
// PRODUCT URL VALIDATION
// ============================================================

function isValidProductUrl(url) {

    if (
        !url ||
        typeof url !== "string"
    ) {
        return false;
    }


    const value =
        url.trim();


    if (!value) {
        return false;
    }


    if (
        value === "#" ||
        value === "null" ||
        value === "undefined"
    ) {
        return false;
    }


    if (
        value.toLowerCase()
            .startsWith("javascript:")
    ) {
        return false;
    }


    try {

        const parsed =
            new URL(value);


        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {

        return false;
    }
}


// ============================================================
// PRODUCT URL
// ============================================================

function getProductUrl(product) {

    const candidates = [

        product?.productUrl,

        product?.url,

        product?.link,

        product?.href
    ];


    for (
        const candidate of candidates
    ) {

        if (
            isValidProductUrl(candidate)
        ) {

            return candidate.trim();
        }
    }


    const name =
        String(
            product?.name ||
            product?.title ||
            "product"
        ).trim();


    const query =
        encodeURIComponent(name);


    const source =
        String(
            product?.source ||
            product?.store ||
            ""
        ).toLowerCase();


    if (
        source.includes("uzum")
    ) {

        return (
            "https://uzum.uz/ru/search?query=" +
            query
        );
    }


    if (
        source.includes("yandex")
    ) {

        return (
            "https://market.yandex.uz/search?text=" +
            query
        );
    }


    return (
        "https://www.google.com/search?q=" +
        query
    );
}


// ============================================================
// SOURCE NAME
// ============================================================

function getSourceName(product) {

    const source =
        String(
            product?.source ||
            product?.store ||
            ""
        ).toLowerCase();


    if (
        source.includes("uzum")
    ) {
        return "Uzum Market";
    }


    if (
        source.includes("yandex")
    ) {
        return "Yandex Market";
    }


    return (
        product?.store ||
        "Market"
    );
}


// ============================================================
// PRODUCT CARD
// ============================================================

function productCard(product) {

    const image =
        getImageUrl(product);


    const id =
        String(product.id);


    const favorite =
        state.favorites.includes(id);


    const compared =
        state.comparison.some(
            selected => String(selected.id) === id
        );


    const rating =
        Number(product.rating || 0);


    let stars = "☆";


    if (rating > 0) {

        const rounded =
            Math.max(
                1,
                Math.min(
                    5,
                    Math.round(rating)
                )
            );


        stars =
            "★".repeat(rounded) +
            "☆".repeat(5 - rounded);
    }


    const url =
        getProductUrl(product);


    return `
        <article
            class="product-card"
            data-id="${escapeHtml(id)}"
        >

            <div
                class="product-image ${
                    image ? "" : "no-image"
                }"
            >

                ${
                    image
                        ? `
                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(
                                    product.name
                                )}"
                                loading="lazy"
                                onerror="
                                    this.parentElement.classList.add('no-image');
                                    this.remove();
                                "
                            >
                        `
                        : `
                            <i
                                class="fa-solid fa-image"
                            ></i>
                        `
                }


                <button
                    type="button"
                    class="favorite-btn ${
                        favorite
                            ? "active"
                            : ""
                    }"
                    onclick="toggleFavorite('${escapeJs(id)}')"
                    title="${t("favorites")}"
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
                    ${escapeHtml(
                        getSourceName(product)
                    )}
                </span>


                <h3 class="product-name">
                    ${escapeHtml(
                        product.name
                    )}
                </h3>


                <div class="product-price">
                    ${formatPrice(
                        product.price
                    )}
                </div>


                <div class="product-rating">

                    ${
                        rating > 0
                            ? `
                                ${stars}
                                ${rating}/5
                            `
                            : `
                                ${t(
                                    "ratingUnavailable"
                                )}
                            `
                    }

                </div>


                <div class="product-meta">
                    ${
                        escapeHtml(
                            product.stock ||
                            t("available")
                        )
                    }
                </div>


                <div class="product-actions">

                    <a
                        href="${escapeHtml(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <i
                            class="fa-solid fa-arrow-up-right-from-square"
                        ></i>

                        ${t("view")}

                    </a>


                    <button
                        type="button"
                        class="compare-btn"
                        onclick="toggleCompare('${escapeJs(id)}')"
                    >

                        <i
                            class="fa-solid fa-code-compare"
                        ></i>

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


// ============================================================
// RENDER PRODUCTS
// ============================================================

function renderProducts() {

    let products =
        [...state.products];


    // ================================================
    // PRICE FILTER
    // ================================================

    const maxPrice =
        Number(
            priceRange?.value ||
            Infinity
        );


    products =
        products.filter(product => {

            const price =
                Number(product?.price);


            if (
                !Number.isFinite(price) ||
                price <= 0
            ) {
                return false;
            }


            return convertFromUZS(price) <= maxPrice;
        });


    // ================================================
    // SORT
    // ================================================

    const sort =
        sortSelect?.value ||
        "cheap";


    if (sort === "cheap") {

        products.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );
    }


    if (sort === "expensive") {

        products.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );
    }


    if (sort === "rating") {

        products.sort(
            (a, b) =>
                Number(b.rating || 0) -
                Number(a.rating || 0)
        );
    }


    state.filteredProducts =
        products;


    // ================================================
    // EMPTY
    // ================================================

    if (!products.length) {

        productsContainer.innerHTML = `
            <div class="empty-message">

                <i
                    class="fa-solid fa-box-open"
                ></i>

                <p>
                    ${t("noProducts")}
                </p>

            </div>
        `;

        updateStats();

        return;
    }


    // ================================================
    // RENDER
    // ================================================

    productsContainer.innerHTML =
        products
            .map(productCard)
            .join("");


    updateStats();
}


// ============================================================
// FAVORITES
// ============================================================

window.toggleFavorite =
function(id) {

    id =
        String(id);


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
        JSON.stringify(
            state.favorites
        )
    );


    updateCounts();

    renderProducts();

    renderFavorites();
};


// ============================================================
// FAVORITES MODAL
// ============================================================

if (favoritesBtn) {

    favoritesBtn.addEventListener(
        "click",
        () => {

            renderFavorites();

            favoritesModal?.classList.add(
                "active"
            );
        }
    );
}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            favoritesModal?.classList.remove(
                "active"
            );
        }
    );
}


if (favoritesModal) {

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
}


// ============================================================
// RENDER FAVORITES
// ============================================================

function renderFavorites() {

    if (!favoritesList) {
        return;
    }


    const items =
        state.products.filter(
            product =>
                state.favorites.includes(
                    String(product.id)
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
        items
            .map(product => {

                const image =
                    getImageUrl(product);


                return `
                    <div
                        class="favorite-item"
                    >

                        ${
                            image
                                ? `
                                    <img
                                        src="${escapeHtml(
                                            image
                                        )}"
                                        alt="${escapeHtml(
                                            product.name
                                        )}"
                                    >
                                `
                                : `
                                    <div
                                        style="
                                            width:70px;
                                            height:70px;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                        "
                                    >
                                        <i
                                            class="fa-solid fa-image"
                                        ></i>
                                    </div>
                                `
                        }


                        <div
                            class="favorite-item-info"
                        >

                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>

                            <span>
                                ${formatPrice(
                                    product.price
                                )}
                            </span>

                        </div>


                        <button
                            type="button"
                            onclick="toggleFavorite('${escapeJs(
                                product.id
                            )}')"
                            title="${t("remove")}"
                        >

                            <i
                                class="fa-solid fa-trash"
                            ></i>

                        </button>

                    </div>
                `;
            })
            .join("");
}


// ============================================================
// COMPARE
// ============================================================

window.toggleCompare =
function(id) {

    id =
        String(id);


    const index =
        state.comparison.findIndex(
            product => String(product.id) === id
        );


    if (index !== -1) {

        state.comparison.splice(index, 1);

    } else {

        if (
            state.comparison.length >= 4
        ) {

            alert(
                t("maximumCompare")
            );

            return;
        }


        const product = state.products.find(
            item => String(item.id) === id
        );

        if (!product) {
            return;
        }

        state.comparison.push(product);
    }


    localStorage.setItem(
        "pricecompare_comparison",
        JSON.stringify(
            state.comparison
        )
    );


    updateCounts();

    renderProducts();

    updateCompare();
};


// ============================================================
// COMPARE NAV
// ============================================================

if (compareNavBtn) {

    compareNavBtn.addEventListener(
        "click",
        () => {

            compareSection?.classList.add(
                "active"
            );


            compareSection?.scrollIntoView({
                behavior: "smooth"
            });


            updateCompare();
        }
    );
}


if (compareBackBtn) {

    compareBackBtn.addEventListener(
        "click",
        () => {

            compareSection?.classList.remove(
                "active"
            );


            document
                .getElementById(
                    "productsSection"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }
    );
}


if (compareGoProducts) {

    compareGoProducts.addEventListener(
        "click",
        () => {

            compareSection?.classList.remove(
                "active"
            );


            document
                .getElementById(
                    "productsSection"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }
    );
}


// ============================================================
// CLEAR COMPARE
// ============================================================

if (clearComparison) {

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
}


// ============================================================
// UPDATE COMPARE
// ============================================================

function updateCompare() {

    if (
        !compareEmpty ||
        !compareTableWrap ||
        !compareTable
    ) {
        return;
    }


    const products = state.comparison;


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

            <th>
                ${t("name")}
            </th>

            ${
                products
                    .map(
                        product =>
                            `
                            <th>
                                ${escapeHtml(
                                    product.name
                                )}
                            </th>
                            `
                    )
                    .join("")
            }

        </tr>


        <tr>

            <td>
                ${t("brand")}
            </td>

            ${
                products
                    .map(
                        product =>
                            `
                            <td>
                                ${escapeHtml(
                                    product.brand ||
                                    "-"
                                )}
                            </td>
                            `
                    )
                    .join("")
            }

        </tr>


        <tr>

            <td>
                ${t("price")}
            </td>

            ${
                products
                    .map(
                        product =>
                            `
                            <td>
                                <strong>
                                    ${formatPrice(
                                        product.price
                                    )}
                                </strong>
                            </td>
                            `
                    )
                    .join("")
            }

        </tr>


        <tr>

            <td>
                ${t("ratingLabel")}
            </td>

            ${
                products
                    .map(
                        product =>
                            `
                            <td>
                                ${
                                    product.rating
                                        ? product.rating
                                        : "-"
                                }
                            </td>
                            `
                    )
                    .join("")
            }

        </tr>


        <tr>

            <td>
                ${t("stock")}
            </td>

            ${
                products
                    .map(
                        product =>
                            `
                            <td>
                                ${escapeHtml(
                                    product.stock ||
                                    "-"
                                )}
                            </td>
                            `
                    )
                    .join("")
            }

        </tr>


        <tr>

            <td>
                ${t("store")}
            </td>

            ${
                products
                    .map(
                        product =>
                            `
                            <td>
                                ${escapeHtml(
                                    getSourceName(
                                        product
                                    )
                                )}
                            </td>
                            `
                    )
                    .join("")
            }

        </tr>
    `;
}


// ============================================================
// STATS
// ============================================================

function updateStats() {

    const products =
        state.filteredProducts || [];


    const countElement =
        document.getElementById("count");


    const sourcesElement =
        document.getElementById("favTotal");


    const averageElement =
        document.getElementById("avgPrice");


    if (countElement) {

        countElement.textContent =
            products.length;
    }


    const sources =
        new Set(
            products
                .map(
                    product =>
                        product?.source
                )
                .filter(Boolean)
        );


    if (sourcesElement) {

        sourcesElement.textContent =
            sources.size;
    }


    const prices =
        products
            .map(
                product =>
                    Number(product?.price)
            )
            .filter(
                price =>
                    Number.isFinite(price) &&
                    price > 0
            );


    if (!averageElement) {
        return;
    }


    if (!prices.length) {

        averageElement.textContent =
            t("priceUnavailable");

        return;
    }


    const average =
        prices.reduce(
            (sum, price) =>
                sum + price,
            0
        ) /
        prices.length;


    averageElement.textContent =
        formatPrice(average);
}


// ============================================================
// COUNTS
// ============================================================

function updateCounts() {

    document
        .querySelectorAll(
            "#favCount"
        )
        .forEach(element => {

            element.textContent =
                state.favorites.length;
        });


    const compareCount =
        document.getElementById(
            "compareCount"
        );


    if (compareCount) {

        compareCount.textContent =
            state.comparison.length;
    }
}


// ============================================================
// SORT
// ============================================================

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            renderProducts();

            updateStats();
        }
    );
}


// ============================================================
// PRICE CONTROLS
// ============================================================

let isSyncingPriceControls =
    false;


// ============================================================
// FORMAT PRICE INPUT
// ============================================================

function formatPriceValue(value) {

    const numericValue =
        Math.max(
            0,
            Math.round(
                Number(value || 0)
            )
        );


    return (
        new Intl.NumberFormat("ru-RU").format(numericValue)
        +
        " "
        + (currencySymbols[state.currency] || uzsSymbol)
    );
}


// ============================================================
// UPDATE PRICE TEXT
// ============================================================

function updatePriceText() {

    if (!priceRange) {
        return;
    }


    const max =
        Number(
            priceRange.max ||
            2000000
        );


    let value =
        Number(
            priceRange.value ||
            max
        );


    if (
        !Number.isFinite(value) ||
        value < 0
    ) {
        value = max;
    }


    value =
        Math.min(
            value,
            max
        );


    priceRange.value =
        String(value);


    if (priceInput) {

        priceInput.value =
            formatPriceValue(value);
    }


    if (priceDisplay) {

        priceDisplay.textContent =
            "≤";
    }


    const percent =
        max > 0
            ? (
                value /
                max
            ) * 100
            : 100;


    priceRange.style.setProperty(
        "--value",
        `${Math.min(
            100,
            Math.max(
                0,
                percent
            )
        )}%`
    );
}


// ============================================================
// RESET PRICE CONTROLS
// ============================================================

function resetPriceControls() {

    if (!priceRange) {
        return;
    }


    priceRange.max =
        "2000000";

    priceRange.value =
        "2000000";


    updatePriceText();
}


// ============================================================
// SET PRICE RANGE FROM PRODUCTS
// ============================================================

function setPriceRangeFromProducts() {

    if (!priceRange) {
        return;
    }


    const prices =
        state.products
            .map(
                product =>
                    Number(product?.price)
            )
            .filter(
                price =>
                    Number.isFinite(price) &&
                    price > 0
            );


    if (!prices.length) {

        resetPriceControls();

        return;
    }


    const maxUZS =
        Math.ceil(
            Math.max(
                ...prices
            ) / 100000
        ) * 100000;


    const finalMax =
        Math.max(
            Math.ceil(
                convertFromUZS(maxUZS)
            ),
            1
        );


    priceRange.max =
        String(finalMax);


    priceRange.value =
        String(finalMax);


    updatePriceText();
}


// ============================================================
// PRICE RANGE INPUT
// ============================================================

if (priceRange) {

    priceRange.addEventListener(
        "input",
        () => {

            if (
                isSyncingPriceControls
            ) {
                return;
            }


            const max =
                Number(
                    priceRange.max ||
                    2000000
                );


            let value =
                Number(
                    priceRange.value
                );


            if (
                !Number.isFinite(value)
            ) {
                value = max;
            }


            value =
                Math.max(
                    0,
                    Math.min(
                        value,
                        max
                    )
                );


            isSyncingPriceControls =
                true;


            priceRange.value =
                String(value);


            if (priceInput) {

                priceInput.value =
                    formatPriceValue(
                        value
                    );
            }


            isSyncingPriceControls =
                false;


            renderProducts();

            updateStats();
        }
    );
}


// ============================================================
// PRICE INPUT
// ============================================================

if (priceInput) {

    priceInput.addEventListener(
        "input",
        () => {

            if (
                isSyncingPriceControls
            ) {
                return;
            }


            const max =
                Number(
                    priceRange?.max ||
                    2000000
                );


            const digits =
                String(
                    priceInput.value
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            let value =
                digits
                    ? Number(digits)
                    : 0;


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {
                value = 0;
            }


            value =
                Math.min(
                    value,
                    max
                );


            isSyncingPriceControls =
                true;


            if (priceRange) {

                priceRange.value =
                    String(value);
            }


            priceInput.value =
                formatPriceValue(
                    value
                );


            isSyncingPriceControls =
                false;


            renderProducts();

            updateStats();
        }
    );
}


// ============================================================
// CLEAR FILTERS
// ============================================================

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        () => {

            if (sortSelect) {

                sortSelect.value =
                    "cheap";
            }


            if (state.products.length) {

                setPriceRangeFromProducts();

            } else {

                resetPriceControls();
            }


            renderProducts();

            updateStats();
        }
    );
}


// ============================================================
// CURRENCY CHANGE
// ============================================================

function applyCurrencyChange() {
    if (state.products.length) {
        setPriceRangeFromProducts();
    } else {
        resetPriceControls();
    }

    renderProducts();
    updateStats();
    updateCompare();
}

if (mainCurrencySelect) {
    mainCurrencySelect.value = state.currency;
    mainCurrencySelect.addEventListener("change", () => {
        state.currency = mainCurrencySelect.value;
        localStorage.setItem("pricecompare_currency", state.currency);
        applyCurrencyChange();
        renderSettingsPanel();
    });
}

// ============================================================
// LANGUAGE
// ============================================================

if (languageSelect) {

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
}


// ============================================================
// THEME BUTTON
// ============================================================

if (
    themeBtn &&
    themePanel
) {

    themeBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            themePanel.classList.toggle(
                "active"
            );
        }
    );
}


// ============================================================
// APPLY THEME
// ============================================================

function applyTheme(theme) {

    const exists =
        themeList.some(
            item =>
                item.id === theme
        );


    if (!exists) {
        theme = "light";
    }


    state.theme =
        theme;


    document.body.dataset.theme =
        theme;


    localStorage.setItem(
        "pricecompare_theme",
        theme
    );


    syncQuickThemePanelActiveState();

    renderSettingsPanel();

    renderMainThemeDropdown();
}


// ============================================================
// QUICK THEME BUTTONS
// ============================================================

function bindQuickThemeButtons() {

    document
        .querySelectorAll(
            ".theme-option[data-theme]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    applyTheme(
                        button.dataset.theme
                    );


                    themePanel?.classList.remove(
                        "active"
                    );
                }
            );
        });
}


bindQuickThemeButtons();


// ============================================================
// SYNC THEME
// ============================================================

function syncQuickThemePanelActiveState() {

    document
        .querySelectorAll(
            ".theme-option[data-theme]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme ===
                    state.theme
            );
        });
}


// ============================================================
// CLOSE THEME PANEL
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            themePanel &&
            !themePanel.contains(
                event.target
            ) &&
            event.target !== themeBtn
        ) {

            themePanel.classList.remove(
                "active"
            );
        }
    }
);


// ============================================================
// SETTINGS MODAL
// ============================================================

if (
    settingsBtn &&
    settingsModal
) {

    settingsBtn.addEventListener(
        "click",
        () => {

            renderSettingsPanel();

            settingsModal.classList.add(
                "active"
            );
        }
    );
}


if (
    closeSettingsModal &&
    settingsModal
) {

    closeSettingsModal.addEventListener(
        "click",
        () => {

            settingsModal.classList.remove(
                "active"
            );
        }
    );
}


if (settingsModal) {

    settingsModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                settingsModal
            ) {

                settingsModal.classList.remove(
                    "active"
                );
            }
        }
    );
}


// ============================================================
// OPEN ALL THEMES
// ============================================================

if (openAllThemesBtn) {

    openAllThemesBtn.addEventListener(
        "click",
        () => {

            themePanel?.classList.remove(
                "active"
            );


            renderSettingsPanel();


            settingsModal?.classList.add(
                "active"
            );


            const themeSection =
                settingsThemeOptions?.closest(
                    ".settings-section"
                );


            if (themeSection) {

                themeSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    );
}


// ============================================================
// SETTINGS PANEL
// ============================================================

function renderSettingsPanel() {

    // ========================================================
    // LANGUAGE
    // ========================================================

    if (
        settingsLanguageOptions
    ) {

        settingsLanguageOptions.innerHTML =
            Object.keys(
                languageNames
            )
                .map(
                    code => `
                        <button
                            type="button"
                            class="settings-option ${
                                code ===
                                state.language
                                    ? "active"
                                    : ""
                            }"
                            data-lang="${code}"
                        >

                            <span>
                                ${languageNames[code]}
                            </span>

                            <i
                                class="fa-solid fa-check check-icon"
                            ></i>

                        </button>
                    `
                )
                .join("");


        settingsLanguageOptions
            .querySelectorAll(
                "[data-lang]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        state.language =
                            button.dataset.lang;


                        if (
                            languageSelect
                        ) {

                            languageSelect.value =
                                state.language;
                        }


                        localStorage.setItem(
                            "pricecompare_language",
                            state.language
                        );


                        updateTranslations();
                    }
                );
            });
    }


    if (settingsCurrencyOptions) {
        const names = currencyNames[state.language] || currencyNames.uz;

        settingsCurrencyOptions.innerHTML = Object.keys(currencySymbols)
            .map(code => `
                <button type="button" class="settings-option ${
                    code === state.currency ? "active" : ""
                }" data-currency="${code}">
                    <span>${names[code] || code}</span>
                    <i class="fa-solid fa-check check-icon"></i>
                </button>
            `)
            .join("");

        settingsCurrencyOptions.querySelectorAll("[data-currency]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    state.currency = button.dataset.currency;
                    localStorage.setItem("pricecompare_currency", state.currency);
                    if (mainCurrencySelect) {
                        mainCurrencySelect.value = state.currency;
                    }
                    applyCurrencyChange();
                    renderSettingsPanel();
                });
            });
    }


    // ========================================================
    // THEMES
    // ========================================================

    if (
        settingsThemeOptions
    ) {

        settingsThemeOptions.innerHTML =
            themeList
                .map(theme => {

                    const colors =
                        themePreviewColors[
                            theme.id
                        ] ||
                        [
                            "#000",
                            "#666",
                            "#333"
                        ];


                    const active =
                        theme.id ===
                        state.theme;


                    return `
                        <button
                            type="button"
                            class="theme-swatch ${
                                active
                                    ? "active"
                                    : ""
                            }"
                            data-theme-select="${theme.id}"
                        >

                            <div
                                class="swatch-preview"
                            >

                                <span
                                    style="
                                        background:${colors[0]}
                                    "
                                ></span>

                                <span
                                    style="
                                        background:${colors[1]}
                                    "
                                ></span>

                                <span
                                    style="
                                        background:${colors[2]}
                                    "
                                ></span>

                            </div>


                            <div
                                class="swatch-name"
                            >

                                <span>

                                    <i
                                        class="fa-solid ${theme.icon}"
                                    ></i>

                                    ${
                                        theme.id
                                            .charAt(0)
                                            .toUpperCase()
                                        +
                                        theme.id.slice(1)
                                    }

                                </span>


                                <i
                                    class="fa-solid fa-check"
                                ></i>

                            </div>

                        </button>
                    `;
                })
                .join("");


        settingsThemeOptions
            .querySelectorAll(
                "[data-theme-select]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        applyTheme(
                            button.dataset
                                .themeSelect
                        );
                    }
                );
            });
    }
}


// ============================================================
// MAIN PAGE CONTROLS
// ============================================================

function applyMainControlsVisibility() {

    if (mainThemeControl) {

        mainThemeControl.hidden =
            !state.showThemeWidget;


        if (
            !state.showThemeWidget &&
            mainThemeDropdown
        ) {

            mainThemeDropdown.classList.remove(
                "active"
            );
        }
    }

    if (mainCurrencyControl) {
        mainCurrencyControl.hidden = !state.showHomepageCurrency;
    }


    if (toggleThemeWidget) {

        toggleThemeWidget.classList.toggle(
            "active",
            state.showThemeWidget
        );
    }

    if (toggleHomepageCurrency) {
        toggleHomepageCurrency.classList.toggle(
            "active",
            state.showHomepageCurrency
        );
    }


}


// ============================================================
// MAIN THEME DROPDOWN
// ============================================================

function renderMainThemeDropdown() {

    if (!mainThemeDropdown) {
        return;
    }


    mainThemeDropdown.innerHTML =
        themeList
            .map(theme => {

                const colors =
                    themePreviewColors[
                        theme.id
                    ] ||
                    [
                        "#000",
                        "#666",
                        "#333"
                    ];


                const active =
                    theme.id ===
                    state.theme;


                return `
                    <button
                        type="button"
                        class="main-theme-dropdown-item ${
                            active
                                ? "active"
                                : ""
                        }"
                        data-main-theme-select="${theme.id}"
                    >

                        <span
                            class="swatch-dot"
                            style="
                                background:${colors[1]}
                            "
                        ></span>

                        <span>
                            ${
                                theme.id
                                    .charAt(0)
                                    .toUpperCase()
                                +
                                theme.id.slice(1)
                            }
                        </span>

                    </button>
                `;
            })
            .join("");


    mainThemeDropdown
        .querySelectorAll(
            "[data-main-theme-select]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    applyTheme(
                        button.dataset
                            .mainThemeSelect
                    );


                    mainThemeDropdown.classList.remove(
                        "active"
                    );
                }
            );
        });
}


// ============================================================
// MAIN THEME BUTTON
// ============================================================

if (
    mainThemeBtn &&
    mainThemeDropdown
) {

    mainThemeBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            mainThemeDropdown.classList.toggle(
                "active"
            );
        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !mainThemeDropdown.contains(
                    event.target
                ) &&
                event.target !==
                    mainThemeBtn
            ) {

                mainThemeDropdown.classList.remove(
                    "active"
                );
            }
        }
    );
}


// ============================================================
// TOGGLE THEME WIDGET
// ============================================================

if (toggleThemeWidget) {

    toggleThemeWidget.addEventListener(
        "click",
        () => {

            state.showThemeWidget =
                !state.showThemeWidget;


            localStorage.setItem(
                "pricecompare_show_theme_widget",
                state.showThemeWidget
                    ? "1"
                    : "0"
            );


            applyMainControlsVisibility();
        }
    );
}

if (toggleHomepageCurrency) {
    toggleHomepageCurrency.addEventListener("click", () => {
        state.showHomepageCurrency = !state.showHomepageCurrency;
        localStorage.setItem(
            SHOW_HOMEPAGE_CURRENCY_KEY,
            String(state.showHomepageCurrency)
        );
        applyMainControlsVisibility();
    });
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


// ============================================================
// ESCAPE JS
// ============================================================

function escapeJs(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        );
}


// ============================================================
// KEYBOARD ESC
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        themePanel?.classList.remove(
            "active"
        );


        mainThemeDropdown?.classList.remove(
            "active"
        );


        favoritesModal?.classList.remove(
            "active"
        );


        settingsModal?.classList.remove(
            "active"
        );
    }
);


// ============================================================
// FINAL INITIALIZATION
// ============================================================

updatePriceText();

updateCounts();

updateStats();

syncQuickThemePanelActiveState();

applyMainControlsVisibility();


// ============================================================
// DEBUG
// ============================================================

console.log(
    "PriceCompare frontend loaded successfully."
);