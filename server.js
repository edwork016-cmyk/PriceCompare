const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const PARSE_API_KEY = process.env.PARSE_API_KEY || "";


// ==============================================
// PARSE API SETTINGS
// ==============================================

const PARSE_API_URL = "https://api.parse.bot/scraper";

const UZUM_SCRAPER_ID =
    "854c74bc-8ffb-43f1-9412-d5c355c8c866";

const YANDEX_SCRAPER_ID =
    "bf0d8525-2102-46d1-84e3-0fd50aed24c3";


// ==============================================
// MIDDLEWARE
// ==============================================

app.use(cors());
app.use(express.json());


// ==============================================
// CHECK API KEY
// ==============================================

function checkParseApiKey() {
    if (!PARSE_API_KEY) {
        throw new Error(
            "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        );
    }
}


// ==============================================
// FETCH PARSE API
// ==============================================

async function parseApiFetch(url) {

    checkParseApiKey();

    const response = await fetch(url, {
        headers: {
            "X-API-Key": PARSE_API_KEY,
            "Accept": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("PARSE API ERROR:", data);

        throw new Error(
            data.message ||
            data.detail ||
            `Parse API error: ${response.status}`
        );
    }

    return data;
}


// ==============================================
// SEARCH UZUM MARKET
// ==============================================

async function searchUzum(query) {

    const url = new URL(
        `${PARSE_API_URL}/${UZUM_SCRAPER_ID}/search_products`
    );

    url.searchParams.set("query", query);
    url.searchParams.set("limit", "24");
    url.searchParams.set("offset", "0");

    const data = await parseApiFetch(url.toString());


    // Turli response strukturalariga mos
    const items =
        data.items ||
        data.products ||
        data.payload?.data?.makeSearch?.products ||
        data.payload?.makeSearch?.products ||
        data.data?.makeSearch?.products ||
        data.data?.payload ||
        [];


    return items.map((item, index) => {

        // Uzum narxi tiyin bo'lishi mumkin
        let rawPrice =
            item.minSellPrice ??
            item.min_sell_price ??
            item.price ??
            item.sellPrice ??
            0;

        rawPrice = Number(rawPrice) || 0;

        // Agar tiyin formatida kelsa UZS ga o'tkazish
        const price =
            rawPrice > 10000000
                ? Math.round(rawPrice / 100)
                : rawPrice;


        const rawImage =
            item.image ||
            item.imageUrl ||
            item.image_url ||
            item.photo ||
            item.photoUrl ||
            item.photo_link ||
            item.photos?.[0] ||
            item.photoLinks?.[0] ||
            item.photo_links?.[0] ||
            "";


        const productId =
            item.productId ||
            item.product_id ||
            item.id ||
            index;


        return {
            id: `uzum-${productId}`,

            name:
                item.title ||
                item.name ||
                "Noma'lum mahsulot",

            price,

            currency: "UZS",

            rating:
                Number(item.rating || 0),

            image: rawImage,

            brand:
                item.brand ||
                item.seller?.title ||
                "Uzum Market",

            category:
                item.category?.title ||
                item.category ||
                "Marketplace",

            stock:
                item.availableAmount ??
                item.available_amount ??
                "-",

            store: "Uzum Market",

            url:
                item.url ||
                item.link ||
                item.productUrl ||
                item.product_url ||
                "https://uzum.uz",

            barcode: "",

            source: "uzum"
        };

    });

}


// ==============================================
// SEARCH YANDEX MARKET UZ
// ==============================================

async function searchYandex(query) {

    const url = new URL(
        `${PARSE_API_URL}/${YANDEX_SCRAPER_ID}/search_products`
    );

    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("sort", "dpop");

    const data = await parseApiFetch(url.toString());


    const items =
        data.items ||
        data.data?.items ||
        data.products ||
        [];


    return items.slice(0, 24).map((item, index) => {

        const productId =
            item.ware_id ||
            item.wareId ||
            item.product_id ||
            item.productId ||
            item.sku_id ||
            index;


        return {
            id: `yandex-${productId}`,

            name:
                item.title ||
                item.name ||
                "Noma'lum mahsulot",

            price:
                Number(item.price || 0),

            currency:
                item.currency || "UZS",

            rating:
                Number(item.rating || 0),

            image:
                item.image ||
                item.image_url ||
                item.imageUrl ||
                item.picture ||
                "",

            brand:
                item.vendor ||
                item.vendor_name ||
                "Yandex Market",

            category:
                item.category ||
                "Marketplace",

            stock:
                item.delivery_text ||
                item.deliveryText ||
                "Mavjud",

            store: "Yandex Market UZ",

            url:
                item.url ||
                item.product_url ||
                item.productUrl ||
                item.slug
                    ? `https://market.yandex.uz/search?text=${encodeURIComponent(
                        item.title || query
                    )}`
                    : "https://market.yandex.uz",

            barcode: "",

            oldPrice:
                Number(
                    item.old_price ||
                    item.oldPrice ||
                    0
                ),

            discount:
                Number(
                    item.discount_percent ||
                    item.discountPercent ||
                    0
                ),

            source: "yandex"
        };

    });

}


// ==============================================
// API STATUS
// ==============================================

app.get("/api/status", (req, res) => {

    res.json({
        success: true,

        status: "online",

        message:
            "PriceCompare API ishlayapti",

        sources: {
            uzum: {
                configured:
                    Boolean(PARSE_API_KEY),

                scraperId:
                    UZUM_SCRAPER_ID
            },

            yandexMarket: {
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


// ==============================================
// COMBINED SEARCH
// ==============================================

app.get("/api/search", async (req, res) => {

    const query =
        String(req.query.q || "").trim();


    if (!query) {
        return res.status(400).json({
            success: false,
            message:
                "Qidiruv so'rovini kiriting"
        });
    }


    if (!PARSE_API_KEY) {
        return res.status(500).json({
            success: false,
            message:
                "PARSE_API_KEY topilmadi. .env faylni tekshiring."
        });
    }


    const results =
        await Promise.allSettled([
            searchUzum(query),
            searchYandex(query)
        ]);


    const uzumProducts =
        results[0].status === "fulfilled"
            ? results[0].value
            : [];


    const yandexProducts =
        results[1].status === "fulfilled"
            ? results[1].value
            : [];


    // Terminalda xatolarni ko'rsatadi
    if (results[0].status === "rejected") {
        console.error(
            "UZUM ERROR:",
            results[0].reason.message
        );
    }


    if (results[1].status === "rejected") {
        console.error(
            "YANDEX ERROR:",
            results[1].reason.message
        );
    }


    const products = [
        ...uzumProducts,
        ...yandexProducts
    ];


    res.json({
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
    });

});


// ==============================================
// STATIC FILES
// ==============================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==============================================
// MAIN PAGE
// ==============================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// ==============================================
// START SERVER
// ==============================================

if (require.main === module) {

    app.listen(PORT, () => {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            `PriceCompare ishlayapti: http://localhost:${PORT}`
        );

        console.log(
            "Source 1: Uzum Market"
        );

        console.log(
            "Source 2: Yandex Market Uzbekistan"
        );

        console.log(
            PARSE_API_KEY
                ? "Parse API: configured"
                : "Parse API: NOT configured"
        );

        console.log(
            "======================================"
        );
        console.log("");

    });

}


module.exports = app;