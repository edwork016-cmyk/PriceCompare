import { state } from "./state.js";
import { searchInput, searchButton, productsContainer } from "./dom.js";
import { t } from "./i18n.js";
import { escapeHtml } from "./utils.js";
import { renderProducts } from "./products.js";
import { updateStats } from "./stats.js";
import { updateCompare } from "./compare.js";
import { renderFavorites } from "./favorites.js";
import { setPriceRangeFromProducts } from "./filters.js";

// ============================================================
// SEARCH EVENTS
// ============================================================

if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
}

if (searchInput) {
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            searchProducts();
        }
    });
}

// ============================================================
// NORMALIZE SEARCH
// ============================================================

export function normalizeSearchText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[^a-z0-9Ѐ-ӿÀ-ɏ\s]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ============================================================
// PRODUCT MATCH
// ============================================================

export function productMatchesQuery(product, query) {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
        return true;
    }

    const searchText = normalizeSearchText(
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

    const words = normalizedQuery
        .split(" ")
        .filter(word => word.length >= 2);

    if (!words.length) {
        return true;
    }

    if (words.length === 1) {
        return searchText.includes(words[0]);
    }

    const matched = words.filter(word => searchText.includes(word));

    return matched.length >= Math.ceil(words.length / 2);
}

// ============================================================
// SEARCH PRODUCTS
// ============================================================

export async function searchProducts() {
    const query = searchInput?.value.trim() || "";

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
        const response = await fetch(
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
            data = await response.json();
        } catch {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        if (!response.ok) {
            const error = data?.error || "";

            if (error === "API_QUOTA_EXCEEDED") {
                const err = new Error(data?.message || t("quotaExceeded"));
                err.code = "API_QUOTA_EXCEEDED";
                throw err;
            }

            if (error === "API_UNAVAILABLE") {
                const err = new Error(data?.message || t("apiUnavailable"));
                err.code = "API_UNAVAILABLE";
                throw err;
            }

            throw new Error(data?.message || `HTTP ${response.status}`);
        }

        if (!data || data.success !== true) {
            throw new Error(data?.message || data?.error || "API error");
        }

        const apiProducts = Array.isArray(data.products) ? data.products : [];

        // ================================================
        // NORMALIZE PRODUCTS
        // ================================================

        state.products = apiProducts
            .filter(product =>
                product &&
                (product.id || product.name || product.title)
            )
            .map(normalizeProduct);

        state.filteredProducts = [...state.products];

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
        console.error("PRICECOMPARE SEARCH ERROR:", error);

        state.products = [];
        state.filteredProducts = [];

        let message = t("apiError");

        if (error?.code === "API_QUOTA_EXCEEDED") {
            message = t("quotaExceeded");
        } else if (error?.code === "API_UNAVAILABLE") {
            message = t("apiUnavailable");
        } else if (error instanceof TypeError) {
            message = t("apiUnavailable");
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
                                ${escapeHtml(error.message)}
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

export function normalizeProduct(product) {
    const id =
        product?.id ??
        product?.productId ??
        product?.sku ??
        (
            String(product?.name || product?.title || Math.random())
            + "-"
            + Math.random()
        );

    let source = String(
        product?.source ||
        product?.store ||
        ""
    ).toLowerCase();

    if (source.includes("uzum")) {
        source = "uzum";
    } else if (source.includes("yandex")) {
        source = "yandex";
    }

    const price = Number(product?.price);

    return {
        ...product,

        id: String(id),

        name: String(
            product?.name ||
            product?.title ||
            "Unknown product"
        ),

        price:
            Number.isFinite(price) && price > 0
                ? price
                : null,

        rating: Number.isFinite(Number(product?.rating))
            ? Number(product.rating)
            : 0,

        brand: product?.brand || "",

        category: product?.category || "",

        stock: product?.stock || "",

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

        productUrl: product?.productUrl || null,

        url: product?.url || null
    };
}
