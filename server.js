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
    express.static(
        path.join(__dirname, "public")
    )
);


// =====================================================
// PARSE API
// =====================================================

async function parseApiFetch(url) {

    if (!PARSE_API_KEY) {
        throw new Error(
            "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        );
    }

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "X-API-Key": PARSE_API_KEY,
            "Accept": "application/json"
        }
    });

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            `Parse API JSON qaytarmadi. HTTP ${response.status}`
        );
    }

    if (!response.ok) {

        console.error(
            "PARSE API ERROR:",
            data
        );

        throw new Error(
            data.message ||
            data.detail ||
            data.error ||
            `Parse API xatosi: ${response.status}`
        );
    }

    return data;
}


// =====================================================
// UNIVERSAL ARRAY EXTRACTOR
// =====================================================

function extractProducts(data) {

    const possibleArrays = [

        data?.items,

        data?.products,

        data?.data?.items,

        data?.data?.products,

        data?.payload?.items,

        data?.payload?.products,

        data?.payload?.data?.items,

        data?.payload?.data?.products,

        data?.payload?.data?.makeSearch?.products,

        data?.payload?.makeSearch?.products,

        data?.data?.makeSearch?.products,

        data?.data?.payload

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
            0;

    }

    let price =
        Number(
            String(value)
                .replace(/[^\d.,]/g, "")
                .replace(",", ".")
        );

    if (!Number.isFinite(price)) {
        return 0;
    }

    /*
        Uzum ayrim response'larda narxni tiyin
        ko'rinishida qaytarishi mumkin.

        Faqat juda katta qiymatlarni tiyin
        deb hisoblaymiz.
    */

    if (price >= 100000000) {
        price =
            Math.round(price / 100);
    }

    return Math.round(price);
}


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
    ];

    return (
        item.image ||
        item.imageUrl ||
        item.image_url ||
        item.photo ||
        item.photoUrl ||
        item.photo_link ||
        item.picture ||
        photos[0] ||
        ""
    );
}


function isValidProductUrl(value) {

    if (!value || typeof value !== "string") {
        return false;
    }

    const cleaned = value.trim();

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
        return `https://market.yandex.uz/search?text=${query}`;
    }

    return `https://www.google.com/search?q=${query}`;

}


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


    const items =
        extractProducts(data);


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


        const results =
            await Promise.allSettled([

                searchUzum(query),

                searchYandex(query)

            ]);


        let uzumProducts = [];
        let yandexProducts = [];


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

        }


        const products = [

            ...uzumProducts,

            ...yandexProducts

        ];


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
                    : "❌ Parse API: NOT CONFIGURED"
            );

            console.log(
                "=========================================="
            );

            console.log("");

        }
    );

}


module.exports = app;