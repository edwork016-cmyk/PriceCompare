const searchInput = document.getElementById("search");
const productsContainer = document.getElementById("products");

const languageSelect = document.getElementById("languageSelect");
const currencySelect = document.getElementById("currencySelect");

const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");

const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesModal = document.getElementById("favoritesModal");
const closeModal = document.getElementById("closeModal");
const favoritesList = document.getElementById("favoritesList");

const sortSelect = document.getElementById("sort");
const priceRange = document.getElementById("priceRange");
const priceDisplay = document.getElementById("priceDisplay");
const clearFilters = document.getElementById("clearFilters");

const count = document.getElementById("count");
const avgPrice = document.getElementById("avgPrice");
const favCount = document.getElementById("favCount");
const favTotal = document.getElementById("favTotal");

const compareNavBtn = document.getElementById("compareNavBtn");
const compareCount = document.getElementById("compareCount");
const compareSection = document.getElementById("compareSection");
const productsSection = document.getElementById("productsSection");

const compareBackBtn = document.getElementById("compareBackBtn");
const compareGoProducts = document.getElementById("compareGoProducts");
const clearComparison = document.getElementById("clearComparison");

const compareEmpty = document.getElementById("compareEmpty");
const compareTableWrap = document.getElementById("compareTableWrap");
const compareTable = document.getElementById("compareTable");


let products = [];
let favorites = JSON.parse(localStorage.getItem("pricecompare_favorites")) || [];
let comparison = JSON.parse(localStorage.getItem("pricecompare_comparison")) || [];

let currentLanguage =
    localStorage.getItem("pricecompare_language") || "ru";

let currentCurrency =
    localStorage.getItem("pricecompare_currency") || "USD";

let currentTheme =
    localStorage.getItem("pricecompare_theme") || "light";


const translations = {

    ru: {
        search: "Поиск товара...",
        heroTitle: "Сравнивайте цены за несколько секунд",
        heroText: "Найдите товары и сравните цены",
        cheap: "Сначала дешёвые",
        expensive: "Сначала дорогие",
        rating: "По рейтингу",
        clear: "Очистить",
        products: "Товаров найдено",
        sources: "Источник",
        average: "Средняя цена",
        favorites: "В избранном",
        view: "Открыть",
        compare: "Сравнить",
        added: "Добавлено",
        noProducts: "Товары не найдены",
        loading: "Загрузка товаров...",
        footer: "Сервис поиска и сравнения товаров.",
        favoritesTitle: "Избранное",
        noFavorites: "Избранных товаров пока нет",
        remove: "Удалить",
        compareTitle: "Сравнение товаров",
        compareSubtitle: "Выберите до 4 товаров и сравните их характеристики",
        back: "К товарам",
        emptyCompare: "Пока ничего не выбрано",
        emptyCompareText: "Добавьте минимум 2 товара для сравнения.",
        showProducts: "Посмотреть товары",
        clearCompare: "Очистить",
        name: "Название",
        brand: "Бренд",
        price: "Цена",
        ratingLabel: "Рейтинг",
        stock: "Количество",
        store: "Источник"
    },

    uz: {
        search: "Mahsulot qidirish...",
        heroTitle: "Narxlarni bir necha soniyada solishtiring",
        heroText: "Mahsulotlarni toping va narxlarni taqqoslang",
        cheap: "Avval arzonlari",
        expensive: "Avval qimmatlari",
        rating: "Reyting bo'yicha",
        clear: "Tozalash",
        products: "Mahsulot topildi",
        sources: "Manba",
        average: "O'rtacha narx",
        favorites: "Sevimlilarda",
        view: "Ochish",
        compare: "Taqqoslash",
        added: "Qo'shilgan",
        noProducts: "Mahsulotlar topilmadi",
        loading: "Mahsulotlar yuklanmoqda...",
        footer: "Mahsulotlarni qidirish va narxlarni taqqoslash xizmati.",
        favoritesTitle: "Sevimlilar",
        noFavorites: "Hozircha sevimli mahsulotlar yo'q",
        remove: "O'chirish",
        compareTitle: "Mahsulotlarni taqqoslash",
        compareSubtitle: "4 tagacha mahsulot tanlab, xususiyatlarini solishtiring",
        back: "Mahsulotlarga",
        emptyCompare: "Hali mahsulot tanlanmagan",
        emptyCompareText: "Taqqoslash uchun kamida 2 ta mahsulot qo'shing.",
        showProducts: "Mahsulotlarni ko'rish",
        clearCompare: "Tozalash",
        name: "Nomi",
        brand: "Brend",
        price: "Narxi",
        ratingLabel: "Reyting",
        stock: "Soni",
        store: "Manba"
    },

    en: {
        search: "Search product...",
        heroTitle: "Compare prices in seconds",
        heroText: "Find products and compare prices",
        cheap: "Cheapest first",
        expensive: "Most expensive first",
        rating: "By rating",
        clear: "Clear",
        products: "Products found",
        sources: "Source",
        average: "Average price",
        favorites: "Favorites",
        view: "Open",
        compare: "Compare",
        added: "Added",
        noProducts: "No products found",
        loading: "Loading products...",
        footer: "Product search and price comparison service.",
        favoritesTitle: "Favorites",
        noFavorites: "No favorite products yet",
        remove: "Remove",
        compareTitle: "Product comparison",
        compareSubtitle: "Choose up to 4 products and compare their features",
        back: "Back to products",
        emptyCompare: "Nothing selected yet",
        emptyCompareText: "Add at least 2 products to compare.",
        showProducts: "View products",
        clearCompare: "Clear",
        name: "Name",
        brand: "Brand",
        price: "Price",
        ratingLabel: "Rating",
        stock: "Stock",
        store: "Source"
    }

};


const currencyRates = {
    USD: 1,
    UZS: 12650,
    EUR: 0.92,
    JPY: 155,
    RUB: 82
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
        Number(usdPrice || 0) *
        currencyRates[currentCurrency];

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
    ).format(value);
}


function updatePriceDisplay() {

    const maxPrice = Number(priceRange.value);

    priceDisplay.textContent =
        "≤ " + formatPrice(maxPrice);
}


function saveFavorites() {
    localStorage.setItem(
        "pricecompare_favorites",
        JSON.stringify(favorites)
    );
}


function saveComparison() {
    localStorage.setItem(
        "pricecompare_comparison",
        JSON.stringify(comparison)
    );
}


function isFavorite(id) {
    return favorites.some(
        product => product.id === id
    );
}


function isCompared(id) {
    return comparison.some(
        product => product.id === id
    );
}


function updateCounters() {

    favCount.textContent = favorites.length;
    favTotal.textContent = favorites.length;
    compareCount.textContent = comparison.length;
}


function updateStats(list) {

    count.textContent = list.length;

    if (list.length === 0) {
        avgPrice.textContent = formatPrice(0);
        return;
    }

    const total = list.reduce(
        (sum, product) =>
            sum + Number(product.price || 0),
        0
    );

    avgPrice.textContent =
        formatPrice(total / list.length);
}


function getFilteredProducts() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    const maxPrice =
        Number(priceRange.value);

    let result =
        products.filter(product => {

            const productText =
                [
                    product.name,
                    product.brand,
                    product.category,
                    product.store
                ]
                    .join(" ")
                    .toLowerCase();

            return (
                productText.includes(query) &&
                Number(product.price || 0) <= maxPrice
            );
        });


    if (sortSelect.value === "cheap") {

        result.sort(
            (a, b) =>
                Number(a.price) - Number(b.price)
        );

    } else if (
        sortSelect.value === "expensive"
    ) {

        result.sort(
            (a, b) =>
                Number(b.price) - Number(a.price)
        );

    } else if (
        sortSelect.value === "rating"
    ) {

        result.sort(
            (a, b) =>
                Number(b.rating || 0) -
                Number(a.rating || 0)
        );

    }

    return result;
}


function renderProducts() {

    const filteredProducts =
        getFilteredProducts();

    updateStats(filteredProducts);

    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-box-open"></i>
                <p>${t("noProducts")}</p>
            </div>
        `;

        return;
    }


    productsContainer.innerHTML =
        filteredProducts.map(product => {

            const favorite =
                isFavorite(product.id);

            const compared =
                isCompared(product.id);

            return `
                <article class="product-card">

                    <div class="product-image">

                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                            onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
                        >

                        <button
                            class="favorite-btn ${favorite ? "active" : ""}"
                            data-favorite="${escapeHTML(product.id)}"
                            type="button"
                        >
                            <i class="fa-${favorite ? "solid" : "regular"} fa-heart"></i>
                        </button>

                    </div>


                    <div class="product-info">

                        <div class="product-store">
                            ${escapeHTML(product.store || "Demo Catalog")}
                        </div>

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <div class="product-brand">
                            ${escapeHTML(product.brand || "No brand")}
                        </div>

                        <div class="rating">
                            <i class="fa-solid fa-star"></i>
                            ${Number(product.rating || 0).toFixed(1)}
                        </div>

                        <div class="price">
                            ${formatPrice(product.price)}
                        </div>


                        <div class="product-actions">

                            <a
                                href="${escapeHTML(product.url || "#")}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="view-product"
                            >
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                ${t("view")}
                            </a>

                            <button
                                class="compare-btn ${compared ? "active" : ""}"
                                data-compare="${escapeHTML(product.id)}"
                                type="button"
                                title="${compared ? t("added") : t("compare")}"
                            >
                                <i class="fa-solid fa-code-compare"></i>
                            </button>

                        </div>

                    </div>

                </article>
            `;
        }).join("");


    document
        .querySelectorAll("[data-favorite]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    toggleFavorite(
                        button.dataset.favorite
                    );
                }
            );

        });


    document
        .querySelectorAll("[data-compare]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    toggleComparison(
                        button.dataset.compare
                    );
                }
            );

        });

}


function toggleFavorite(id) {

    const product =
        products.find(
            item => String(item.id) === String(id)
        );

    if (!product) return;


    if (isFavorite(id)) {

        favorites =
            favorites.filter(
                item =>
                    String(item.id) !== String(id)
            );

    } else {

        favorites.push(product);

    }


    saveFavorites();
    updateCounters();
    renderProducts();
    renderFavorites();
}


function renderFavorites() {

    if (favorites.length === 0) {

        favoritesList.innerHTML = `
            <div class="empty-message">
                ${t("noFavorites")}
            </div>
        `;

        return;
    }


    favoritesList.innerHTML =
        favorites.map(product => `
            <div class="favorite-item">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

                <div>
                    <h4>
                        ${escapeHTML(product.name)}
                    </h4>

                    <p>
                        ${formatPrice(product.price)}
                    </p>
                </div>

                <button
                    class="remove-favorite"
                    data-remove-favorite="${escapeHTML(product.id)}"
                    type="button"
                >
                    ${t("remove")}
                </button>

            </div>
        `).join("");


    document
        .querySelectorAll("[data-remove-favorite]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    toggleFavorite(
                        button.dataset.removeFavorite
                    );
                }
            );

        });

}


function toggleComparison(id) {

    const product =
        products.find(
            item => String(item.id) === String(id)
        );

    if (!product) return;


    if (isCompared(id)) {

        comparison =
            comparison.filter(
                item =>
                    String(item.id) !== String(id)
            );

    } else {

        if (comparison.length >= 4) {
            alert("Maximum 4 products!");
            return;
        }

        comparison.push(product);

    }


    saveComparison();
    updateCounters();
    renderProducts();
    renderComparison();
}


function renderComparison() {

    if (comparison.length < 2) {

        compareEmpty.style.display = "flex";
        compareTableWrap.style.display = "none";

        compareEmpty.querySelector("h3").textContent =
            t("emptyCompare");

        compareEmpty.querySelector("p").textContent =
            t("emptyCompareText");

        return;
    }


    compareEmpty.style.display = "none";
    compareTableWrap.style.display = "block";


    const rows = [

        {
            label: t("name"),
            render: product =>
                escapeHTML(product.name)
        },

        {
            label: t("brand"),
            render: product =>
                escapeHTML(product.brand || "—")
        },

        {
            label: t("price"),
            render: product =>
                formatPrice(product.price)
        },

        {
            label: t("ratingLabel"),
            render: product =>
                `${Number(product.rating || 0).toFixed(1)} ⭐`
        },

        {
            label: t("stock"),
            render: product =>
                escapeHTML(product.stock ?? "—")
        },

        {
            label: t("store"),
            render: product =>
                escapeHTML(product.store || "Demo Catalog")
        }

    ];


    compareTable.innerHTML = `

        <thead>

            <tr>

                <th>—</th>

                ${comparison.map(product => `

                    <th>

                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <p>
                            ${escapeHTML(product.name)}
                        </p>

                        <button
                            class="compare-remove"
                            data-remove-compare="${escapeHTML(product.id)}"
                            type="button"
                        >
                            ${t("remove")}
                        </button>

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
                            ${row.render(product)}
                        </td>
                    `).join("")}

                </tr>

            `).join("")}

        </tbody>

    `;


    document
        .querySelectorAll("[data-remove-compare]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    toggleComparison(
                        button.dataset.removeCompare
                    );
                }
            );

        });

}


function updateLanguage() {

    searchInput.placeholder = t("search");

    document.getElementById("heroTitle").textContent =
        t("heroTitle");

    document.getElementById("heroText").textContent =
        t("heroText");

    sortSelect.options[0].text = t("cheap");
    sortSelect.options[1].text = t("expensive");
    sortSelect.options[2].text = t("rating");

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
        t("favoritesTitle");

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

    document.getElementById("footerText").textContent =
        t("footer");

    document.documentElement.lang =
        currentLanguage;

    renderProducts();
    renderFavorites();
    renderComparison();
    updatePriceDisplay();
}


/* ================= API ================= */

async function searchProducts(query) {

    productsContainer.innerHTML = `
        <div class="loading">
            ${t("loading")}
        </div>
    `;


    try {

        const response =
            await fetch(
                `/api/search?q=${encodeURIComponent(query)}`
            );

        if (!response.ok) {
            throw new Error("API error");
        }

        const data =
            await response.json();

        products =
            data.products || [];

        renderProducts();

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <div class="empty-message">
                ${t("noProducts")}
            </div>
        `;

        products = [];
        updateStats([]);

    }

}


/* ================= EVENTS ================= */

let searchTimer;

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(searchTimer);

        searchTimer =
            setTimeout(() => {

                const query =
                    searchInput.value.trim();

                if (query.length >= 2) {
                    searchProducts(query);
                } else {
                    renderProducts();
                }

            }, 500);

    }
);


sortSelect.addEventListener(
    "change",
    renderProducts
);


priceRange.addEventListener(
    "input",
    () => {
        updatePriceDisplay();
        renderProducts();
    }
);


clearFilters.addEventListener(
    "click",
    () => {

        searchInput.value = "";
        sortSelect.value = "cheap";
        priceRange.value = 2000;

        updatePriceDisplay();
        renderProducts();

    }
);


languageSelect.addEventListener(
    "change",
    () => {

        currentLanguage =
            languageSelect.value;

        localStorage.setItem(
            "pricecompare_language",
            currentLanguage
        );

        updateLanguage();

    }
);


currencySelect.addEventListener(
    "change",
    () => {

        currentCurrency =
            currencySelect.value;

        localStorage.setItem(
            "pricecompare_currency",
            currentCurrency
        );

        updatePriceDisplay();
        renderProducts();
        renderFavorites();
        renderComparison();

    }
);


themeBtn.addEventListener(
    "click",
    () => {
        themePanel.classList.toggle("show");
    }
);


document
    .querySelectorAll(".theme-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentTheme =
                    button.dataset.theme;

                document.body.dataset.theme =
                    currentTheme;

                localStorage.setItem(
                    "pricecompare_theme",
                    currentTheme
                );

                themePanel.classList.remove("show");

            }
        );

    });


favoritesBtn.addEventListener(
    "click",
    () => {

        renderFavorites();

        favoritesModal.classList.add(
            "show"
        );

    }
);


closeModal.addEventListener(
    "click",
    () => {
        favoritesModal.classList.remove("show");
    }
);


favoritesModal.addEventListener(
    "click",
    event => {

        if (event.target === favoritesModal) {
            favoritesModal.classList.remove("show");
        }

    }
);


compareNavBtn.addEventListener(
    "click",
    () => {

        productsSection.style.display = "none";
        document.querySelector(".hero").style.display = "none";
        document.querySelector(".filters").style.display = "none";
        document.querySelector(".stats").style.display = "none";

        compareSection.classList.add("show");

        renderComparison();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


function showProductsPage() {

    productsSection.style.display = "";
    document.querySelector(".hero").style.display = "";
    document.querySelector(".filters").style.display = "";
    document.querySelector(".stats").style.display = "";

    compareSection.classList.remove("show");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


compareBackBtn.addEventListener(
    "click",
    showProductsPage
);


compareGoProducts.addEventListener(
    "click",
    showProductsPage
);


clearComparison.addEventListener(
    "click",
    () => {

        comparison = [];

        saveComparison();
        updateCounters();
        renderProducts();
        renderComparison();

    }
);


/* ================= START ================= */

function init() {

    document.body.dataset.theme =
        currentTheme;

    languageSelect.value =
        currentLanguage;

    currencySelect.value =
        currentCurrency;

    updateCounters();
    updatePriceDisplay();
    updateLanguage();

    searchProducts("phone");

}


init();