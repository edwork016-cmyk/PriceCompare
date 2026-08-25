"use strict";

/* =========================================================
   PRICECOMPARE
   Complete frontend controller
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
    language: "pricecompare_language",
    currency: "pricecompare_currency",
    theme: "pricecompare_theme",
    favorites: "pricecompare_favorites",
    comparison: "pricecompare_comparison",
    showThemes: "pricecompare_show_themes",
    showCurrency: "pricecompare_show_currency"
};


/* =========================================================
   THEMES
========================================================= */

const THEMES = [
    {
        id: "light",
        name: {
            uz: "Yorug'",
            ru: "Светлая",
            en: "Light"
        },
        colors: ["#f4f7fb", "#ffffff", "#2563eb"]
    },
    {
        id: "dark",
        name: {
            uz: "Qorong'i",
            ru: "Тёмная",
            en: "Dark"
        },
        colors: ["#0f172a", "#172033", "#3b82f6"]
    },
    {
        id: "neon",
        name: {
            uz: "Neon",
            ru: "Неон",
            en: "Neon"
        },
        colors: ["#080b18", "#11162a", "#a855f7"]
    },
    {
        id: "black",
        name: {
            uz: "Qora",
            ru: "Чёрная",
            en: "Black"
        },
        colors: ["#000000", "#0d0d0d", "#ffffff"]
    },
    {
        id: "blue",
        name: {
            uz: "Ko'k",
            ru: "Синяя",
            en: "Blue"
        },
        colors: ["#0b1220", "#101a2e", "#3b82f6"]
    },
    {
        id: "purple",
        name: {
            uz: "Binafsha",
            ru: "Фиолетовая",
            en: "Purple"
        },
        colors: ["#140f22", "#1c1533", "#9333ea"]
    },
    {
        id: "cyber",
        name: {
            uz: "Cyber",
            ru: "Кибер",
            en: "Cyber"
        },
        colors: ["#05070a", "#0b1015", "#00e6a8"]
    },
    {
        id: "aurora",
        name: {
            uz: "Aurora",
            ru: "Аврора",
            en: "Aurora"
        },
        colors: ["#061019", "#0c1c2b", "#22d3ee"]
    },
    {
        id: "galaxy",
        name: {
            uz: "Galaxy",
            ru: "Галактика",
            en: "Galaxy"
        },
        colors: ["#0a0714", "#150f28", "#ec4899"]
    },
    {
        id: "matrix",
        name: {
            uz: "Matrix",
            ru: "Матрица",
            en: "Matrix"
        },
        colors: ["#000200", "#030b03", "#22ff66"]
    }
];


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    uz: {
        heroTitle: "Narxlarni bir necha soniyada solishtiring",
        heroText: "Mahsulotlarni toping va narxlarni taqqoslang",
        searchPlaceholder: "Mahsulot qidirish...",
        search: "Qidirish",

        cheap: "Avval arzonlari",
        expensive: "Avval qimmatlari",
        rating: "Reyting bo'yicha",

        clear: "Tozalash",

        products: "Mahsulot topildi",
        sources: "Manba",
        average: "O'rtacha narx",
        favorites: "Sevimlilarda",

        loading: "Mahsulotlar yuklanmoqda...",
        noProducts: "Mahsulot topilmadi",
        searchProduct: "Mahsulot qidiring",
        error: "Xatolik yuz berdi",

        favorite: "Sevimli",
        compare: "Taqqoslash",
        added: "Qo'shildi",
        open: "Ochish",

        priceUnavailable: "Narx mavjud emas",

        favoritesTitle: "Sevimlilar",
        emptyFavorites: "Hozircha sevimli mahsulotlar yo'q",
        remove: "O'chirish",

        compareTitle: "Mahsulotlarni taqqoslash",
        compareSubtitle:
            "4 tagacha mahsulot tanlab, xususiyatlarini solishtiring",

        back: "Mahsulotlarga",
        clearCompare: "Tozalash",

        emptyCompareTitle: "Hali mahsulot tanlanmagan",
        emptyCompareText:
            "Taqqoslash uchun kamida 2 ta mahsulot qo'shing.",
        showProducts: "Mahsulotlarni ko'rish",

        name: "Nomi",
        brand: "Brend",
        price: "Narx",
        ratingLabel: "Reyting",
        stock: "Mavjudligi",
        store: "Do'kon",

        settings: "Sozlamalar",
        language: "Til",
        currency: "Valyuta",
        themes: "Mavzular",

        mainControls: "Bosh sahifa boshqaruvi",

        showThemes:
            "Bosh sahifada mavzularni ko'rsatish",

        showCurrency:
            "Bosh sahifada valyutani ko'rsatish",

        tenThemes: "10 ta tema",

        light: "Yorug'",
        dark: "Qorong'i",

        footer:
            "Mahsulotlarni qidirish va narxlarni taqqoslash xizmati."
    },


    ru: {
        heroTitle: "Сравнивайте цены за несколько секунд",
        heroText: "Находите товары и сравнивайте цены",
        searchPlaceholder: "Поиск товара...",
        search: "Поиск",

        cheap: "Сначала дешёвые",
        expensive: "Сначала дорогие",
        rating: "По рейтингу",

        clear: "Очистить",

        products: "Найдено товаров",
        sources: "Источники",
        average: "Средняя цена",
        favorites: "В избранном",

        loading: "Загрузка товаров...",
        noProducts: "Товары не найдены",
        searchProduct: "Найдите товар",
        error: "Произошла ошибка",

        favorite: "В избранное",
        compare: "Сравнить",
        added: "Добавлено",
        open: "Открыть",

        priceUnavailable: "Цена недоступна",

        favoritesTitle: "Избранное",
        emptyFavorites: "Пока нет избранных товаров",
        remove: "Удалить",

        compareTitle: "Сравнение товаров",
        compareSubtitle:
            "Выберите до 4 товаров для сравнения",

        back: "К товарам",
        clearCompare: "Очистить",

        emptyCompareTitle: "Товары не выбраны",
        emptyCompareText:
            "Добавьте минимум 2 товара для сравнения.",
        showProducts: "Показать товары",

        name: "Название",
        brand: "Бренд",
        price: "Цена",
        ratingLabel: "Рейтинг",
        stock: "Наличие",
        store: "Магазин",

        settings: "Настройки",
        language: "Язык",
        currency: "Валюта",
        themes: "Темы",

        mainControls: "Управление главной страницей",

        showThemes:
            "Показывать темы на главной",

        showCurrency:
            "Показывать валюту на главной",

        tenThemes: "10 тем",

        light: "Светлая",
        dark: "Тёмная",

        footer:
            "Сервис поиска товаров и сравнения цен."
    },


    en: {
        heroTitle: "Compare prices in seconds",
        heroText: "Find products and compare prices",
        searchPlaceholder: "Search for a product...",
        search: "Search",

        cheap: "Cheapest first",
        expensive: "Most expensive first",
        rating: "By rating",

        clear: "Clear",

        products: "Products found",
        sources: "Sources",
        average: "Average price",
        favorites: "Favorites",

        loading: "Loading products...",
        noProducts: "No products found",
        searchProduct: "Search for a product",
        error: "An error occurred",

        favorite: "Favorite",
        compare: "Compare",
        added: "Added",
        open: "Open",

        priceUnavailable: "Price unavailable",

        favoritesTitle: "Favorites",
        emptyFavorites: "No favorite products yet",
        remove: "Remove",

        compareTitle: "Product comparison",
        compareSubtitle:
            "Select up to 4 products to compare",

        back: "Back to products",
        clearCompare: "Clear",

        emptyCompareTitle: "No products selected",
        emptyCompareText:
            "Add at least 2 products to compare.",
        showProducts: "Show products",

        name: "Name",
        brand: "Brand",
        price: "Price",
        ratingLabel: "Rating",
        stock: "Stock",
        store: "Store",

        settings: "Settings",
        language: "Language",
        currency: "Currency",
        themes: "Themes",

        mainControls: "Homepage controls",

        showThemes:
            "Show themes on homepage",

        showCurrency:
            "Show currency on homepage",

        tenThemes: "10 themes",

        light: "Light",
        dark: "Dark",

        footer:
            "Product search and price comparison service."
    }

};


/* =========================================================
   STATE
========================================================= */

let currentLanguage =
    localStorage.getItem(STORAGE.language) || "uz";

let currentCurrency =
    localStorage.getItem(STORAGE.currency) || "UZS";

let currentTheme =
    localStorage.getItem(STORAGE.theme) || "light";

let showThemes =
    localStorage.getItem(STORAGE.showThemes) === "true";

let showCurrency =
    localStorage.getItem(STORAGE.showCurrency) === "true";


let allProducts = [];

let favorites = loadArray(STORAGE.favorites);

let comparison = loadArray(STORAGE.comparison);


/* =========================================================
   CURRENCY
========================================================= */

const currencyRates = {
    UZS: 1,
    USD: 1 / 12650,
    EUR: 1 / 13700,
    RUB: 1 / 150,
    JPY: 1 / 85
};


const currencySymbols = {
    UZS: "so'm",
    USD: "$",
    EUR: "€",
    RUB: "₽",
    JPY: "¥"
};


/* =========================================================
   HELPERS
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}


function $all(selector) {
    return document.querySelectorAll(selector);
}


function loadArray(key) {
    try {
        const data = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}


function saveArray(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


function t(key) {
    return (
        translations[currentLanguage]?.[key] ||
        translations.uz[key] ||
        key
    );
}


/* =========================================================
   PRICE
========================================================= */

function hasPrice(product) {

    const price = Number(product?.price);

    return Number.isFinite(price) && price > 0;
}


function getProductPrice(product) {

    if (!hasPrice(product)) {
        return null;
    }

    return Number(product.price);
}


function formatPrice(price) {

    if (
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return t("priceUnavailable");
    }


    const converted =
        Number(price) * currencyRates[currentCurrency];


    let locale = "uz-UZ";

    if (currentLanguage === "ru") {
        locale = "ru-RU";
    }

    if (currentLanguage === "en") {
        locale = "en-US";
    }


    const decimals =
        currentCurrency === "UZS" ||
        currentCurrency === "JPY"
            ? 0
            : 2;


    try {

        return new Intl.NumberFormat(
            locale,
            {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }
        ).format(converted)
        + " "
        + currencySymbols[currentCurrency];

    } catch {

        return `${Math.round(converted)} ${currencySymbols[currentCurrency]}`;
    }
}


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme) {

    const exists = THEMES.some(
        item => item.id === theme
    );

    if (!exists) {
        theme = "light";
    }

    currentTheme = theme;

    document.body.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        STORAGE.theme,
        theme
    );

    updateThemeUI();
}


function updateThemeUI() {

    $all(".theme-option").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === currentTheme
        );

    });


    $all(".theme-swatch").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === currentTheme
        );

    });


    $all(".main-theme-dropdown-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === currentTheme
        );

    });
}


/* =========================================================
   BUILD ALL THEMES
========================================================= */

function renderThemeOptions() {

    const container =
        $("#settingsThemeOptions");

    if (!container) return;


    container.innerHTML = "";


    THEMES.forEach(theme => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "theme-swatch";

        button.dataset.theme = theme.id;


        const preview =
            document.createElement("div");

        preview.className =
            "swatch-preview";


        theme.colors.forEach(color => {

            const span =
                document.createElement("span");

            span.style.background = color;

            preview.appendChild(span);

        });


        const name =
            document.createElement("div");

        name.className = "swatch-name";


        const title =
            document.createElement("span");

        title.textContent =
            theme.name[currentLanguage];


        const icon =
            document.createElement("i");

        icon.className =
            "fa-solid fa-check";


        name.appendChild(title);
        name.appendChild(icon);


        button.appendChild(preview);
        button.appendChild(name);


        button.addEventListener(
            "click",
            () => {

                applyTheme(theme.id);

            }
        );


        container.appendChild(button);

    });


    updateThemeUI();
}


/* =========================================================
   MAIN THEME DROPDOWN
========================================================= */

function renderMainThemeDropdown() {

    const dropdown =
        $("#mainThemeDropdown");

    if (!dropdown) return;


    dropdown.innerHTML = "";


    THEMES.forEach(theme => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "main-theme-dropdown-item";

        button.dataset.theme =
            theme.id;


        const dot =
            document.createElement("span");

        dot.className = "swatch-dot";

        dot.style.background =
            theme.colors[2];


        const text =
            document.createElement("span");

        text.textContent =
            theme.name[currentLanguage];


        button.appendChild(dot);
        button.appendChild(text);


        button.addEventListener(
            "click",
            () => {

                applyTheme(theme.id);

                dropdown.classList.remove("active");

            }
        );


        dropdown.appendChild(button);

    });


    updateThemeUI();
}


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage(language) {

    if (!translations[language]) {
        language = "uz";
    }


    currentLanguage = language;

    localStorage.setItem(
        STORAGE.language,
        language
    );


    document.documentElement.lang =
        language;


    const languageSelect =
        $("#languageSelect");

    if (languageSelect) {
        languageSelect.value =
            language;
    }


    updateTranslations();

    renderSettingsLanguage();

    renderThemeOptions();

    renderMainThemeDropdown();

    updateThemeUI();

    renderProducts();

    renderFavorites();

    renderComparison();

    updateStats();
}


/* =========================================================
   TRANSLATIONS UI
========================================================= */

function updateTranslations() {

    const map = {

        heroTitle: "heroTitle",
        heroText: "heroText",

        searchButtonText: "search",

        clearText: "clear",

        productsText: "products",
        sourcesText: "sources",
        averageText: "average",
        favoritesText: "favorites",

        compareBackText: "back",
        compareTitle: "compareTitle",
        compareSubtitle: "compareSubtitle",

        clearCompareText: "clearCompare",

        compareEmptyTitle:
            "emptyCompareTitle",

        compareEmptyText:
            "emptyCompareText",

        compareGoProductsText:
            "showProducts",

        favoritesTitle:
            "favoritesTitle",

        settingsTitle:
            "settings",

        settingsLanguageLabel:
            "language",

        settingsCurrencyLabel:
            "currency",

        settingsThemeLabel:
            "themes",

        settingsMainControlsLabel:
            "mainControls",

        toggleThemeWidgetText:
            "showThemes",

        toggleHomepageCurrencyText:
            "showCurrency",

        allThemesText:
            "tenThemes",

        footerText:
            "footer",

        initialMessage:
            "searchProduct"
    };


    Object.entries(map).forEach(
        ([id, key]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = t(key);
            }

        }
    );


    const search =
        $("#search");

    if (search) {
        search.placeholder =
            t("searchPlaceholder");
    }


    const sort =
        $("#sort");

    if (sort) {

        const cheap =
            sort.querySelector(
                'option[value="cheap"]'
            );

        const expensive =
            sort.querySelector(
                'option[value="expensive"]'
            );

        const rating =
            sort.querySelector(
                'option[value="rating"]'
            );


        if (cheap)
            cheap.textContent = t("cheap");

        if (expensive)
            expensive.textContent = t("expensive");

        if (rating)
            rating.textContent = t("rating");

    }


    $all("[data-theme-text]").forEach(
        element => {

            const key =
                element.dataset.themeText;

            if (key === "light") {
                element.textContent =
                    t("light");
            }

            if (key === "dark") {
                element.textContent =
                    t("dark");
            }

        }
    );
}


/* =========================================================
   SETTINGS LANGUAGE
========================================================= */

function renderSettingsLanguage() {

    const container =
        $("#settingsLanguageOptions");

    if (!container) return;


    container.innerHTML = "";


    const languages = [
        {
            id: "uz",
            name: "O'zbekcha",
            flag: "🇺🇿"
        },
        {
            id: "ru",
            name: "Русский",
            flag: "🇷🇺"
        },
        {
            id: "en",
            name: "English",
            flag: "🇬🇧"
        }
    ];


    languages.forEach(language => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "settings-option";


        if (
            currentLanguage === language.id
        ) {
            button.classList.add("active");
        }


        button.innerHTML = `
            <span>
                ${language.flag}
                ${language.name}
            </span>

            <i class="fa-solid fa-check check-icon"></i>
        `;


        button.addEventListener(
            "click",
            () => {

                applyLanguage(
                    language.id
                );

            }
        );


        container.appendChild(button);

    });
}


/* =========================================================
   SETTINGS CURRENCY
========================================================= */

function renderSettingsCurrency() {

    const container =
        $("#settingsCurrencyOptions");

    if (!container) return;


    container.innerHTML = "";


    const currencies = [
        {
            id: "UZS",
            name: "UZS so'm"
        },
        {
            id: "USD",
            name: "USD $"
        },
        {
            id: "EUR",
            name: "EUR €"
        },
        {
            id: "RUB",
            name: "RUB ₽"
        },
        {
            id: "JPY",
            name: "JPY ¥"
        }
    ];


    currencies.forEach(currency => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "settings-option";


        if (
            currentCurrency === currency.id
        ) {
            button.classList.add("active");
        }


        button.innerHTML = `
            <span>${currency.name}</span>
            <i class="fa-solid fa-check check-icon"></i>
        `;


        button.addEventListener(
            "click",
            () => {

                currentCurrency =
                    currency.id;

                localStorage.setItem(
                    STORAGE.currency,
                    currentCurrency
                );


                const mainSelect =
                    $("#mainCurrencySelect");

                if (mainSelect) {
                    mainSelect.value =
                        currentCurrency;
                }


                renderSettingsCurrency();

                updatePriceDisplay();

                renderProducts();

                renderFavorites();

                renderComparison();

                updateStats();

            }
        );


        container.appendChild(button);

    });
}


/* =========================================================
   MAIN CONTROLS
========================================================= */

function updateMainControls() {

    const themeControl =
        $("#mainThemeControl");

    const currencyControl =
        $("#mainCurrencyControl");


    if (themeControl) {

        themeControl.hidden =
            !showThemes;

    }


    if (currencyControl) {

        currencyControl.hidden =
            !showCurrency;

    }


    const themeToggle =
        $("#toggleThemeWidget");

    const currencyToggle =
        $("#toggleHomepageCurrency");


    if (themeToggle) {

        themeToggle.classList.toggle(
            "active",
            showThemes
        );

    }


    if (currencyToggle) {

        currencyToggle.classList.toggle(
            "active",
            showCurrency
        );

    }
}


/* =========================================================
   FILTER
========================================================= */

let maxPrice = 20000000;


function getFilteredProducts() {

    let list = [...allProducts];


    const sort =
        $("#sort")?.value || "cheap";


    list = list.filter(product => {

        const price =
            getProductPrice(product);


        if (price === null) {
            return true;
        }


        return price <= maxPrice;

    });


    if (sort === "cheap") {

        list.sort((a, b) => {

            const pa = getProductPrice(a);
            const pb = getProductPrice(b);


            if (pa === null) return 1;
            if (pb === null) return -1;

            return pa - pb;

        });

    }


    if (sort === "expensive") {

        list.sort((a, b) => {

            const pa = getProductPrice(a);
            const pb = getProductPrice(b);


            if (pa === null) return 1;
            if (pb === null) return -1;

            return pb - pa;

        });

    }


    if (sort === "rating") {

        list.sort(
            (a, b) =>
                Number(b.rating || 0) -
                Number(a.rating || 0)
        );

    }


    return list;
}


/* =========================================================
   PRICE DISPLAY
========================================================= */

function updatePriceDisplay() {

    const input =
        $("#priceInput");

    const range =
        $("#priceRange");


    if (!input || !range) return;


    maxPrice =
        Number(range.value);


    input.value =
        Math.round(maxPrice).toLocaleString(
            currentLanguage === "ru"
                ? "ru-RU"
                : "uz-UZ"
        );


    const display =
        $("#priceDisplay");

    if (display) {
        display.textContent = "≤";
    }


    const percent =
        (maxPrice /
            Number(range.max)) * 100;


    range.style.setProperty(
        "--value",
        `${percent}%`
    );
}


/* =========================================================
   PRODUCTS
========================================================= */

function renderProducts() {

    const container =
        $("#products");

    if (!container) return;


    const list =
        getFilteredProducts();


    if (!list.length) {

        container.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-box-open"></i>
                <p>${t("noProducts")}</p>
            </div>
        `;

        updateStats();

        return;
    }


    container.innerHTML =
        list.map(
            product => createProductCard(product)
        ).join("");


    bindProductButtons();

    updateStats();
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const id =
        String(
            product.id ||
            product.productId ||
            Math.random()
        );


    const name =
        escapeHtml(
            product.name ||
            "Product"
        );


    const price =
        formatPrice(
            getProductPrice(product)
        );


    const rating =
        Number(product.rating || 0);


    const store =
        escapeHtml(
            product.store ||
            product.source ||
            "Market"
        );


    const brand =
        escapeHtml(
            product.brand ||
            ""
        );


    const image =
        getImageUrl(product);


    const url =
        getProductUrl(product);


    const favorite =
        favorites.some(
            item => String(item.id) === id
        );


    const compared =
        comparison.some(
            item => String(item.id) === id
        );


    return `
        <article
            class="product-card"
            data-id="${escapeAttr(id)}"
        >

            <div class="product-image ${
                image ? "" : "no-image"
            }">

                ${
                    image
                        ? `
                            <img
                                src="${escapeAttr(image)}"
                                alt="${name}"
                                loading="lazy"
                                onerror="this.style.display='none';this.parentElement.classList.add('no-image');"
                            >
                        `
                        : `
                            <i class="fa-solid fa-image"></i>
                        `
                }


                <button
                    class="favorite-btn ${
                        favorite ? "active" : ""
                    }"
                    data-action="favorite"
                    type="button"
                    title="${t("favorite")}"
                >

                    <i class="fa-${
                        favorite
                            ? "solid"
                            : "regular"
                    } fa-heart"></i>

                </button>

            </div>


            <div class="product-content">

                <span class="product-store">
                    ${store}
                </span>


                <h3 class="product-name">
                    ${name}
                </h3>


                <div class="product-price">
                    ${price}
                </div>


                <div class="product-rating">

                    ${
                        rating > 0
                            ? `⭐ ${rating.toFixed(1)}`
                            : ""
                    }

                </div>


                <div class="product-meta">

                    ${
                        brand
                            ? `${t("brand")}: ${brand}`
                            : ""
                    }

                </div>


                <div class="product-actions">

                    <a
                        href="${escapeAttr(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                        ${t("open")}

                    </a>


                    <button
                        class="compare-btn"
                        data-action="compare"
                        type="button"
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


/* =========================================================
   IMAGE
========================================================= */

function getImageUrl(product) {

    if (!product) return "";


    if (
        typeof product.image === "string"
    ) {
        return product.image;
    }


    if (
        product.image &&
        typeof product.image === "object"
    ) {

        return (
            product.image.url ||
            product.image.src ||
            product.image.original ||
            product.image.preview ||
            ""
        );

    }


    return (
        product.imageUrl ||
        product.thumbnail ||
        product.photo ||
        ""
    );
}


/* =========================================================
   PRODUCT URL
========================================================= */

function getProductUrl(product) {

    if (!product) {
        return "#";
    }


    return (
        product.productUrl ||
        product.url ||
        "#"
    );
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

function bindProductButtons() {

    $all(
        '[data-action="favorite"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                const id =
                    card?.dataset.id;


                const product =
                    allProducts.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );


                if (product) {
                    toggleFavorite(product);
                }

            }
        );

    });


    $all(
        '[data-action="compare"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                const id =
                    card?.dataset.id;


                const product =
                    allProducts.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );


                if (product) {
                    toggleComparison(product);
                }

            }
        );

    });
}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(product) {

    const id =
        String(product.id);


    const index =
        favorites.findIndex(
            item =>
                String(item.id) === id
        );


    if (index >= 0) {

        favorites.splice(index, 1);

    } else {

        favorites.push(product);

    }


    saveArray(
        STORAGE.favorites,
        favorites
    );


    updateFavoriteCounts();

    renderProducts();

    renderFavorites();
}


function updateFavoriteCounts() {

    const count =
        favorites.length;


    const header =
        $("#headerFavCount");

    const stats =
        $("#statsFavCount");


    if (header)
        header.textContent = count;


    if (stats)
        stats.textContent = count;
}


/* =========================================================
   FAVORITES MODAL
========================================================= */

function renderFavorites() {

    const container =
        $("#favoritesList");

    if (!container) return;


    if (!favorites.length) {

        container.innerHTML = `
            <div class="empty-message">
                ${t("emptyFavorites")}
            </div>
        `;

        return;
    }


    container.innerHTML =
        favorites.map(product => {

            const image =
                getImageUrl(product);


            return `
                <div
                    class="favorite-item"
                    data-id="${escapeAttr(String(product.id))}"
                >

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeAttr(image)}"
                                    alt=""
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
                                    background:var(--card2);
                                    border-radius:10px;
                                    "
                                >
                                    <i class="fa-solid fa-image"></i>
                                </div>
                            `
                    }


                    <div class="favorite-item-info">

                        <strong>
                            ${escapeHtml(product.name || "")}
                        </strong>

                        <span>
                            ${formatPrice(getProductPrice(product))}
                        </span>

                    </div>


                    <button
                        type="button"
                        data-remove-favorite
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;

        }).join("");


    container
        .querySelectorAll(
            "[data-remove-favorite]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".favorite-item"
                        );

                    const id =
                        item?.dataset.id;


                    favorites =
                        favorites.filter(
                            product =>
                                String(product.id) !==
                                String(id)
                        );


                    saveArray(
                        STORAGE.favorites,
                        favorites
                    );


                    updateFavoriteCounts();

                    renderFavorites();

                    renderProducts();

                }
            );

        });
}


/* =========================================================
   COMPARISON
========================================================= */

function toggleComparison(product) {

    const id =
        String(product.id);


    const index =
        comparison.findIndex(
            item =>
                String(item.id) === id
        );


    if (index >= 0) {

        comparison.splice(index, 1);

    } else {

        if (comparison.length >= 4) {

            alert(
                currentLanguage === "ru"
                    ? "Можно сравнить максимум 4 товара."
                    : currentLanguage === "en"
                        ? "You can compare up to 4 products."
                        : "Maksimal 4 ta mahsulotni solishtirish mumkin."
            );

            return;
        }


        comparison.push(product);
    }


    saveArray(
        STORAGE.comparison,
        comparison
    );


    updateCompareCount();

    renderProducts();

    renderComparison();
}


/* =========================================================
   COMPARE COUNT
========================================================= */

function updateCompareCount() {

    const element =
        $("#compareCount");

    if (element) {
        element.textContent =
            comparison.length;
    }
}


/* =========================================================
   COMPARISON
========================================================= */

function renderComparison() {

    const empty =
        $("#compareEmpty");

    const wrap =
        $("#compareTableWrap");

    const table =
        $("#compareTable");


    if (!empty || !wrap || !table) {
        return;
    }


    if (comparison.length < 2) {

        empty.style.display = "block";

        wrap.style.display = "none";

        return;
    }


    empty.style.display = "none";

    wrap.style.display = "block";


    const rows = [
        {
            key: "name",
            label: t("name"),
            value: p =>
                p.name || "—"
        },
        {
            key: "brand",
            label: t("brand"),
            value: p =>
                p.brand || "—"
        },
        {
            key: "price",
            label: t("price"),
            value: p =>
                formatPrice(
                    getProductPrice(p)
                )
        },
        {
            key: "rating",
            label: t("ratingLabel"),
            value: p =>
                p.rating
                    ? `⭐ ${p.rating}`
                    : "—"
        },
        {
            key: "stock",
            label: t("stock"),
            value: p =>
                p.stock || "—"
        },
        {
            key: "store",
            label: t("store"),
            value: p =>
                p.store ||
                p.source ||
                "—"
        }
    ];


    table.innerHTML = `

        <thead>

            <tr>

                <th></th>

                ${comparison.map(product => `
                    <th>
                        ${escapeHtml(product.name || "")}
                    </th>
                `).join("")}

            </tr>

        </thead>


        <tbody>

            ${rows.map(row => `

                <tr>

                    <th>
                        ${row.label}
                    </th>

                    ${comparison.map(product => `
                        <td>
                            ${escapeHtml(
                                String(
                                    row.value(product)
                                )
                            )}
                        </td>
                    `).join("")}

                </tr>

            `).join("")}

        </tbody>
    `;
}


/* =========================================================
   SEARCH
========================================================= */

async function searchProducts() {

    const input =
        $("#search");


    if (!input) return;


    const query =
        input.value.trim();


    if (!query) {

        allProducts = [];

        renderProducts();

        return;
    }


    const container =
        $("#products");


    container.innerHTML = `
        <div class="loading-message">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>${t("loading")}</p>

        </div>
    `;


    try {

        const response =
            await fetch(
                `/api/search?query=${encodeURIComponent(query)}`
            );


        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        let products = [];


        if (
            Array.isArray(data.products)
        ) {

            products =
                data.products;

        } else if (
            Array.isArray(data.data)
        ) {

            products =
                data.data;

        } else if (
            Array.isArray(data.results)
        ) {

            products =
                data.results;

        }


        allProducts =
            products.map(
                normalizeProduct
            );


        renderProducts();

    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        container.innerHTML = `
            <div class="error-message">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>${t("error")}</p>

            </div>
        `;

    }
}


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(product, index) {

    return {

        ...product,

        id:
            product.id ??
            product.productId ??
            `product-${index}`,

        name:
            product.name ??
            product.title ??
            "Product",

        price:
            product.price ??
            null,

        rating:
            product.rating ??
            0,

        brand:
            product.brand ??
            "",

        store:
            product.store ??
            product.source ??
            "",

        source:
            product.source ??
            product.store ??
            "",

        image:
            product.image ??
            product.imageUrl ??
            product.thumbnail ??
            "",

        url:
            product.url ??
            product.productUrl ??
            "#",

        productUrl:
            product.productUrl ??
            product.url ??
            "#"

    };
}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const list =
        getFilteredProducts();


    const count =
        $("#count");

    if (count) {
        count.textContent =
            list.length;
    }


    const sourceCount =
        $("#sourceCount");


    const sources =
        new Set(
            list
                .map(
                    p =>
                        p.source ||
                        p.store
                )
                .filter(Boolean)
        );


    if (sourceCount) {
        sourceCount.textContent =
            sources.size;
    }


    const prices =
        list
            .map(
                getProductPrice
            )
            .filter(
                price =>
                    price !== null
            );


    const avg =
        $("#avgPrice");


    if (!avg) return;


    if (!prices.length) {

        avg.textContent =
            t("priceUnavailable");

        return;
    }


    const average =
        prices.reduce(
            (sum, price) =>
                sum + price,
            0
        ) / prices.length;


    avg.textContent =
        formatPrice(average);
}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    const range =
        $("#priceRange");

    const sort =
        $("#sort");

    if (range) {

        range.value =
            range.max;

    }


    if (sort) {

        sort.value =
            "cheap";

    }


    updatePriceDisplay();

    renderProducts();
}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttr(value) {

    return escapeHtml(value);
}


/* =========================================================
   MODALS
========================================================= */

function openModal(element) {

    if (element) {
        element.classList.add("active");
    }
}


function closeModal(element) {

    if (element) {
        element.classList.remove("active");
    }
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEvents() {

    /* LANGUAGE */

    const languageSelect =
        $("#languageSelect");

    if (languageSelect) {

        languageSelect.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

            }
        );

    }


    /* THEME BUTTON */

    const themeBtn =
        $("#themeBtn");

    const themePanel =
        $("#themePanel");


    if (themeBtn && themePanel) {

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


    /* QUICK THEMES */

    $all(
        ".theme-option[data-theme]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                applyTheme(
                    button.dataset.theme
                );

                if (themePanel) {
                    themePanel.classList.remove(
                        "active"
                    );
                }

            }
        );

    });


    /* ALL THEMES */

    const openAll =
        $("#openAllThemesBtn");


    if (openAll) {

        openAll.addEventListener(
            "click",
            () => {

                openModal(
                    $("#settingsModal")
                );

                if (themePanel) {
                    themePanel.classList.remove(
                        "active"
                    );
                }

            }
        );

    }


    /* MAIN THEME */

    const mainThemeBtn =
        $("#mainThemeBtn");


    const mainDropdown =
        $("#mainThemeDropdown");


    if (
        mainThemeBtn &&
        mainDropdown
    ) {

        mainThemeBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                mainDropdown.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* SETTINGS */

    const settingsBtn =
        $("#settingsBtn");


    if (settingsBtn) {

        settingsBtn.addEventListener(
            "click",
            () => {

                openModal(
                    $("#settingsModal")
                );

            }
        );

    }


    /* CLOSE SETTINGS */

    const closeSettings =
        $("#closeSettingsModal");


    if (closeSettings) {

        closeSettings.addEventListener(
            "click",
            () => {

                closeModal(
                    $("#settingsModal")
                );

            }
        );

    }


    /* CURRENCY */

    const mainCurrency =
        $("#mainCurrencySelect");


    if (mainCurrency) {

        mainCurrency.value =
            currentCurrency;


        mainCurrency.addEventListener(
            "change",
            event => {

                currentCurrency =
                    event.target.value;


                localStorage.setItem(
                    STORAGE.currency,
                    currentCurrency
                );


                renderSettingsCurrency();

                updatePriceDisplay();

                renderProducts();

                renderFavorites();

                renderComparison();

                updateStats();

            }
        );

    }


    /* SHOW THEME WIDGET */

    const toggleTheme =
        $("#toggleThemeWidget");


    if (toggleTheme) {

        toggleTheme.addEventListener(
            "click",
            () => {

                showThemes =
                    !showThemes;


                localStorage.setItem(
                    STORAGE.showThemes,
                    String(showThemes)
                );


                updateMainControls();

            }
        );

    }


    /* SHOW CURRENCY */

    const toggleCurrency =
        $("#toggleHomepageCurrency");


    if (toggleCurrency) {

        toggleCurrency.addEventListener(
            "click",
            () => {

                showCurrency =
                    !showCurrency;


                localStorage.setItem(
                    STORAGE.showCurrency,
                    String(showCurrency)
                );


                updateMainControls();

            }
        );

    }


    /* SEARCH */

    const searchButton =
        $("#searchButton");


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );

    }


    const searchInput =
        $("#search");


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    searchProducts();

                }

            }
        );

    }


    /* SORT */

    const sort =
        $("#sort");


    if (sort) {

        sort.addEventListener(
            "change",
            renderProducts
        );

    }


    /* PRICE RANGE */

    const range =
        $("#priceRange");


    if (range) {

        range.addEventListener(
            "input",
            () => {

                updatePriceDisplay();

                renderProducts();

            }
        );

    }


    /* PRICE INPUT */

    const priceInput =
        $("#priceInput");


    if (priceInput) {

        priceInput.addEventListener(
            "change",
            () => {

                const value =
                    Number(
                        priceInput.value
                            .replace(/[^\d]/g, "")
                    );


                if (
                    Number.isFinite(value)
                ) {

                    const range =
                        $("#priceRange");


                    const max =
                        Number(range.max);


                    const finalValue =
                        Math.min(
                            Math.max(
                                value,
                                0
                            ),
                            max
                        );


                    range.value =
                        finalValue;


                    updatePriceDisplay();

                    renderProducts();

                }

            }
        );

    }


    /* CLEAR FILTERS */

    const clear =
        $("#clearFilters");


    if (clear) {

        clear.addEventListener(
            "click",
            clearFilters
        );

    }


    /* FAVORITES */

    const favoritesButton =
        $("#favoritesBtn");


    if (favoritesButton) {

        favoritesButton.addEventListener(
            "click",
            () => {

                renderFavorites();

                openModal(
                    $("#favoritesModal")
                );

            }
        );

    }


    /* CLOSE FAVORITES */

    const closeFavorites =
        $("#closeModal");


    if (closeFavorites) {

        closeFavorites.addEventListener(
            "click",
            () => {

                closeModal(
                    $("#favoritesModal")
                );

            }
        );

    }


    /* COMPARE */

    const compareNav =
        $("#compareNavBtn");


    if (compareNav) {

        compareNav.addEventListener(
            "click",
            () => {

                showComparison();

            }
        );

    }


    /* BACK */

    const compareBack =
        $("#compareBackBtn");


    if (compareBack) {

        compareBack.addEventListener(
            "click",
            () => {

                hideComparison();

            }
        );

    }


    /* GO PRODUCTS */

    const compareGo =
        $("#compareGoProducts");


    if (compareGo) {

        compareGo.addEventListener(
            "click",
            hideComparison
        );

    }


    /* CLEAR COMPARISON */

    const clearComparison =
        $("#clearComparison");


    if (clearComparison) {

        clearComparison.addEventListener(
            "click",
            () => {

                comparison = [];

                saveArray(
                    STORAGE.comparison,
                    comparison
                );

                updateCompareCount();

                renderComparison();

                renderProducts();

            }
        );

    }


    /* CLOSE MODALS BY BACKDROP */

    $all(".modal").forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(modal);

                }

            }
        );

    });


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                $all(".modal.active")
                    .forEach(
                        modal =>
                            closeModal(modal)
                    );


                if (themePanel) {
                    themePanel.classList.remove(
                        "active"
                    );
                }


                if (mainDropdown) {
                    mainDropdown.classList.remove(
                        "active"
                    );
                }

            }

        }
    );


    /* DOCUMENT CLICK */

    document.addEventListener(
        "click",
        event => {

            if (
                themePanel &&
                !themePanel.contains(event.target) &&
                !themeBtn?.contains(event.target)
            ) {

                themePanel.classList.remove(
                    "active"
                );

            }


            if (
                mainDropdown &&
                !mainDropdown.contains(event.target) &&
                !mainThemeBtn?.contains(event.target)
            ) {

                mainDropdown.classList.remove(
                    "active"
                );

            }

        }
    );
}


/* =========================================================
   SHOW / HIDE COMPARISON
========================================================= */

function showComparison() {

    $("#productsSection").style.display =
        "none";

    $(".filters").style.display =
        "none";

    $(".stats").style.display =
        "none";

    $(".hero").style.display =
        "none";

    $("#compareSection").classList.add(
        "active"
    );

    renderComparison();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function hideComparison() {

    $("#productsSection").style.display =
        "";

    $(".filters").style.display =
        "";

    $(".stats").style.display =
        "";

    $(".hero").style.display =
        "";

    $("#compareSection").classList.remove(
        "active"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   INIT
========================================================= */

function init() {

    applyTheme(currentTheme);

    applyLanguage(currentLanguage);

    renderSettingsCurrency();

    renderSettingsLanguage();

    renderThemeOptions();

    renderMainThemeDropdown();

    updateMainControls();

    updatePriceDisplay();

    updateFavoriteCounts();

    updateCompareCount();

    renderFavorites();

    renderComparison();

    setupEvents();

    console.log(
        "PriceCompare initialized successfully"
    );
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);