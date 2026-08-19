const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// ==============================================
// MIDDLEWARE
// ==============================================

app.use(cors());
app.use(express.json());


// ==============================================
// STATIC FILES
// ==============================================

app.use(express.static(__dirname));


// ==============================================
// OPEN FOOD FACTS
// ==============================================

const OPEN_FOOD_FACTS_URL =
    "https://world.openfoodfacts.org/cgi/search.pl";

const USER_AGENT =
    "PriceCompare/1.0 (PriceCompare project)";


// ==============================================
// EBAY SETTINGS
// ==============================================

const EBAY_CLIENT_ID =
    process.env.EBAY_CLIENT_ID || "";

const EBAY_CLIENT_SECRET =
    process.env.EBAY_CLIENT_SECRET || "";

const EBAY_MARKETPLACE_ID =
    process.env.EBAY_MARKETPLACE_ID || "EBAY_US";


// ==============================================
// EBAY TOKEN CACHE
// ==============================================

let ebayAccessToken = "";
let ebayTokenExpiresAt = 0;


// ==============================================
// GET EBAY ACCESS TOKEN
// ==============================================

async function getEbayAccessToken() {

    if (
        ebayAccessToken &&
        Date.now() < ebayTokenExpiresAt
    ) {
        return ebayAccessToken;
    }


    if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) {

        throw new Error(
            "EBAY_CLIENT_ID yoki EBAY_CLIENT_SECRET topilmadi"
        );

    }


    const credentials =
        Buffer.from(
            `${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`
        ).toString("base64");


    const response = await fetch(
        "https://api.ebay.com/identity/v1/oauth2/token",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",

                "Authorization":
                    `Basic ${credentials}`
            },

            body:
                new URLSearchParams({
                    grant_type:
                        "client_credentials",

                    scope:
                        "https://api.ebay.com/oauth/api_scope"
                })
        }
    );


    const data = await response.json();


    if (!response.ok) {

        console.error(
            "EBAY TOKEN ERROR:",
            data
        );

        throw new Error(
            data.error_description ||
            `eBay token error: ${response.status}`
        );

    }


    ebayAccessToken =
        data.access_token;


    ebayTokenExpiresAt =
        Date.now() +
        (
            Number(data.expires_in || 7200) - 60
        ) * 1000;


    return ebayAccessToken;

}


// ==============================================
// SEARCH OPEN FOOD FACTS
// ==============================================

async function searchOpenFoodFacts(query) {

    const url =
        new URL(OPEN_FOOD_FACTS_URL);


    url.searchParams.set(
        "search_terms",
        query
    );

    url.searchParams.set(
        "search_simple",
        "1"
    );

    url.searchParams.set(
        "action",
        "process"
    );

    url.searchParams.set(
        "json",
        "true"
    );

    url.searchParams.set(
        "page_size",
        "24"
    );

    url.searchParams.set(
        "fields",
        [
            "code",
            "product_name",
            "brands",
            "image_front_url",
            "image_url",
            "categories",
            "quantity",
            "nutriscore_grade"
        ].join(",")
    );


    const response =
        await fetch(
            url.toString(),
            {
                headers: {
                    "User-Agent": USER_AGENT,
                    "Accept": "application/json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Open Food Facts error: ${response.status}`
        );

    }


    const data =
        await response.json();


    return (data.products || [])

        .filter(
            product =>
                product.product_name
        )

        .map(product => ({

            id:
                `off-${product.code || Math.random()}`,

            name:
                product.product_name,

            price:
                0,

            currency:
                "USD",

            rating:
                getNutritionRating(
                    product.nutriscore_grade
                ),

            image:
                product.image_front_url ||
                product.image_url ||
                "",

            brand:
                product.brands ||
                "No brand",

            category:
                product.categories ||
                "Food",

            stock:
                product.quantity ||
                "-",

            store:
                "Open Food Facts",

            url:
                product.code
                    ? `https://world.openfoodfacts.org/product/${product.code}`
                    : "#",

            barcode:
                product.code || "",

            source:
                "openfoodfacts"

        }));

}


// ==============================================
// SEARCH EBAY
// ==============================================

async function searchEbay(query) {

    const token =
        await getEbayAccessToken();


    const url =
        new URL(
            "https://api.ebay.com/buy/browse/v1/item_summary/search"
        );


    url.searchParams.set(
        "q",
        query
    );

    url.searchParams.set(
        "limit",
        "24"
    );


    const response =
        await fetch(
            url.toString(),
            {
                headers: {

                    "Authorization":
                        `Bearer ${token}`,

                    "X-EBAY-C-MARKETPLACE-ID":
                        EBAY_MARKETPLACE_ID,

                    "Accept":
                        "application/json"

                }
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "EBAY SEARCH ERROR:",
            data
        );

        throw new Error(
            `eBay search error: ${response.status}`
        );

    }


    return (
        data.itemSummaries || []
    ).map(item => ({

        id:
            `ebay-${item.itemId}`,

        name:
            item.title ||
            "Noma'lum mahsulot",

        price:
            Number(
                item.price?.value || 0
            ),

        currency:
            item.price?.currency ||
            "USD",

        rating:
            0,

        image:
            item.image?.imageUrl ||
            "",

        brand:
            item.brand ||
            "eBay",

        category:
            item.categories?.[0]?.categoryName ||
            "Marketplace",

        stock:
            item.condition ||
            "-",

        store:
            "eBay",

        url:
            item.itemWebUrl ||
            "#",

        barcode:
            item.gtin ||
            "",

        source:
            "ebay"

    }));

}


// ==============================================
// API STATUS
// ==============================================

app.get(
    "/api/status",

    (req, res) => {

        res.json({

            success: true,

            status: "online",

            message:
                "PriceCompare API ishlayapti",

            sources: {

                openFoodFacts: true,

                ebay: {

                    configured:
                        Boolean(
                            EBAY_CLIENT_ID &&
                            EBAY_CLIENT_SECRET
                        ),

                    marketplace:
                        EBAY_MARKETPLACE_ID

                }

            }

        });

    }

);


// ==============================================
// COMBINED SEARCH
// ==============================================

app.get(
    "/api/search",

    async (req, res) => {

        const query =
            String(
                req.query.q || ""
            ).trim();


        if (!query) {

            return res.status(400).json({

                success: false,

                message:
                    "Qidiruv so'rovini kiriting"

            });

        }


        const results =
            await Promise.allSettled([

                searchEbay(query),

                searchOpenFoodFacts(query)

            ]);


        const ebayProducts =
            results[0].status === "fulfilled"
                ? results[0].value
                : [];


        const openFoodFactsProducts =
            results[1].status === "fulfilled"
                ? results[1].value
                : [];


        // Terminalda haqiqiy xatoni ko'rsatish
        if (results[0].status === "rejected") {

            console.error(
                "eBay error:",
                results[0].reason.message
            );

        }


        if (results[1].status === "rejected") {

            console.error(
                "Open Food Facts error:",
                results[1].reason.message
            );

        }


        const products = [

            ...ebayProducts,

            ...openFoodFactsProducts

        ];


        res.json({

            success: true,

            query,

            count:
                products.length,

            sources: {

                ebay:
                    ebayProducts.length,

                openFoodFacts:
                    openFoodFactsProducts.length

            },

            products

        });

    }

);


// ==============================================
// NUTRITION SCORE
// ==============================================

function getNutritionRating(grade) {

    const ratings = {

        a: 5,
        b: 4,
        c: 3,
        d: 2,
        e: 1

    };


    return ratings[
        String(grade || "").toLowerCase()
    ] || 0;

}


// ==============================================
// MAIN PAGE
// ==============================================

app.get(
    "/",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }

);


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
            "Source 1: Open Food Facts"
        );

        console.log(
            EBAY_CLIENT_ID &&
            EBAY_CLIENT_SECRET
                ? `Source 2: eBay configured (${EBAY_MARKETPLACE_ID})`
                : "Source 2: eBay NOT configured"
        );

        console.log(
            "======================================"
        );

        console.log("");

    });

}


module.exports = app;