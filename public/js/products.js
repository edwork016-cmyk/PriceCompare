import { state } from "./state.js";
import { productsContainer, priceRange, sortSelect } from "./dom.js";
import { t } from "./i18n.js";
import { formatPrice, convertFromUZS } from "./currency.js";
import { escapeHtml, escapeJs } from "./utils.js";
import { updateStats } from "./stats.js";

// ============================================================
// IMAGE URL
// ============================================================

export function getImageUrl(product) {
    if (!product?.image) {
        return "";
    }

    if (typeof product.image === "string") {
        return product.image;
    }

    if (product.image.link) {
        if (typeof product.image.link === "string") {
            return product.image.link;
        }

        return (
            product.image.link.high ||
            product.image.link.low ||
            ""
        );
    }

    if (product.image.url) {
        return product.image.url;
    }

    return "";
}

// ============================================================
// PRODUCT URL VALIDATION
// ============================================================

export function isValidProductUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }

    const value = url.trim();

    if (!value) {
        return false;
    }

    if (value === "#" || value === "null" || value === "undefined") {
        return false;
    }

    if (value.toLowerCase().startsWith("javascript:")) {
        return false;
    }

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

// ============================================================
// PRODUCT URL
// ============================================================

export function getProductUrl(product) {
    const candidates = [
        product?.productUrl,
        product?.url,
        product?.link,
        product?.href
    ];

    for (const candidate of candidates) {
        if (isValidProductUrl(candidate)) {
            return candidate.trim();
        }
    }

    const name = String(
        product?.name ||
        product?.title ||
        "product"
    ).trim();

    const query = encodeURIComponent(name);

    const source = String(
        product?.source ||
        product?.store ||
        ""
    ).toLowerCase();

    if (source.includes("uzum")) {
        return "https://uzum.uz/ru/search?query=" + query;
    }

    if (source.includes("yandex")) {
        return "https://market.yandex.uz/search?text=" + query;
    }

    return "https://www.google.com/search?q=" + query;
}

// ============================================================
// SOURCE NAME
// ============================================================

export function getSourceName(product) {
    const source = String(
        product?.source ||
        product?.store ||
        ""
    ).toLowerCase();

    if (source.includes("uzum")) {
        return "Uzum Market";
    }

    if (source.includes("yandex")) {
        return "Yandex Market";
    }

    return product?.store || "Market";
}

// ============================================================
// PRODUCT CARD
// ============================================================

export function productCard(product) {
    const image = getImageUrl(product);
    const id = String(product.id);
    const favorite = state.favorites.includes(id);

    const compared = state.comparison.some(
        selected => String(selected.id) === id
    );

    const rating = Number(product.rating || 0);
    let stars = "☆";

    if (rating > 0) {
        const rounded = Math.max(1, Math.min(5, Math.round(rating)));
        stars = "★".repeat(rounded) + "☆".repeat(5 - rounded);
    }

    const url = getProductUrl(product);

    return `
        <article
            class="product-card"
            data-id="${escapeHtml(id)}"
        >

            <div
                class="product-image ${image ? "" : "no-image"}"
            >

                ${
                    image
                        ? `
                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(product.name)}"
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
                    class="favorite-btn ${favorite ? "active" : ""}"
                    onclick="toggleFavorite('${escapeJs(id)}')"
                    title="${t("favorites")}"
                >

                    <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>

                </button>

            </div>

            <div class="product-content">

                <span class="product-store">
                    ${escapeHtml(getSourceName(product))}
                </span>

                <h3 class="product-name">
                    ${escapeHtml(product.name)}
                </h3>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <div class="product-rating">
                    ${
                        rating > 0
                            ? `
                                ${stars}
                                ${rating}/5
                            `
                            : `
                                ${t("ratingUnavailable")}
                            `
                    }
                </div>

                <div class="product-meta">
                    ${escapeHtml(product.stock || t("available"))}
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

                        ${compared ? t("added") : t("compare")}

                    </button>

                </div>

            </div>

        </article>
    `;
}

// ============================================================
// RENDER PRODUCTS
// ============================================================

export function renderProducts() {
    let products = [...state.products];

    // ================================================
    // PRICE FILTER
    // ================================================

    const maxPrice = Number(priceRange?.value || Infinity);

    products = products.filter(product => {
        const price = Number(product?.price);

        if (!Number.isFinite(price) || price <= 0) {
            return false;
        }

        return convertFromUZS(price) <= maxPrice;
    });

    // ================================================
    // SORT
    // ================================================

    const sort = sortSelect?.value || "cheap";

    if (sort === "cheap") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "expensive") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "rating") {
        products.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    state.filteredProducts = products;

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

    productsContainer.innerHTML = products.map(productCard).join("");

    updateStats();
}
