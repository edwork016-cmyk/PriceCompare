const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
=======
console.log(
    "PARSE_API_KEY:",
    process.env.PARSE_API_KEY ? "FOUND" : "NOT FOUND"
);

// =====================================================
// CONFIG
// =====================================================

>>>>>>> 33cde1a (PriceCompare)
const PARSE_API_KEY = process.env.PARSE_API_KEY || "";

const PARSE_API_URL = "https://api.parse.bot/scraper";

const UZUM_SCRAPER_ID =
    "854c74bc-8ffb-43f1-9412-d5c355c8c866";

const YANDEX_SCRAPER_ID =
    "bf0d8525-2102-46d1-84e3-0fd50aed24c3";

<<<<<<< HEAD
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function isQuotaError(status, data) {
    const text = JSON.stringify(data || {}).toLowerCase();

    return (
        status === 402 ||
        status === 429 ||
        text.includes("usage limit") ||
        text.includes("rate limit") ||
        text.includes("quota") ||
        text.includes("credit") ||
        text.includes("out of credits")
    );
}

=======

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =====================================================
// PARSE API
// =====================================================

>>>>>>> 33cde1a (PriceCompare)
async function parseApiFetch(url) {

    if (!PARSE_API_KEY) {
<<<<<<< HEAD
        const error = new Error("PARSE_API_KEY is not configured.");
        error.code = "PARSE_NOT_CONFIGURED";
        throw error;
=======
        throw new Error(
            "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        );
>>>>>>> 33cde1a (PriceCompare)
    }

    const response = await fetch(url, {
        method: "GET",

<<<<<<< HEAD
    try {
        response = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": PARSE_API_KEY,
                Accept: "application/json"
            }
        });
    } catch (networkError) {
        const error = new Error("Parse API is unavailable.");
        error.code = "API_UNAVAILABLE";
        throw error;
    }

    const text = await response.text();
    let data = {};
=======
        headers: {
            "X-API-Key": PARSE_API_KEY,
            "Accept": "application/json"
        }
    });

    const text = await response.text();

    let data;
>>>>>>> 33cde1a (PriceCompare)

    try {
        data = JSON.parse(text);
    } catch {
<<<<<<< HEAD
        const error = new Error(
            `Parse API returned invalid JSON. HTTP ${response.status}`
        );
        error.code = "API_UNAVAILABLE";
        throw error;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
                data?.detail ||
                data?.error?.message ||
                data?.error ||
                `Parse API request failed: ${response.status}`
=======
        throw new Error(
            `Parse API JSON qaytarmadi. HTTP ${response.status}`
        );
    }

    if (!response.ok) {

        console.error(
            "PARSE API ERROR:",
            data
        );

        const rateLimitError =
            response.status === 429 ||
            response.status === 402 ||
            data?.error?.error?.toLowerCase().includes("usage limit") ||
            data?.error?.message?.toLowerCase().includes("usage limit") ||
            data?.error?.error?.toLowerCase().includes("rate limit") ||
            data?.error?.message?.toLowerCase().includes("rate limit") ||
            data?.error?.error?.toLowerCase().includes("quota") ||
            data?.error?.message?.toLowerCase().includes("quota") ||
            data?.error?.error?.toLowerCase().includes("credit") ||
            data?.error?.message?.toLowerCase().includes("credit") ||
            data?.message?.toLowerCase().includes("usage limit") ||
            data?.message?.toLowerCase().includes("rate limit") ||
            data?.message?.toLowerCase().includes("quota") ||
            data?.message?.toLowerCase().includes("credit");

        const error = new Error(
            data.message ||
            data.detail ||
            data.error ||
            `Parse API xatosi: ${response.status}`
>>>>>>> 33cde1a (PriceCompare)
        );

        if (rateLimitError) {
            error.code = "API_QUOTA_EXCEEDED";
            error.isQuotaError = true;
        }

        throw error;
    }

    return data;
}

<<<<<<< HEAD
function extractProducts(data) {
    const candidates = [
=======

// =====================================================
// UNIVERSAL ARRAY EXTRACTOR
// =====================================================

function extractProducts(data) {

    const possibleArrays = [

>>>>>>> 33cde1a (PriceCompare)
        data?.items,

        data?.products,
<<<<<<< HEAD
=======

>>>>>>> 33cde1a (PriceCompare)
        data?.data?.items,

        data?.data?.products,
<<<<<<< HEAD
=======

>>>>>>> 33cde1a (PriceCompare)
        data?.payload?.items,

        data?.payload?.products,
<<<<<<< HEAD
=======

>>>>>>> 33cde1a (PriceCompare)
        data?.payload?.data?.items,

        data?.payload?.data?.products,
<<<<<<< HEAD
        data?.payload?.data?.makeSearch?.products,
        data?.payload?.makeSearch?.products,
        data?.data?.makeSearch?.products,
        data?.data?.payload,
        data?.payload
    ];

    for (const value of candidates) {
=======

        data?.payload?.data?.makeSearch?.products,

        data?.payload?.makeSearch?.products,

        data?.data?.makeSearch?.products,

        data?.data?.payload

    ];

    for (const value of possibleArrays) {

>>>>>>> 33cde1a (PriceCompare)
        if (Array.isArray(value)) {
            return value;
        }

    }

    return [];
}

<<<<<<< HEAD
const FALLBACK_PRODUCTS = [
    {
        id: "uzum-1",
        name: "Apple iPhone 15 Pro Max",
        price: 12999000,
        currency: "UZS",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1672234441556-3b4d3f7fc5ef?auto=format&fit=crop&w=900&q=80",
        brand: "Apple",
        category: "Smartphone",
        stock: "In stock",
        store: "Uzum Market",
        url: "https://uzum.uz/ru/product/apple-iphone-15-pro-max-256gb-657q4m",
        productUrl: "https://uzum.uz/ru/product/apple-iphone-15-pro-max-256gb-657q4m",
        barcode: "",
        source: "uzum"
    },
    {
        id: "yandex-1",
        name: "Samsung Galaxy S24 Ultra",
        price: 12200000,
        currency: "UZS",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
        brand: "Samsung",
        category: "Smartphone",
        stock: "Available",
        store: "Yandex Market UZ",
        url: "https://market.yandex.uz/search?text=Samsung%20Galaxy%20S24%20Ultra",
        productUrl: null,
        barcode: "",
        oldPrice: 13900000,
        discount: 12,
        source: "yandex"
    },
    {
        id: "uzum-2",
        name: "Xiaomi Redmi Note 13 Pro",
        price: 4890000,
        currency: "UZS",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
        brand: "Xiaomi",
        category: "Smartphone",
        stock: "In stock",
        store: "Uzum Market",
        url: "https://uzum.uz/ru/product/xiaomi-redmi-note-13-pro-8-256gb-9c0mfp",
        productUrl: "https://uzum.uz/ru/product/xiaomi-redmi-note-13-pro-8-256gb-9c0mfp",
        barcode: "",
        source: "uzum"
    },
    {
        id: "yandex-2",
        name: "Apple AirPods Pro 2",
        price: 3850000,
        currency: "UZS",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",
        brand: "Apple",
        category: "Audio",
        stock: "Available",
        store: "Yandex Market UZ",
        url: "https://market.yandex.uz/search?text=AirPods%20Pro%202",
        productUrl: null,
        barcode: "",
        oldPrice: 4690000,
        discount: 18,
        source: "yandex"
    },
    {
        id: "uzum-3",
        name: "Philips Air Fryer 4.1L",
        price: 3290000,
        currency: "UZS",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80",
        brand: "Philips",
        category: "Kitchen",
        stock: "In stock",
        store: "Uzum Market",
        url: "https://uzum.uz/ru/product/philips-airfryer-4-1l-7m8j09",
        productUrl: "https://uzum.uz/ru/product/philips-airfryer-4-1l-7m8j09",
        barcode: "",
        source: "uzum"
    },
    {
        id: "yandex-3",
        name: "Xiaomi Smart Watch 8 Pro",
        price: 2170000,
        currency: "UZS",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
        brand: "Xiaomi",
        category: "Wearables",
        stock: "Available",
        store: "Yandex Market UZ",
        url: "https://market.yandex.uz/search?text=Xiaomi%20Smart%20Watch%208%20Pro",
        productUrl: null,
        barcode: "",
        oldPrice: 2890000,
        discount: 25,
        source: "yandex"
    },
    {
        id: "uzum-4",
        name: "Lenovo IdeaPad 5 15IAH7",
        price: 8990000,
        currency: "UZS",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        brand: "Lenovo",
        category: "Laptop",
        stock: "In stock",
        store: "Uzum Market",
        url: "https://uzum.uz/ru/product/lenovo-ideapad-5-15iah7-6f0pdk",
        productUrl: "https://uzum.uz/ru/product/lenovo-ideapad-5-15iah7-6f0pdk",
        barcode: "",
        source: "uzum"
    },
    {
        id: "yandex-4",
        name: "Bosch Washing Machine 7 kg",
        price: 6790000,
        currency: "UZS",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
        brand: "Bosch",
        category: "Home appliance",
        stock: "Available",
        store: "Yandex Market UZ",
        url: "https://market.yandex.uz/search?text=Bosch%20washing%20machine%207%20kg",
        productUrl: null,
        barcode: "",
        oldPrice: 7890000,
        discount: 14,
        source: "yandex"
    }
];

function buildFallbackProducts(query) {
    const rawQuery = String(query || "").trim().toLowerCase();

    if (!rawQuery) {
        return FALLBACK_PRODUCTS.slice(0, 6);
    }

    const searchTerms = rawQuery
        .split(/\s+/)
        .filter(Boolean);

    return FALLBACK_PRODUCTS.filter((product) => {
        const haystack = [
            product.name,
            product.brand,
            product.category,
            product.store,
            product.source
        ].join(" ").toLowerCase();

        return searchTerms.every(term => haystack.includes(term));
    }).slice(0, 12);
}

function normalizePrice(value) {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    let raw = value;

    if (typeof raw === "object") {
        raw =
            raw.value ??
            raw.amount ??
            raw.price ??
            raw.minPrice ??
            raw.min_price ??
=======

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
>>>>>>> 33cde1a (PriceCompare)
            0;

    }

<<<<<<< HEAD
    if (raw === null || raw === undefined || raw === "") {
        return 0;
    }

    const cleaned = String(raw).replace(/\s+/g, "");

    if (!cleaned || cleaned === "-" || cleaned === ".") {
        return 0;
    }

    let normalized = cleaned.replace(/[^\d,.-]/g, "");

    if (!normalized) {
        return 0;
    }

    if (normalized.includes(",") && normalized.includes(".")) {
        const lastComma = normalized.lastIndexOf(",");
        const lastDot = normalized.lastIndexOf(".");

        if (lastComma > lastDot) {
            normalized = normalized.replace(/\./g, "").replace(",", ".");
        } else {
            normalized = normalized.replace(/,/g, "");
        }
    } else if (normalized.includes(",")) {
        const commaParts = normalized.split(",");
        if (commaParts.length > 1 && commaParts[commaParts.length - 1].length <= 2) {
            normalized = normalized.replace(",", ".");
        } else {
            normalized = normalized.replace(/,/g, "");
        }
    }

    const price = Number(normalized);
=======
    let price =
        Number(
            String(value)
                .replace(/[^\d.,]/g, "")
                .replace(",", ".")
        );
>>>>>>> 33cde1a (PriceCompare)

    if (!Number.isFinite(price)) {
        return 0;
    }

<<<<<<< HEAD
    if (price >= 100000000) {
        return Math.round(price / 100);
=======
    /*
        Uzum ayrim response'larda narxni tiyin
        ko'rinishida qaytarishi mumkin.

        Faqat juda katta qiymatlarni tiyin
        deb hisoblaymiz.
    */

    if (price >= 100000000) {
        price =
            Math.round(price / 100);
>>>>>>> 33cde1a (PriceCompare)
    }

    return Math.round(price);
}

<<<<<<< HEAD
function normalizeImage(item) {
    if (!item || typeof item !== "object") {
        return "";
    }

    const photoCandidates = [
        ...(Array.isArray(item.photos) ? item.photos : []),
        ...(Array.isArray(item.photoLinks) ? item.photoLinks : []),
        ...(Array.isArray(item.photo_links) ? item.photo_links : [])
=======

// =====================================================
// IMAGE NORMALIZER
// =====================================================

function normalizeImage(item) {

    const photos = [
        ...(Array.isArray(item.photos)
            ? item.photos
            : []),

        ...(Array.isArray(item.photoLinks)
            ? item.photoLinks
            : []),

        ...(Array.isArray(item.photo_links)
            ? item.photo_links
            : [])
>>>>>>> 33cde1a (PriceCompare)
    ];

    return (
        item.image ||
        item.imageUrl ||
        item.image_url ||
        item.photo ||
        item.photoUrl ||
        item.photo_link ||
        item.picture ||
<<<<<<< HEAD
        photoCandidates[0] ||
=======
        photos[0] ||
>>>>>>> 33cde1a (PriceCompare)
        ""
    );
}

<<<<<<< HEAD
function isValidProductUrl(value, market = "") {
=======

function isValidProductUrl(value) {

>>>>>>> 33cde1a (PriceCompare)
    if (!value || typeof value !== "string") {
        return false;
    }

    const cleaned = value.trim();

<<<<<<< HEAD
    if (
        !cleaned ||
        cleaned === "#" ||
        cleaned === "null" ||
        cleaned === "undefined" ||
        cleaned.startsWith("javascript:")
    ) {
        return false;
    }

    try {
        const parsed = new URL(cleaned);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            return false;
        }

        const host = parsed.hostname.toLowerCase();
        const pathname = parsed.pathname.toLowerCase();
        const search = parsed.search.toLowerCase();

        if (
            pathname === "/" ||
            pathname === "/ru" ||
            pathname === "/uz" ||
            pathname === "/login" ||
            pathname.includes("/login") ||
            pathname.includes("/signin") ||
            pathname.includes("/account")
        ) {
            return false;
        }

        if (market === "uzum") {
            if (
                host.includes("uzum.uz") &&
                (pathname.includes("/search") || search.includes("query="))
            ) {
                return false;
            }
        }

        if (market === "yandex") {
            if (
                host.includes("yandex") &&
                (pathname.includes("/search") || search.includes("text="))
            ) {
                return false;
            }
        }

        return true;
    } catch {
        return false;
    }
}

function findDirectProductUrl(item, market) {
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
        item?.offer_url,
        item?.offerUrl,
        item?.productPath,
        item?.path,
        item?.slug
    ];

    for (const field of fields) {
        if (isValidProductUrl(field, market)) {
            return field;
        }
    }

    return null;
}

function getMarketplaceSearchUrl(storeName, productName) {
    const name = String(productName || "").trim();
    const query = encodeURIComponent(name || "product");
    const normalized = String(storeName || "").toLowerCase();

    if (normalized.includes("uzum")) {
        return `https://uzum.uz/ru/search?query=${query}`;
    }

    if (normalized.includes("yandex")) {
=======
    if (!cleaned) return false;
    if (cleaned === "#") return false;
    if (cleaned === "null") return false;
    if (cleaned === "undefined") return false;
    if (cleaned.startsWith("javascript:")) return false;

    try {

        const parsed = new URL(cleaned);

        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {
        return false;
    }

}


function getMarketplaceSearchUrl(storeName, productName) {

    const name =
        String(
            productName || ""
        ).trim();

    const query =
        encodeURIComponent(name || "product");

    const normalizedStore =
        String(storeName || "")
            .toLowerCase();

    if (normalizedStore.includes("uzum")) {
        return `https://uzum.uz/ru/search?query=${query}`;
    }

    if (normalizedStore.includes("yandex")) {
>>>>>>> 33cde1a (PriceCompare)
        return `https://market.yandex.uz/search?text=${query}`;
    }

    return `https://www.google.com/search?q=${query}`;

}

<<<<<<< HEAD
async function searchUzum(query) {
    const url = new URL(`${PARSE_API_URL}/${UZUM_SCRAPER_ID}/search_products`);
    url.searchParams.set("query", query);
    url.searchParams.set("limit", "24");
    url.searchParams.set("offset", "0");

    const data = await parseApiFetch(url.toString());
    const items = extractProducts(data);
=======

// =====================================================
// UZUM MARKET
// =====================================================

async function searchUzum(query) {

    const url = new URL(
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

>>>>>>> 33cde1a (PriceCompare)

    return items.map((item, index) => {
        const productId =
            item?.productId ||
            item?.product_id ||
            item?.id ||
            index;

<<<<<<< HEAD
        const productName =
            item?.title ||
            item?.name ||
            item?.productName ||
            "Unknown product";

        const directProductUrl = findDirectProductUrl(item, "uzum");
        const fallbackSearchUrl = getMarketplaceSearchUrl("Uzum Market", productName);

        return {
            id: `uzum-${productId}`,
            name: productName,
            price: normalizePrice(
                item?.minSellPrice ??
                    item?.min_sell_price ??
                    item?.sellPrice ??
                    item?.price ??
                    item?.minPrice ??
                    item?.salePrice ??
                    0
            ),
            currency: "UZS",
            rating: Number(item?.rating || item?.ratingValue || 0),
            image: normalizeImage(item),
            brand:
                item?.brand ||
                item?.brandName ||
                item?.seller?.title ||
                "Uzum Market",
            category:
                item?.category?.title ||
                item?.category ||
                item?.category_name ||
                "Marketplace",
            stock:
                item?.availableAmount ??
                item?.available_amount ??
                item?.stock ??
                item?.availability ??
                "In stock",
            store: "Uzum Market",
            url: directProductUrl || fallbackSearchUrl,
            productUrl: directProductUrl || null,
            barcode: item?.barcode || item?.barCode || "",
            source: "uzum"
        };
    });
}

async function searchYandex(query) {
    const url = new URL(`${PARSE_API_URL}/${YANDEX_SCRAPER_ID}/search_products`);
    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("sort", "dpop");

    const data = await parseApiFetch(url.toString());
    const items = extractProducts(data);
=======

    console.log(
        `Uzum: ${items.length} ta mahsulot`
    );


    return items.map(
        (item, index) => {

            const productId =
                item.productId ||
                item.product_id ||
                item.id ||
                index;


            const productName =
                item.title ||
                item.name ||
                item.productName ||
                "Noma'lum mahsulot";

            const directProductUrl =
                isValidProductUrl(
                    item.url ||
                    item.link ||
                    item.productUrl ||
                    item.product_url
                )
                    ? (
                        item.url ||
                        item.link ||
                        item.productUrl ||
                        item.product_url
                    )
                    : null;

            return {

                id:
                    `uzum-${productId}`,

                name:
                    productName,

                price:
                    normalizePrice(
                        item.minSellPrice ??
                        item.min_sell_price ??
                        item.sellPrice ??
                        item.price
                    ),

                currency:
                    "UZS",

                rating:
                    Number(
                        item.rating ||
                        item.ratingValue ||
                        0
                    ),

                image:
                    normalizeImage(item),

                brand:
                    item.brand ||
                    item.brandName ||
                    item.seller?.title ||
                    "Uzum Market",

                category:
                    item.category?.title ||
                    item.category ||
                    "Marketplace",

                stock:
                    item.availableAmount ??
                    item.available_amount ??
                    item.stock ??
                    "Mavjud",

                store:
                    "Uzum Market",

                url:
                    directProductUrl ||
                    getMarketplaceSearchUrl(
                        "Uzum Market",
                        productName
                    ),

                productUrl:
                    directProductUrl,

                barcode:
                    item.barcode ||
                    item.barCode ||
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

    const url = new URL(
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

>>>>>>> 33cde1a (PriceCompare)

    return items.slice(0, 24).map((item, index) => {
        const productId =
            item?.ware_id ||
            item?.wareId ||
            item?.product_id ||
            item?.productId ||
            item?.sku_id ||
            item?.skuId ||
            item?.id ||
            index;

<<<<<<< HEAD
        const productName =
            item?.title ||
            item?.name ||
            item?.productName ||
            "Unknown product";

        const directProductUrl = findDirectProductUrl(item, "yandex");
        const fallbackSearchUrl = getMarketplaceSearchUrl("Yandex Market", productName);

        return {
            id: `yandex-${productId}`,
            name: productName,
            price: normalizePrice(
                item?.price ??
                    item?.minPrice ??
                    item?.min_price ??
                    item?.salePrice ??
                    item?.sellPrice ??
                    item?.minSellPrice ??
                    item?.min_sell_price ??
                    0
            ),
            currency: item?.currency || "UZS",
            rating: Number(item?.rating || item?.ratingValue || 0),
            image: normalizeImage(item),
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
            store: "Yandex Market UZ",
            url: directProductUrl || fallbackSearchUrl,
            productUrl: directProductUrl || null,
            barcode: item?.barcode || item?.barCode || "",
            oldPrice: normalizePrice(item?.old_price ?? item?.oldPrice ?? 0),
            discount: Number(
                item?.discount_percent ??
                    item?.discountPercent ??
                    0
            ),
            source: "yandex"
        };
    });
}

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "online",
        message: "PriceCompare API is running",
        parseApi: {
            configured: Boolean(PARSE_API_KEY),
            mode: PARSE_API_KEY ? "enabled" : "fallback"
        },
        sources: {
            uzum: {
                configured: Boolean(PARSE_API_KEY),
                scraperId: UZUM_SCRAPER_ID
            },
            yandexMarket: {
                configured: Boolean(PARSE_API_KEY),
                scraperId: YANDEX_SCRAPER_ID,
                marketplace: "market.yandex.uz"
=======

    console.log(
        `Yandex Market: ${items.length} ta mahsulot`
    );


    return items
        .slice(0, 24)
        .map(
            (item, index) => {

                const productId =
                    item.ware_id ||
                    item.wareId ||
                    item.product_id ||
                    item.productId ||
                    item.sku_id ||
                    item.skuId ||
                    item.id ||
                    index;


                const title =
                    item.title ||
                    item.name ||
                    item.productName ||
                    "Noma'lum mahsulot";


                const directUrl =
                    isValidProductUrl(
                        item.url ||
                        item.product_url ||
                        item.productUrl ||
                        item.itemWebUrl
                    )
                        ? (
                            item.url ||
                            item.product_url ||
                            item.productUrl ||
                            item.itemWebUrl
                        )
                        : null;


                return {

                    id:
                        `yandex-${productId}`,

                    name:
                        title,

                    price:
                        normalizePrice(
                            item.price ??
                            item.minPrice ??
                            item.salePrice
                        ),

                    currency:
                        item.currency ||
                        "UZS",

                    rating:
                        Number(
                            item.rating ||
                            item.ratingValue ||
                            0
                        ),

                    image:
                        normalizeImage(item),

                    brand:
                        item.vendor ||
                        item.vendor_name ||
                        item.brand ||
                        "Yandex Market",

                    category:
                        item.category ||
                        item.category_name ||
                        "Marketplace",

                    stock:
                        item.delivery_text ||
                        item.deliveryText ||
                        item.availabilityStatus ||
                        "Mavjud",

                    store:
                        "Yandex Market UZ",

                    url:
                        directUrl ||
                        getMarketplaceSearchUrl(
                            "Yandex Market",
                            title
                        ),

                    productUrl:
                        directUrl,

                    barcode:
                        item.barcode ||
                        "",

                    oldPrice:
                        normalizePrice(
                            item.old_price ??
                            item.oldPrice
                        ),

                    discount:
                        Number(
                            item.discount_percent ||
                            item.discountPercent ||
                            0
                        ),

                    source:
                        "yandex"

                };

            }
        );

}


// =====================================================
// STATUS
// =====================================================

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            success:
                true,

            status:
                "online",

            message:
                "PriceCompare API ishlayapti",

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

>>>>>>> 33cde1a (PriceCompare)
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

            return res.status(400).json({

                success:
                    false,

                message:
                    "Qidiruv so'rovini kiriting"

            });

        }

<<<<<<< HEAD
app.get("/api/search", async (req, res) => {
    const query = String(req.query.q || "").trim();

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
            message: "Please enter a search query."
        });
    }

    console.log("");
    console.log(`🔎 Search: ${query}`);

    const fallbackProducts = buildFallbackProducts(query);

    if (!PARSE_API_KEY) {
        console.log("⚠️ Parse API: NOT CONFIGURED - FALLBACK MODE");
        return res.json({
            success: true,
            query,
            count: fallbackProducts.length,
            sources: {
                uzum: fallbackProducts.filter(product => product.source === "uzum").length,
                yandexMarket: fallbackProducts.filter(product => product.source === "yandex").length
            },
            products: fallbackProducts,
            message: "Showing local demo products. Add PARSE_API_KEY to enable live marketplace results."
=======

        if (!PARSE_API_KEY) {

            return res.status(500).json({

                success:
                    false,

                message:
                    "PARSE_API_KEY topilmadi. .env faylni tekshiring."

            });

        }


        console.log("");
        console.log(
            `🔎 Qidiruv: ${query}`
        );


        let results;

        try {
            results =
                await Promise.allSettled([

                    searchUzum(query),

                    searchYandex(query)

                ]);
        } catch (error) {
            const isQuota =
                error?.code === "API_QUOTA_EXCEEDED" ||
                error?.isQuotaError;

            if (isQuota) {
                return res.status(429).json({
                    success: false,
                    error: "API_QUOTA_EXCEEDED",
                    message: "Product provider API quota has been exceeded. Please try again later."
                });
            }

            return res.status(502).json({
                success: false,
                error: "API_UNAVAILABLE",
                message: "Product provider is temporarily unavailable. Please try again later."
            });
        }


        let uzumProducts = [];
        let yandexProducts = [];
        let quotaExceeded = false;
        let apiUnavailable = false;


        // =================================================
        // UZUM RESULT
        // =================================================

        if (
            results[0].status === "fulfilled"
        ) {

            uzumProducts =
                results[0].value;

        } else {

            console.error(
                "❌ UZUM ERROR:",
                results[0].reason?.message
            );

            const reason = results[0].reason;

            if (reason?.isQuotaError || reason?.code === "API_QUOTA_EXCEEDED") {
                quotaExceeded = true;
            } else if (reason instanceof Error) {
                apiUnavailable = true;
            }

        }


        // =================================================
        // YANDEX RESULT
        // =================================================

        if (
            results[1].status === "fulfilled"
        ) {

            yandexProducts =
                results[1].value;

        } else {

            console.error(
                "❌ YANDEX ERROR:",
                results[1].reason?.message
            );

            const reason = results[1].reason;

            if (reason?.isQuotaError || reason?.code === "API_QUOTA_EXCEEDED") {
                quotaExceeded = true;
            } else if (reason instanceof Error) {
                apiUnavailable = true;
            }

        }


        const products = [

            ...uzumProducts,

            ...yandexProducts

        ];

        if (
            quotaExceeded ||
            (!products.length && (apiUnavailable || results.some(result => result.status === "rejected")))
        ) {
            const shouldQuota = quotaExceeded || results.some(result => result.status === "rejected" && (result.reason?.isQuotaError || result.reason?.code === "API_QUOTA_EXCEEDED"));

            return res.status(shouldQuota ? 429 : 503).json({
                success: false,
                error: shouldQuota ? "API_QUOTA_EXCEEDED" : "API_UNAVAILABLE",
                message: shouldQuota
                    ? "Product provider API quota has been exceeded. Please try again later."
                    : "Product data service is temporarily unavailable. Please try again later."
            });
        }


        console.log(
            `✅ Jami: ${products.length}`
        );


        res.json({

            success:
                true,

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

>>>>>>> 33cde1a (PriceCompare)
        });

    }
);

<<<<<<< HEAD
    const results = await Promise.allSettled([
        searchUzum(query),
        searchYandex(query)
    ]);

    let uzumProducts = [];
    let yandexProducts = [];

    if (results[0].status === "fulfilled") {
        uzumProducts = Array.isArray(results[0].value) ? results[0].value : [];
    } else {
        console.error("❌ Uzum failed:", results[0].reason?.message || results[0].reason);
    }

    if (results[1].status === "fulfilled") {
        yandexProducts = Array.isArray(results[1].value) ? results[1].value : [];
    } else {
        console.error("❌ Yandex failed:", results[1].reason?.message || results[1].reason);
    }

    const products = [...uzumProducts, ...yandexProducts];

    if (!products.length) {
        console.log("⚠️ Live scraper returned no data - FALLBACK MODE");
        return res.json({
            success: true,
            query,
            count: fallbackProducts.length,
            sources: {
                uzum: fallbackProducts.filter(product => product.source === "uzum").length,
                yandexMarket: fallbackProducts.filter(product => product.source === "yandex").length
            },
            products: fallbackProducts,
            message: "No live marketplace results were returned. Showing local demo products instead."
        });
    }

    console.log(`✅ Uzum: ${uzumProducts.length}`);
    console.log(`✅ Yandex: ${yandexProducts.length}`);
    console.log(`✅ Total: ${products.length}`);

    return res.json({
        success: true,
        query,
        count: products.length,
        sources: {
            uzum: uzumProducts.length,
            yandexMarket: yandexProducts.length
        },
        products
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log("");
        console.log("==========================================");
        console.log(`🚀 PriceCompare: http://localhost:${PORT}`);
        console.log("🛒 Source 1: Uzum Market");
        console.log("🛒 Source 2: Yandex Market Uzbekistan");
        console.log(
            PARSE_API_KEY ? "🔑 Parse API: CONFIGURED" : "⚠️ Parse API: NOT CONFIGURED - FALLBACK MODE"
        );
        console.log("==========================================");
        console.log("");
    });
=======

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
                    : "❌ Parse API: NOT CONFIGURED"
            );

            console.log(
                "=========================================="
            );

            console.log("");

        }
    );

>>>>>>> 33cde1a (PriceCompare)
}


module.exports = app;