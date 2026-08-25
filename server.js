const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// CONFIG
// =====================================================

const PARSE_API_KEY = process.env.PARSE_API_KEY || "";
const PARSE_API_URL = "https://api.parse.bot/scraper";

const UZUM_SCRAPER_ID =
    "854c74bc-8ffb-43f1-9412-d5c355c8c866";

const YANDEX_SCRAPER_ID =
    "bf0d8525-2102-46d1-84e3-0fd50aed24c3";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

app.use(
    express.static(path.join(__dirname, "public"))
);

// =====================================================
// HELPERS
// =====================================================

function isQuotaError(status, data) {
    const text = JSON.stringify(data || {}).toLowerCase();

    return (
        status === 402 ||
        status === 429 ||
        text.includes("usage limit") ||
        text.includes("rate limit") ||
        text.includes("quota") ||
        text.includes("credit") ||
        text.includes("credits") ||
        text.includes("out of credits")
    );
}

// =====================================================
// PARSE API FETCH
// =====================================================

async function parseApiFetch(url) {
    if (!PARSE_API_KEY) {
        const error = new Error(
            "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        );

        error.code = "PARSE_NOT_CONFIGURED";

        throw error;
    }

    let response;

    try {
        response = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": PARSE_API_KEY,
                "Accept": "application/json"
            }
        });
    } catch (networkError) {
        console.error(
            "PARSE API NETWORK ERROR:",
            networkError.message
        );

        const error = new Error(
            "Parse API bilan tarmoq ulanishida xatolik yuz berdi."
        );

        error.code = "API_UNAVAILABLE";

        throw error;
    }

    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        console.error(
            `PARSE API JSON EMAS. HTTP ${response.status}`
        );

        const error = new Error(
            `Parse API JSON qaytarmadi. HTTP ${response.status}`
        );

        error.code = "API_UNAVAILABLE";

        throw error;
    }

    if (!response.ok) {
        console.error(
            `PARSE API ERROR HTTP ${response.status}:`,
            data
        );

        const error = new Error(
            data?.message ||
            data?.detail ||
            data?.error?.message ||
            data?.error ||
            `Parse API xatosi: ${response.status}`
        );

        if (isQuotaError(response.status, data)) {
            error.code = "API_QUOTA_EXCEEDED";
            error.isQuotaError = true;
        } else {
            error.code = "API_UNAVAILABLE";
        }

        throw error;
    }

    return data;
}

// =====================================================
// UNIVERSAL PRODUCT ARRAY EXTRACTOR
// =====================================================

function extractProducts(data) {
    const possibleArrays = [
        data,
        data?.items,
        data?.products,

        data?.data,
        data?.data?.items,
        data?.data?.products,

        data?.payload,
        data?.payload?.items,
        data?.payload?.products,

        data?.payload?.data,
        data?.payload?.data?.items,
        data?.payload?.data?.products,

        data?.makeSearch?.products,
        data?.data?.makeSearch?.products,
        data?.payload?.makeSearch?.products,
        data?.payload?.data?.makeSearch?.products,

        data?.results,
        data?.data?.results
    ];

    for (const value of possibleArrays) {
        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
}

// =====================================================
// PRICE NORMALIZER
// =====================================================

function normalizePrice(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    if (typeof value === "object") {
        value =
            value.value ??
            value.amount ??
            value.price ??
            value.currentPrice ??
            value.current ??
            0;
    }

    let cleaned = String(value)
        .replace(/\s/g, "")
        .replace(/[^\d.,]/g, "");

    if (!cleaned) {
        return 0;
    }

    // 1.234.567 format
    if (
        cleaned.includes(".") &&
        cleaned.includes(",")
    ) {
        const lastDot = cleaned.lastIndexOf(".");
        const lastComma = cleaned.lastIndexOf(",");

        if (lastComma > lastDot) {
            cleaned = cleaned
                .replace(/\./g, "")
                .replace(",", ".");
        } else {
            cleaned = cleaned.replace(/,/g, "");
        }
    } else {
        // 2,099,000 yoki 2.099.000
        const separators =
            cleaned.match(/[.,]/g) || [];

        if (separators.length > 1) {
            cleaned = cleaned.replace(/[.,]/g, "");
        } else {
            cleaned = cleaned.replace(",", ".");
        }
    }

    let price = Number(cleaned);

    if (!Number.isFinite(price)) {
        return 0;
    }

    // Ayrim API lar qiymatni tiyin/centda qaytarishi mumkin
    if (price >= 100000000) {
        price = price / 100;
    }

    return Math.round(price);
}

// =====================================================
// IMAGE NORMALIZER
// =====================================================

function getImageUrl(value) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value === "object") {
        return (
            value.url ||
            value.src ||
            value.original ||
            value.large ||
            value.medium ||
            value.small ||
            value.link ||
            ""
        );
    }

    return "";
}

function normalizeImage(item) {
    const candidates = [
        item?.image,
        item?.imageUrl,
        item?.image_url,
        item?.photo,
        item?.photoUrl,
        item?.photo_url,
        item?.picture,
        item?.thumbnail,
        item?.thumbnailUrl,
        item?.thumbnail_url,
        item?.mainImage,
        item?.main_image,

        ...(Array.isArray(item?.images)
            ? item.images
            : []),

        ...(Array.isArray(item?.photos)
            ? item.photos
            : []),

        ...(Array.isArray(item?.photoLinks)
            ? item.photoLinks
            : []),

        ...(Array.isArray(item?.photo_links)
            ? item.photo_links
            : [])
    ];

    for (const candidate of candidates) {
        const imageUrl = getImageUrl(candidate);

        if (imageUrl) {
            return imageUrl;
        }
    }

    return "";
}

// =====================================================
// URL NORMALIZER
// =====================================================

function normalizeUrl(value) {
    if (!value) {
        return null;
    }

    if (typeof value === "object") {
        const objectCandidates = [
            value.url,
            value.href,
            value.link,
            value.src,
            value.productUrl,
            value.product_url,
            value.webUrl,
            value.web_url,
            value.itemWebUrl,
            value.offerUrl
        ];

        for (const candidate of objectCandidates) {
            const result = normalizeUrl(candidate);

            if (result) {
                return result;
            }
        }

        return null;
    }

    if (typeof value !== "string") {
        return null;
    }

    let url = value.trim();

    if (!url) {
        return null;
    }

    if (
        url === "#" ||
        url === "null" ||
        url === "undefined" ||
        url.toLowerCase().startsWith("javascript:") ||
        url.toLowerCase().startsWith("data:")
    ) {
        return null;
    }

    // Relative URL
    if (url.startsWith("//")) {
        url = `https:${url}`;
    }

    try {
        const parsed = new URL(url);

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            return null;
        }

        return parsed.toString();
    } catch {
        return null;
    }
}

// =====================================================
// MARKETPLACE HOST CHECK
// =====================================================

function isUzumUrl(url) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        return (
            host === "uzum.uz" ||
            host.endsWith(".uzum.uz")
        );
    } catch {
        return false;
    }
}

function isYandexMarketUrl(url) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        return (
            host === "market.yandex.uz" ||
            host.endsWith(".market.yandex.uz")
        );
    } catch {
        return false;
    }
}

// =====================================================
// SEARCH PAGE CHECK
// =====================================================

function isSearchOrHomeUrl(url) {
    try {
        const parsed = new URL(url);

        const pathname =
            parsed.pathname
                .toLowerCase()
                .replace(/\/+$/, "");

        if (
            pathname === "" ||
            pathname === "/"
        ) {
            return true;
        }

        if (
            pathname.includes("/search") ||
            pathname.includes("/catalog/search")
        ) {
            return true;
        }

        return false;
    } catch {
        return true;
    }
}

// =====================================================
// GENERATE CANDIDATES FROM ITEM
// =====================================================

function getAllUrlCandidates(item) {
    if (!item || typeof item !== "object") {
        return [];
    }

    const candidates = [
        // Direct product URLs
        item.productUrl,
        item.product_url,
        item.productURL,

        item.itemWebUrl,
        item.item_web_url,

        item.webUrl,
        item.web_url,

        item.offerUrl,
        item.offer_url,

        item.itemUrl,
        item.item_url,

        item.detailUrl,
        item.detail_url,

        item.pageUrl,
        item.page_url,

        item.canonicalUrl,
        item.canonical_url,

        item.href,
        item.link,
        item.url,

        // Nested product
        item.product?.productUrl,
        item.product?.product_url,
        item.product?.url,
        item.product?.link,
        item.product?.href,
        item.product?.webUrl,
        item.product?.web_url,

        // Nested offer
        item.offer?.productUrl,
        item.offer?.product_url,
        item.offer?.url,
        item.offer?.link,
        item.offer?.href,
        item.offer?.webUrl,

        // Nested data
        item.data?.productUrl,
        item.data?.product_url,
        item.data?.url,
        item.data?.link,
        item.data?.href,
        item.data?.webUrl,

        // Nested item
        item.item?.productUrl,
        item.item?.product_url,
        item.item?.url,
        item.item?.link,
        item.item?.href
    ];

    // Dublikatlarni olib tashlaymiz
    return [
        ...new Set(
            candidates.filter(
                (value) => value !== null &&
                    value !== undefined &&
                    value !== ""
            )
        )
    ];
}

// =====================================================
// FIND DIRECT PRODUCT URL
// =====================================================

function findDirectProductUrl(item, marketplace) {
    const candidates =
        getAllUrlCandidates(item);

    for (const candidate of candidates) {
        const url = normalizeUrl(candidate);

        if (!url) {
            continue;
        }

        let correctMarketplace = false;

        if (marketplace === "uzum") {
            correctMarketplace =
                isUzumUrl(url);
        }

        if (marketplace === "yandex") {
            correctMarketplace =
                isYandexMarketUrl(url);
        }

        if (
            correctMarketplace &&
            !isSearchOrHomeUrl(url)
        ) {
            return url;
        }
    }

    return null;
}

// =====================================================
// MARKETPLACE SEARCH URL
// =====================================================

function getMarketplaceSearchUrl(storeName, productName) {
    const name =
        String(productName || "").trim();

    const query = encodeURIComponent(
        name || "product"
    );

    const store = String(
        storeName || ""
    ).toLowerCase();

    if (store.includes("uzum")) {
        return `https://uzum.uz/ru/search?query=${query}`;
    }

    if (store.includes("yandex")) {
        return `https://market.yandex.uz/search?text=${query}`;
    }

    return `https://www.google.com/search?q=${query}`;
}

// =====================================================
// PRODUCT NAME NORMALIZER
// =====================================================

function getProductName(item) {
    return (
        item?.title ||
        item?.name ||
        item?.productName ||
        item?.product_name ||
        item?.displayName ||
        item?.display_name ||
        "Noma'lum mahsulot"
    );
}

// =====================================================
// NUMBER NORMALIZER
// =====================================================

function normalizeNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}

// =====================================================
// UZUM SEARCH
// =====================================================

async function searchUzum(query) {
    const url = new URL(
        `${PARSE_API_URL}/${UZUM_SCRAPER_ID}/search_products`
    );

    url.searchParams.set("query", query);
    url.searchParams.set("limit", "24");
    url.searchParams.set("offset", "0");

    const data =
        await parseApiFetch(url.toString());

    const items =
        extractProducts(data);

    console.log(
        `🟢 Uzum topildi: ${items.length}`
    );

    return items
        .slice(0, 24)
        .map((item, index) => {
            const productId =
                item?.productId ||
                item?.product_id ||
                item?.skuId ||
                item?.sku_id ||
                item?.id ||
                index;

            const name =
                getProductName(item);

            // AYNAN UZUM MAHSULOT LINKI
            const directProductUrl =
                findDirectProductUrl(
                    item,
                    "uzum"
                );

            const finalUrl =
                directProductUrl ||
                getMarketplaceSearchUrl(
                    "uzum",
                    name
                );

            if (directProductUrl) {
                console.log(
                    `🔗 UZUM DIRECT: ${name}`
                );
            } else {
                console.log(
                    `⚠️ UZUM SEARCH FALLBACK: ${name}`
                );
            }

            return {
                id: `uzum-${productId}`,

                name,

                price: normalizePrice(
                    item?.minSellPrice ??
                    item?.min_sell_price ??
                    item?.sellPrice ??
                    item?.salePrice ??
                    item?.sale_price ??
                    item?.currentPrice ??
                    item?.price
                ),

                currency:
                    item?.currency ||
                    "UZS",

                rating: normalizeNumber(
                    item?.rating ??
                    item?.ratingValue ??
                    item?.rating_value ??
                    item?.averageRating ??
                    0
                ),

                image:
                    normalizeImage(item),

                brand:
                    item?.brand ||
                    item?.brandName ||
                    item?.brand_name ||
                    item?.seller?.title ||
                    item?.sellerName ||
                    "Uzum Market",

                category:
                    item?.category?.title ||
                    item?.category?.name ||
                    item?.category ||
                    "Marketplace",

                stock:
                    item?.availableAmount ??
                    item?.available_amount ??
                    item?.stock ??
                    item?.availability ??
                    item?.availabilityStatus ??
                    "Mavjud",

                store: "Uzum Market",

                // FRONTEND AVVAL SHU URLNI OCHADI
                url: finalUrl,

                // Faqat aniq product page
                productUrl:
                    directProductUrl,

                barcode:
                    item?.barcode ||
                    item?.barCode ||
                    "",

                source: "uzum"
            };
        });
}

// =====================================================
// YANDEX SEARCH
// =====================================================

async function searchYandex(query) {
    const url = new URL(
        `${PARSE_API_URL}/${YANDEX_SCRAPER_ID}/search_products`
    );

    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("sort", "dpop");

    const data =
        await parseApiFetch(url.toString());

    const items =
        extractProducts(data);

    console.log(
        `🔵 Yandex topildi: ${items.length}`
    );

    return items
        .slice(0, 24)
        .map((item, index) => {
            const productId =
                item?.ware_id ||
                item?.wareId ||
                item?.product_id ||
                item?.productId ||
                item?.sku_id ||
                item?.skuId ||
                item?.offer_id ||
                item?.offerId ||
                item?.id ||
                index;

            const name =
                getProductName(item);

            // =============================================
            // ENG MUHIM QISM
            // BARCHA MUMKIN BO'LGAN URL LAR TEKSHIRILADI
            // VA FAQAT market.yandex.uz MAHSULOT URL TANLANADI
            // =============================================

            const directProductUrl =
                findDirectProductUrl(
                    item,
                    "yandex"
                );

            const finalUrl =
                directProductUrl ||
                getMarketplaceSearchUrl(
                    "yandex",
                    name
                );

            if (directProductUrl) {
                console.log(
                    `🔗 YANDEX DIRECT: ${name}`
                );
                console.log(
                    `   ${directProductUrl}`
                );
            } else {
                console.log(
                    `⚠️ YANDEX SEARCH FALLBACK: ${name}`
                );
            }

            return {
                id: `yandex-${productId}`,

                name,

                price: normalizePrice(
                    item?.price ??
                    item?.salePrice ??
                    item?.sale_price ??
                    item?.currentPrice ??
                    item?.current_price ??
                    item?.minPrice ??
                    item?.min_price ??
                    item?.priceValue
                ),

                currency:
                    item?.currency ||
                    "UZS",

                rating: normalizeNumber(
                    item?.rating ??
                    item?.ratingValue ??
                    item?.rating_value ??
                    item?.averageRating ??
                    0
                ),

                image:
                    normalizeImage(item),

                brand:
                    item?.vendor ||
                    item?.vendor_name ||
                    item?.brand ||
                    item?.brandName ||
                    item?.brand_name ||
                    "Yandex Market",

                category:
                    item?.category?.name ||
                    item?.category_name ||
                    item?.category ||
                    "Marketplace",

                stock:
(
    item?.delivery_text ||
    item?.deliveryText ||
    item?.availabilityStatus ||
    item?.availability
) ??
                    "Mavjud",

                store: "Yandex Market UZ",

                // AYNAN MAHSULOT URL TOPILSA:
                // productUrl = direct link
                // url = direct link
                //
                // TOPILMASA:
                // url = qidiruv sahifasi

                url: finalUrl,

                productUrl:
                    directProductUrl,

                barcode:
                    item?.barcode ||
                    item?.barCode ||
                    "",

                oldPrice: normalizePrice(
                    item?.old_price ??
                    item?.oldPrice ??
                    item?.old_price_value ??
                    0
                ),

                discount: normalizeNumber(
                    item?.discount_percent ??
                    item?.discountPercent ??
                    item?.discount ??
                    0
                ),

                source: "yandex"
            };
        });
}

// =====================================================
// API STATUS
// =====================================================

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "online",

        message:
            "PriceCompare API ishlayapti",

        parseApi: {
            configured:
                Boolean(PARSE_API_KEY),

            mode:
                PARSE_API_KEY
                    ? "enabled"
                    : "fallback"
        },

        sources: {
            uzum: {
                enabled: true,

                configured:
                    Boolean(PARSE_API_KEY),

                scraperId:
                    UZUM_SCRAPER_ID,

                marketplace:
                    "uzum.uz"
            },

            yandexMarket: {
                enabled: true,

                configured:
                    Boolean(PARSE_API_KEY),

                scraperId:
                    YANDEX_SCRAPER_ID,

                marketplace:
                    "market.yandex.uz"
            }
        }
    });
});

// =====================================================
// SEARCH API
// =====================================================

app.get("/api/search", async (req, res) => {
    const query = String(
        req.query.q || ""
    ).trim();

    // =================================================
    // EMPTY QUERY
    // =================================================

    if (!query) {
        return res.json({
            success: true,
            query: "",
            count: 0,

            sources: {
                uzum: 0,
                yandexMarket: 0
            },

            products: [],

            message:
                "Qidiruv so'rovini kiriting."
        });
    }

    console.log("");
    console.log(
        "================================================"
    );
    console.log(`🔎 QIDIRUV: ${query}`);
    console.log(
        "================================================"
    );

    // =================================================
    // API KEY CHECK
    // =================================================

    if (!PARSE_API_KEY) {
        console.log(
            "⚠️ PARSE_API_KEY TOPILMADI"
        );

        return res.json({
            success: true,
            query,
            count: 0,

            sources: {
                uzum: 0,
                yandexMarket: 0
            },

            products: [],

            message:
                "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        });
    }

    // =================================================
    // UZUM + YANDEX PARALLEL SEARCH
    // =================================================

    const results =
        await Promise.allSettled([
            searchUzum(query),
            searchYandex(query)
        ]);

    let uzumProducts = [];
    let yandexProducts = [];

    let uzumError = null;
    let yandexError = null;

    // =================================================
    // UZUM RESULT
    // =================================================

    if (results[0].status === "fulfilled") {
        uzumProducts =
            Array.isArray(results[0].value)
                ? results[0].value
                : [];
    } else {
        uzumError =
            results[0].reason?.message ||
            String(results[0].reason);

        console.error(
            "❌ UZUM ERROR:",
            uzumError
        );
    }

    // =================================================
    // YANDEX RESULT
    // =================================================

    if (results[1].status === "fulfilled") {
        yandexProducts =
            Array.isArray(results[1].value)
                ? results[1].value
                : [];
    } else {
        yandexError =
            results[1].reason?.message ||
            String(results[1].reason);

        console.error(
            "❌ YANDEX ERROR:",
            yandexError
        );
    }

    // =================================================
    // COMBINE
    // =================================================

    const products = [
        ...uzumProducts,
        ...yandexProducts
    ];

    const uzumDirectLinks =
        uzumProducts.filter(
            (product) => Boolean(product.productUrl)
        ).length;

    const yandexDirectLinks =
        yandexProducts.filter(
            (product) => Boolean(product.productUrl)
        ).length;

    console.log("");
    console.log(
        `🟢 Uzum: ${uzumProducts.length} mahsulot`
    );
    console.log(
        `🔗 Uzum direct links: ${uzumDirectLinks}`
    );

    console.log(
        `🔵 Yandex: ${yandexProducts.length} mahsulot`
    );
    console.log(
        `🔗 Yandex direct links: ${yandexDirectLinks}`
    );

    console.log(
        `📦 JAMI: ${products.length} mahsulot`
    );

    console.log(
        "================================================"
    );
    console.log("");

    // =================================================
    // RESPONSE
    // =================================================

    return res.json({
        success: true,

        query,

        count:
            products.length,

        sources: {
            uzum:
                uzumProducts.length,

            yandexMarket:
                yandexProducts.length
        },

        directLinks: {
            uzum:
                uzumDirectLinks,

            yandexMarket:
                yandexDirectLinks
        },

        errors: {
            uzum:
                uzumError,

            yandexMarket:
                yandexError
        },

        products,

        message:
            products.length === 0
                ? "Mahsulot topilmadi yoki manbalar vaqtincha mavjud emas."
                : undefined
    });
});

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

// =====================================================
// API 404
// =====================================================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message:
            "API endpoint topilmadi."
    });
});

// =====================================================
// SERVER START
// =====================================================

if (require.main === module) {
    app.listen(PORT, () => {
        console.log("");
        console.log(
            "================================================"
        );

        console.log(
            `🚀 PriceCompare ishlayapti: http://localhost:${PORT}`
        );

        console.log(
            "🟢 Source 1: Uzum Market"
        );

        console.log(
            "🔵 Source 2: Yandex Market Uzbekistan"
        );

        console.log(
            PARSE_API_KEY
                ? "🔑 Parse API: CONFIGURED"
                : "⚠️ Parse API: NOT CONFIGURED - .env faylni tekshiring"
        );

        console.log(
            "================================================"
        );
        console.log("");
    });
}

module.exports = app;
