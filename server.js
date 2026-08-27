const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(
    "PARSE_API_KEY:",
    process.env.PARSE_API_KEY ? "FOUND" : "NOT FOUND"
);

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
// CACHE CONFIG
// =====================================================

// Bir xil qidiruvni qayta API'ga yubormaslik uchun cache.
//
// Masalan:
// iphone -> API
// iphone -> CACHE
// iphone -> CACHE
//
// 30 daqiqa saqlanadi.

const SEARCH_CACHE = new Map();

const CACHE_TTL = 30 * 60 * 1000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =====================================================
// CACHE HELPERS
// =====================================================

function normalizeSearchQuery(query) {
    return String(query || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getCachedSearch(query) {
    const key = normalizeSearchQuery(query);

    const cached = SEARCH_CACHE.get(key);

    if (!cached) {
        return null;
    }

    const age = Date.now() - cached.timestamp;

    if (age > CACHE_TTL) {
        SEARCH_CACHE.delete(key);

        console.log(
            `🗑️ CACHE EXPIRED: ${key}`
        );

        return null;
    }

    console.log(
        `⚡ CACHE HIT: ${key}`
    );

    return cached.data;
}

function setCachedSearch(query, data) {
    const key = normalizeSearchQuery(query);

    SEARCH_CACHE.set(key, {
        timestamp: Date.now(),
        data
    });

    console.log(
        `💾 CACHE SAVED: ${key}`
    );
}

// =====================================================
// ERROR HELPERS
// =====================================================

function isQuotaError(status, data) {
    const text = JSON.stringify(
        data || {}
    ).toLowerCase();

    return (
        status === 402 ||
        status === 429 ||
        text.includes("usage limit") ||
        text.includes("rate limit") ||
        text.includes("quota") ||
        text.includes("credit") ||
        text.includes("out of credits") ||
        text.includes("used all your credits")
    );
}

// =====================================================
// PARSE API
// =====================================================

async function parseApiFetch(url) {
    if (!PARSE_API_KEY) {
        const error = new Error(
            "PARSE_API_KEY is not configured."
        );

        error.code =
            "PARSE_NOT_CONFIGURED";

        throw error;
    }

    let response;

    try {
        response = await fetch(url, {
            method: "GET",

            headers: {
                "X-API-Key":
                    PARSE_API_KEY,

                Accept:
                    "application/json"
            }
        });
    } catch (networkError) {
        console.error(
            "PARSE NETWORK ERROR:",
            networkError.message
        );

        const error = new Error(
            "Parse API is unavailable."
        );

        error.code =
            "API_UNAVAILABLE";

        throw error;
    }

    const text =
        await response.text();

    let data = {};

    try {
        data = JSON.parse(text);
    } catch {
        const error = new Error(
            `Parse API returned invalid JSON. HTTP ${response.status}`
        );

        error.code =
            "API_UNAVAILABLE";

        throw error;
    }

    if (!response.ok) {
        console.error(
            "PARSE API ERROR:",
            data
        );

        const error = new Error(
            data?.message ||
            data?.detail ||
            data?.error?.message ||
            data?.error ||
            `Parse API request failed: ${response.status}`
        );

        if (
            isQuotaError(
                response.status,
                data
            )
        ) {
            error.code =
                "API_QUOTA_EXCEEDED";

            error.isQuotaError =
                true;
        }

        if (
            response.status === 401 ||
            response.status === 403
        ) {
            error.code =
                "INVALID_API_KEY";
        }

        throw error;
    }

    return data;
}

// =====================================================
// UNIVERSAL ARRAY EXTRACTOR
// =====================================================

function extractProducts(data) {
    const candidates = [
        data?.items,
        data?.products,

        data?.data?.items,
        data?.data?.products,

        data?.payload?.items,
        data?.payload?.products,

        data?.payload?.data?.items,
        data?.payload?.data?.products,

        data?.payload?.data
            ?.makeSearch?.products,

        data?.payload
            ?.makeSearch?.products,

        data?.data
            ?.makeSearch?.products,

        data?.data?.payload,
        data?.payload
    ];

    for (
        const value of candidates
    ) {
        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
}

// =====================================================
// FALLBACK PRODUCTS
// =====================================================

const FALLBACK_PRODUCTS = [
    {
        id: "uzum-1",

        name:
            "Apple iPhone 15 Pro Max",

        price: 12999000,

        currency: "UZS",

        rating: 4.8,

        image:
            "https://images.unsplash.com/photo-1672234441556-3b4d3f7fc5ef?auto=format&fit=crop&w=900&q=80",

        brand: "Apple",

        category: "Smartphone",

        stock: "In stock",

        store: "Uzum Market",

        url:
            "https://uzum.uz/ru/product/apple-iphone-15-pro-max-256gb-657q4m",

        productUrl:
            "https://uzum.uz/ru/product/apple-iphone-15-pro-max-256gb-657q4m",

        barcode: "",

        source: "uzum"
    },

    {
        id: "yandex-1",

        name:
            "Samsung Galaxy S24 Ultra",

        price: 12200000,

        currency: "UZS",

        rating: 4.7,

        image:
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",

        brand: "Samsung",

        category: "Smartphone",

        stock: "Available",

        store:
            "Yandex Market UZ",

        url:
            "https://market.yandex.uz/search?text=Samsung%20Galaxy%20S24%20Ultra",

        productUrl: null,

        barcode: "",

        oldPrice: 13900000,

        discount: 12,

        source: "yandex"
    },

    {
        id: "uzum-2",

        name:
            "Xiaomi Redmi Note 13 Pro",

        price: 4890000,

        currency: "UZS",

        rating: 4.6,

        image:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",

        brand: "Xiaomi",

        category: "Smartphone",

        stock: "In stock",

        store: "Uzum Market",

        url:
            "https://uzum.uz/ru/product/xiaomi-redmi-note-13-pro-8-256gb-9c0mfp",

        productUrl:
            "https://uzum.uz/ru/product/xiaomi-redmi-note-13-pro-8-256gb-9c0mfp",

        barcode: "",

        source: "uzum"
    },

    {
        id: "yandex-2",

        name:
            "Apple AirPods Pro 2",

        price: 3850000,

        currency: "UZS",

        rating: 4.9,

        image:
            "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",

        brand: "Apple",

        category: "Audio",

        stock: "Available",

        store:
            "Yandex Market UZ",

        url:
            "https://market.yandex.uz/search?text=AirPods%20Pro%202",

        productUrl: null,

        barcode: "",

        oldPrice: 4690000,

        discount: 18,

        source: "yandex"
    },

    {
        id: "uzum-3",

        name:
            "Philips Air Fryer 4.1L",

        price: 3290000,

        currency: "UZS",

        rating: 4.5,

        image:
            "https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80",

        brand: "Philips",

        category: "Kitchen",

        stock: "In stock",

        store: "Uzum Market",

        url:
            "https://uzum.uz/ru/product/philips-airfryer-4-1l-7m8j09",

        productUrl:
            "https://uzum.uz/ru/product/philips-airfryer-4-1l-7m8j09",

        barcode: "",

        source: "uzum"
    },

    {
        id: "yandex-3",

        name:
            "Xiaomi Smart Watch 8 Pro",

        price: 2170000,

        currency: "UZS",

        rating: 4.6,

        image:
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",

        brand: "Xiaomi",

        category: "Wearables",

        stock: "Available",

        store:
            "Yandex Market UZ",

        url:
            "https://market.yandex.uz/search?text=Xiaomi%20Smart%20Watch%208%20Pro",

        productUrl: null,

        barcode: "",

        oldPrice: 2890000,

        discount: 25,

        source: "yandex"
    },

    {
        id: "uzum-4",

        name:
            "Lenovo IdeaPad 5 15IAH7",

        price: 8990000,

        currency: "UZS",

        rating: 4.7,

        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",

        brand: "Lenovo",

        category: "Laptop",

        stock: "In stock",

        store: "Uzum Market",

        url:
            "https://uzum.uz/ru/product/lenovo-ideapad-5-15iah7-6f0pdk",

        productUrl:
            "https://uzum.uz/ru/product/lenovo-ideapad-5-15iah7-6f0pdk",

        barcode: "",

        source: "uzum"
    },

    {
        id: "yandex-4",

        name:
            "Bosch Washing Machine 7 kg",

        price: 6790000,

        currency: "UZS",

        rating: 4.4,

        image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",

        brand: "Bosch",

        category:
            "Home appliance",

        stock: "Available",

        store:
            "Yandex Market UZ",

        url:
            "https://market.yandex.uz/search?text=Bosch%20washing%20machine%207%20kg",

        productUrl: null,

        barcode: "",

        oldPrice: 7890000,

        discount: 14,

        source: "yandex"
    }
];

function buildFallbackProducts(query) {
    const rawQuery =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!rawQuery) {
        return FALLBACK_PRODUCTS.slice(
            0,
            6
        );
    }

    const searchTerms =
        rawQuery
            .split(/\s+/)
            .filter(Boolean);

    return FALLBACK_PRODUCTS
        .filter((product) => {
            const haystack = [
                product.name,
                product.brand,
                product.category,
                product.store,
                product.source
            ]
                .join(" ")
                .toLowerCase();

            return searchTerms.every(
                (term) =>
                    haystack.includes(term)
            );
        })
        .slice(0, 12);
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

    let raw = value;

    if (
        typeof raw === "object"
    ) {
        raw =
            raw.value ??
            raw.amount ??
            raw.price ??
            raw.minPrice ??
            raw.min_price ??
            0;
    }

    if (
        raw === null ||
        raw === undefined ||
        raw === ""
    ) {
        return 0;
    }

    const cleaned =
        String(raw)
            .replace(/\s+/g, "");

    if (
        !cleaned ||
        cleaned === "-" ||
        cleaned === "."
    ) {
        return 0;
    }

    let normalized =
        cleaned.replace(
            /[^\d,.-]/g,
            ""
        );

    if (!normalized) {
        return 0;
    }

    if (
        normalized.includes(",") &&
        normalized.includes(".")
    ) {
        const lastComma =
            normalized.lastIndexOf(",");

        const lastDot =
            normalized.lastIndexOf(".");

        if (
            lastComma > lastDot
        ) {
            normalized =
                normalized
                    .replace(/\./g, "")
                    .replace(",", ".");
        } else {
            normalized =
                normalized.replace(
                    /,/g,
                    ""
                );
        }
    } else if (
        normalized.includes(",")
    ) {
        const commaParts =
            normalized.split(",");

        if (
            commaParts.length > 1 &&
            commaParts[
                commaParts.length - 1
            ].length <= 2
        ) {
            normalized =
                normalized.replace(
                    ",",
                    "."
                );
        } else {
            normalized =
                normalized.replace(
                    /,/g,
                    ""
                );
        }
    }

    let price =
        Number(normalized);

    if (
        !Number.isFinite(price)
    ) {
        return 0;
    }

    if (
        price >= 100000000
    ) {
        price =
            Math.round(
                price / 100
            );
    }

    return Math.round(price);
}

// =====================================================
// IMAGE NORMALIZER
// =====================================================

function normalizeImage(item) {
    if (
        !item ||
        typeof item !== "object"
    ) {
        return "";
    }

    const photoCandidates = [
        ...(Array.isArray(
            item.photos
        )
            ? item.photos
            : []),

        ...(Array.isArray(
            item.photoLinks
        )
            ? item.photoLinks
            : []),

        ...(Array.isArray(
            item.photo_links
        )
            ? item.photo_links
            : [])
    ];

    return (
        item.image ||
        item.imageUrl ||
        item.image_url ||
        item.photo ||
        item.photoUrl ||
        item.photo_link ||
        item.picture ||
        photoCandidates[0] ||
        ""
    );
}

// =====================================================
// PRODUCT URL HELPERS
// =====================================================

function isValidProductUrl(
    value,
    market = ""
) {
    if (
        !value ||
        typeof value !== "string"
    ) {
        return false;
    }

    const cleaned =
        value.trim();

    if (
        !cleaned ||
        cleaned === "#" ||
        cleaned === "null" ||
        cleaned === "undefined" ||
        cleaned.startsWith(
            "javascript:"
        )
    ) {
        return false;
    }

    try {
        const parsed =
            new URL(cleaned);

        if (
            ![
                "http:",
                "https:"
            ].includes(
                parsed.protocol
            )
        ) {
            return false;
        }

        const host =
            parsed.hostname
                .toLowerCase();

        const pathname =
            parsed.pathname
                .toLowerCase();

        const search =
            parsed.search
                .toLowerCase();

        if (
            pathname === "/" ||
            pathname === "/ru" ||
            pathname === "/uz" ||
            pathname === "/login" ||
            pathname.includes(
                "/login"
            ) ||
            pathname.includes(
                "/signin"
            ) ||
            pathname.includes(
                "/account"
            )
        ) {
            return false;
        }

        if (
            market === "uzum"
        ) {
            if (
                host.includes(
                    "uzum.uz"
                ) &&
                (
                    pathname.includes(
                        "/search"
                    ) ||
                    search.includes(
                        "query="
                    )
                )
            ) {
                return false;
            }
        }

        if (
            market === "yandex"
        ) {
            if (
                host.includes(
                    "yandex"
                ) &&
                (
                    pathname.includes(
                        "/search"
                    ) ||
                    search.includes(
                        "text="
                    )
                )
            ) {
                return false;
            }
        }

        return true;

    } catch {
        return false;
    }
}

function findDirectProductUrl(
    item,
    market
) {
    const fields = [
        item?.url,
        item?.link,
        item?.productUrl,
        item?.product_url,
        item?.itemWebUrl,
        item?.webUrl,
        item?.href,
        item?.productLink,
        item?.product_link,
        item?.offerUrl,
        item?.offer_url,
        item?.productPath,
        item?.path,
        item?.slug
    ];

    for (
        const field of fields
    ) {
        if (
            isValidProductUrl(
                field,
                market
            )
        ) {
            return field;
        }
    }

    return null;
}

function getMarketplaceSearchUrl(
    storeName,
    productName
) {
    const name =
        String(
            productName || ""
        ).trim();

    const query =
        encodeURIComponent(
            name || "product"
        );

    const normalized =
        String(
            storeName || ""
        ).toLowerCase();

    if (
        normalized.includes(
            "uzum"
        )
    ) {
        return `https://uzum.uz/ru/search?query=${query}`;
    }

    if (
        normalized.includes(
            "yandex"
        )
    ) {
        return `https://market.yandex.uz/search?text=${query}`;
    }

    return `https://www.google.com/search?q=${query}`;
}

// =====================================================
// UZUM MARKET
// =====================================================

async function searchUzum(query) {
    const url =
        new URL(
            `${PARSE_API_URL}/${UZUM_SCRAPER_ID}/search_products`
        );

    url.searchParams.set(
        "query",
        query
    );

    url.searchParams.set(
        "limit",
        "24"
    );

    url.searchParams.set(
        "offset",
        "0"
    );

    const data =
        await parseApiFetch(
            url.toString()
        );

    const items =
        extractProducts(data);

    console.log(
        `Uzum: ${items.length} ta mahsulot`
    );

    return items.map(
        (item, index) => {
            const productId =
                item?.productId ||
                item?.product_id ||
                item?.id ||
                index;

            const productName =
                item?.title ||
                item?.name ||
                item?.productName ||
                "Unknown product";

            const directProductUrl =
                findDirectProductUrl(
                    item,
                    "uzum"
                );

            const fallbackSearchUrl =
                getMarketplaceSearchUrl(
                    "Uzum Market",
                    productName
                );

            return {
                id:
                    `uzum-${productId}`,

                name:
                    productName,

                price:
                    normalizePrice(
                        item?.minSellPrice ??
                        item?.min_sell_price ??
                        item?.sellPrice ??
                        item?.price ??
                        item?.minPrice ??
                        item?.salePrice ??
                        0
                    ),

                currency: "UZS",

                rating:
                    Number(
                        item?.rating ||
                        item?.ratingValue ||
                        0
                    ),

                image:
                    normalizeImage(item),

                brand:
                    item?.brand ||
                    item?.brandName ||
                    item?.seller?.title ||
                    "Uzum Market",

                category:
                    item?.category
                        ?.title ||
                    item?.category ||
                    item?.category_name ||
                    "Marketplace",

                stock:
                    item?.availableAmount ??
                    item?.available_amount ??
                    item?.stock ??
                    item?.availability ??
                    "In stock",

                store:
                    "Uzum Market",

                url:
                    directProductUrl ||
                    fallbackSearchUrl,

                productUrl:
                    directProductUrl ||
                    null,

                barcode:
                    item?.barcode ||
                    item?.barCode ||
                    "",

                source:
                    "uzum"
            };
        }
    );
}

// =====================================================
// YANDEX MARKET
// =====================================================

async function searchYandex(query) {
    const url =
        new URL(
            `${PARSE_API_URL}/${YANDEX_SCRAPER_ID}/search_products`
        );

    url.searchParams.set(
        "query",
        query
    );

    url.searchParams.set(
        "page",
        "1"
    );

    url.searchParams.set(
        "sort",
        "dpop"
    );

    const data =
        await parseApiFetch(
            url.toString()
        );

    const items =
        extractProducts(data);

    console.log(
        `Yandex Market: ${items.length} ta mahsulot`
    );

    return items
        .slice(0, 24)
        .map(
            (item, index) => {
                const productId =
                    item?.ware_id ||
                    item?.wareId ||
                    item?.product_id ||
                    item?.productId ||
                    item?.sku_id ||
                    item?.skuId ||
                    item?.id ||
                    index;

                const productName =
                    item?.title ||
                    item?.name ||
                    item?.productName ||
                    "Unknown product";

                const directProductUrl =
                    findDirectProductUrl(
                        item,
                        "yandex"
                    );

                const fallbackSearchUrl =
                    getMarketplaceSearchUrl(
                        "Yandex Market",
                        productName
                    );

                return {
                    id:
                        `yandex-${productId}`,

                    name:
                        productName,

                    price:
                        normalizePrice(
                            item?.price ??
                            item?.minPrice ??
                            item?.min_price ??
                            item?.salePrice ??
                            item?.sellPrice ??
                            item?.minSellPrice ??
                            item?.min_sell_price ??
                            0
                        ),

                    currency:
                        item?.currency ||
                        "UZS",

                    rating:
                        Number(
                            item?.rating ||
                            item?.ratingValue ||
                            0
                        ),

                    image:
                        normalizeImage(item),

                    brand:
                        item?.vendor ||
                        item?.vendor_name ||
                        item?.brand ||
                        "Yandex Market",

                    category:
                        item?.category ||
                        item?.category_name ||
                        item?.categoryTitle ||
                        "Marketplace",

                    stock:
                        item?.delivery_text ||
                        item?.deliveryText ||
                        item?.availabilityStatus ||
                        item?.availability ||
                        item?.stock ||
                        "In stock",

                    store:
                        "Yandex Market UZ",

                    url:
                        directProductUrl ||
                        fallbackSearchUrl,

                    productUrl:
                        directProductUrl ||
                        null,

                    barcode:
                        item?.barcode ||
                        item?.barCode ||
                        "",

                    oldPrice:
                        normalizePrice(
                            item?.old_price ??
                            item?.oldPrice ??
                            0
                        ),

                    discount:
                        Number(
                            item?.discount_percent ??
                            item?.discountPercent ??
                            0
                        ),

                    source:
                        "yandex"
                };
            }
        );
}

// =====================================================
// BUILD RESPONSE
// =====================================================

function buildSearchResponse(
    query,
    uzumProducts,
    yandexProducts
) {
    const products = [
        ...uzumProducts,
        ...yandexProducts
    ];

    return {
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

        products
    };
}

// =====================================================
// STATUS
// =====================================================

app.get(
    "/api/status",
    (req, res) => {
        res.json({
            success: true,

            status: "online",

            message:
                "PriceCompare API is running",

            parseApi: {
                configured:
                    Boolean(
                        PARSE_API_KEY
                    ),

                mode:
                    PARSE_API_KEY
                        ? "enabled"
                        : "fallback"
            },

            cache: {
                enabled: true,

                ttlMinutes:
                    CACHE_TTL /
                    60000,

                entries:
                    SEARCH_CACHE.size
            },

            sources: {
                uzum: {
                    configured:
                        Boolean(
                            PARSE_API_KEY
                        ),

                    scraperId:
                        UZUM_SCRAPER_ID
                },

                yandexMarket: {
                    configured:
                        Boolean(
                            PARSE_API_KEY
                        ),

                    scraperId:
                        YANDEX_SCRAPER_ID,

                    marketplace:
                        "market.yandex.uz"
                }
            }
        });
    }
);

// =====================================================
// SEARCH
// =====================================================

app.get(
    "/api/search",
    async (req, res) => {
        const query =
            String(
                req.query.q || ""
            ).trim();

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
                    "Please enter a search query."
            });
        }

        console.log("");
        console.log(
            `🔎 Search: ${query}`
        );

        // =================================================
        // CACHE CHECK
        // =================================================

        const cachedResult =
            getCachedSearch(query);

        if (cachedResult) {
            console.log(
                "⚡ Returning cached result"
            );

            return res.json({
                ...cachedResult,

                cached: true,

                cacheMinutes:
                    Math.floor(
                        CACHE_TTL /
                        60000
                    )
            });
        }

        // =================================================
        // FALLBACK PRODUCTS
        // =================================================

        const fallbackProducts =
            buildFallbackProducts(
                query
            );

        // =================================================
        // PARSE API NOT CONFIGURED
        // =================================================

        if (!PARSE_API_KEY) {
            console.log(
                "⚠️ Parse API: NOT CONFIGURED - FALLBACK MODE"
            );

            const fallbackResponse = {
                success: true,

                query,

                count:
                    fallbackProducts.length,

                sources: {
                    uzum:
                        fallbackProducts.filter(
                            (product) =>
                                product.source ===
                                "uzum"
                        ).length,

                    yandexMarket:
                        fallbackProducts.filter(
                            (product) =>
                                product.source ===
                                "yandex"
                        ).length
                },

                products:
                    fallbackProducts,

                message:
                    "Showing local demo products. Add PARSE_API_KEY to enable live marketplace results."
            };

            // Fallback ham cache qilinadi
            setCachedSearch(
                query,
                fallbackResponse
            );

            return res.json({
                ...fallbackResponse,

                cached: false
            });
        }

        // =================================================
        // CALL UZUM + YANDEX
        // =================================================

        const results =
            await Promise.allSettled([
                searchUzum(query),
                searchYandex(query)
            ]);

        let uzumProducts = [];

        let yandexProducts = [];

        let quotaExceeded = false;

        let invalidApiKey = false;

        let apiUnavailable = false;

        // =================================================
        // UZUM RESULT
        // =================================================

        if (
            results[0].status ===
            "fulfilled"
        ) {
            uzumProducts =
                Array.isArray(
                    results[0].value
                )
                    ? results[0].value
                    : [];
        } else {
            const reason =
                results[0].reason;

            console.error(
                "❌ UZUM ERROR:",
                reason?.message ||
                reason
            );

            if (
                reason?.isQuotaError ||
                reason?.code ===
                    "API_QUOTA_EXCEEDED"
            ) {
                quotaExceeded = true;
            }

            else if (
                reason?.code ===
                    "INVALID_API_KEY"
            ) {
                invalidApiKey = true;
            }

            else {
                apiUnavailable = true;
            }
        }

        // =================================================
        // YANDEX RESULT
        // =================================================

        if (
            results[1].status ===
            "fulfilled"
        ) {
            yandexProducts =
                Array.isArray(
                    results[1].value
                )
                    ? results[1].value
                    : [];
        } else {
            const reason =
                results[1].reason;

            console.error(
                "❌ YANDEX ERROR:",
                reason?.message ||
                reason
            );

            if (
                reason?.isQuotaError ||
                reason?.code ===
                    "API_QUOTA_EXCEEDED"
            ) {
                quotaExceeded = true;
            }

            else if (
                reason?.code ===
                    "INVALID_API_KEY"
            ) {
                invalidApiKey = true;
            }

            else {
                apiUnavailable = true;
            }
        }

        // =================================================
        // PRODUCTS
        // =================================================

        const products = [
            ...uzumProducts,
            ...yandexProducts
        ];

        // =================================================
        // IF SOME API WORKED
        // =================================================

        if (products.length > 0) {
            const responseData =
                buildSearchResponse(
                    query,
                    uzumProducts,
                    yandexProducts
                );

            // Live natijani cache qilish
            setCachedSearch(
                query,
                responseData
            );

            console.log(
                `✅ Uzum: ${uzumProducts.length}`
            );

            console.log(
                `✅ Yandex: ${yandexProducts.length}`
            );

            console.log(
                `✅ Total: ${products.length}`
            );

            return res.json({
                ...responseData,

                cached: false
            });
        }

        // =================================================
        // QUOTA ERROR
        // =================================================

        if (quotaExceeded) {
            console.log(
                "⚠️ API QUOTA EXCEEDED"
            );

            // Oldingi cache yo'q bo'lsa,
            // local fallback ko'rsatamiz.
            if (
                fallbackProducts.length > 0
            ) {
                const fallbackResponse = {
                    success: true,

                    query,

                    count:
                        fallbackProducts.length,

                    sources: {
                        uzum:
                            fallbackProducts.filter(
                                (product) =>
                                    product.source ===
                                    "uzum"
                            ).length,

                        yandexMarket:
                            fallbackProducts.filter(
                                (product) =>
                                    product.source ===
                                    "yandex"
                            ).length
                    },

                    products:
                        fallbackProducts,

                    fallback: true,

                    message:
                        "Live API credits are exhausted. Showing local fallback products."
                };

                return res.json(
                    fallbackResponse
                );
            }

            return res.status(429).json({
                success: false,

                error:
                    "API_QUOTA_EXCEEDED",

                message:
                    "Product provider API quota has been exceeded."
            });
        }

        // =================================================
        // INVALID API KEY
        // =================================================

        if (invalidApiKey) {
            console.log(
                "❌ INVALID API KEY"
            );

            return res.status(401).json({
                success: false,

                error:
                    "INVALID_API_KEY",

                message:
                    "Parse API key is invalid. Check PARSE_API_KEY in .env."
            });
        }

        // =================================================
        // API UNAVAILABLE
        // =================================================

        if (apiUnavailable) {
            console.log(
                "⚠️ API UNAVAILABLE"
            );

            if (
                fallbackProducts.length > 0
            ) {
                return res.json({
                    success: true,

                    query,

                    count:
                        fallbackProducts.length,

                    sources: {
                        uzum:
                            fallbackProducts.filter(
                                (product) =>
                                    product.source ===
                                    "uzum"
                            ).length,

                        yandexMarket:
                            fallbackProducts.filter(
                                (product) =>
                                    product.source ===
                                    "yandex"
                            ).length
                    },

                    products:
                        fallbackProducts,

                    fallback: true,

                    message:
                        "Live product service is temporarily unavailable. Showing fallback products."
                });
            }

            return res.status(503).json({
                success: false,

                error:
                    "API_UNAVAILABLE",

                message:
                    "Product data service is temporarily unavailable. Please try again later."
            });
        }

        // =================================================
        // NOTHING FOUND
        // =================================================

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
                "No products found."
        });
    }
);

// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {
        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );
    }
);

// =====================================================
// START
// =====================================================

if (
    require.main === module
) {
    app.listen(
        PORT,
        () => {
            console.log("");

            console.log(
                "=========================================="
            );

            console.log(
                `🚀 PriceCompare: http://localhost:${PORT}`
            );

            console.log(
                "🛒 Source 1: Uzum Market"
            );

            console.log(
                "🛒 Source 2: Yandex Market Uzbekistan"
            );

            console.log(
                PARSE_API_KEY
                    ? "🔑 Parse API: CONFIGURED"
                    : "⚠️ Parse API: NOT CONFIGURED - FALLBACK MODE"
            );

            console.log(
                `⚡ Search Cache: ENABLED (${CACHE_TTL / 60000} min)`
            );

            console.log(
                "=========================================="
            );

            console.log("");
        }
    );
}

module.exports = app;