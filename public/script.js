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
// PUBLIC FOLDER
// ==============================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


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

const EBAY_TOKEN_URL =
    "https://api.ebay.com/identity/v1/oauth2/token";

const EBAY_SEARCH_URL =
    "https://api.ebay.com/buy/browse/v1/item_summary/search";


// ==============================================
// EBAY TOKEN CACHE
// ==============================================

let ebayAccessToken = "";
let ebayTokenExpiresAt = 0;


// ==============================================
// GET EBAY ACCESS TOKEN
// ==============================================

async function getEbayAccessToken() {

    // Agar token hali yaroqli bo'lsa
    // qaytadan token so'ramaymiz.

    if (
        ebayAccessToken &&
        Date.now() < ebayTokenExpiresAt
    ) {

        return ebayAccessToken;

    }


    if (
        !EBAY_CLIENT_ID ||
        !EBAY_CLIENT_SECRET
    ) {

        throw new Error(
            "eBay Client ID yoki Client Secret topilmadi"
        );

    }


    const credentials =
        Buffer
            .from(
                `${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`
            )
            .toString("base64");


    const body =
        new URLSearchParams({

            grant_type:
                "client_credentials",

            scope:
                "https://api.ebay.com/oauth/api_scope"

        });


    const response =
        await fetch(
            EBAY_TOKEN_URL,
            {

                method:
                    "POST",

                headers: {

                    "Authorization":
                        `Basic ${credentials}`,

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    body.toString()

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "eBay token error:",
            data
        );

        throw new Error(
            data.error_description ||
            data.message ||
            "eBay token olishda xatolik"
        );

    }


    ebayAccessToken =
        data.access_token;


    // Token tugashidan 60 soniya oldin
    // yangisini olish uchun cache vaqtini qisqartiramiz.

    const expiresIn =
        Number(data.expires_in || 7200);


    ebayTokenExpiresAt =
        Date.now() +
        ((expiresIn - 60) * 1000);


    console.log(
        "eBay access token muvaffaqiyatli olindi"
    );


    return ebayAccessToken;

}


// ==============================================
// EBAY SEARCH
// ==============================================

async function searchEbay(query) {

    const token =
        await getEbayAccessToken();


    const url =
        new URL(
            EBAY_SEARCH_URL
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
            "eBay search error:",
            data
        );

        throw new Error(
            data.errors?.[0]?.message ||
            data.message ||
            `eBay API xatosi: ${response.status}`
        );

    }


    const items =
        Array.isArray(data.itemSummaries)
            ? data.itemSummaries
            : [];


    return items.map(item => ({

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
            item.thumbnailImages?.[0]?.imageUrl ||
            "",


        brand:
            item.brand ||
            "No brand",


        category:
            item.categories?.[0]?.categoryName ||
            "—",


        stock:
            item.availabilityStatus ||
            "—",


        store:
            "eBay",


        url:
            item.itemWebUrl ||
            "#",


        source:
            "ebay"

    }));

}


// ==============================================
// OPEN FOOD FACTS SEARCH
// ==============================================

async function searchOpenFoodFacts(query) {

    const url =
        new URL(
            OPEN_FOOD_FACTS_URL
        );


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

                    "User-Agent":
                        USER_AGENT,

                    "Accept":
                        "application/json"

                }

            }
        );


    if (!response.ok) {

        throw new Error(
            `Open Food Facts API xatosi: ${response.status}`
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
                `off-${product.code}`,


            name:
                product.product_name ||
                "Noma'lum mahsulot",


            // Open Food Facts narx bermaydi
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
                product.code ||
                "",


            source:
                "openfoodfacts"

        }));

}


// ==============================================
// API STATUS
// ==============================================

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

                openFoodFacts:
                    true,

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
// COMBINED SEARCH API
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

                success:
                    false,

                message:
                    "Qidiruv so'rovini kiriting"

            });

        }


        console.log(
            `Qidiruv: ${query}`
        );


        // Har ikkala API ni bir vaqtda ishga tushiramiz

        const results =
            await Promise.allSettled([

                searchEbay(query),

                searchOpenFoodFacts(query)

            ]);


        // ==========================================
        // EBAY RESULT
        // ==========================================

        let ebayProducts = [];


        if (
            results[0].status === "fulfilled"
        ) {

            ebayProducts =
                results[0].value;

        }

        else {

            console.error(
                "eBay ishlamadi:",
                results[0].reason?.message
            );

        }


        // ==========================================
        // OPEN FOOD FACTS RESULT
        // ==========================================

        let openFoodFactsProducts = [];


        if (
            results[1].status === "fulfilled"
        ) {

            openFoodFactsProducts =
                results[1].value;

        }

        else {

            console.error(
                "Open Food Facts ishlamadi:",
                results[1].reason?.message
            );

        }


        // ==========================================
        // COMBINE
        // ==========================================

        const products = [

            ...ebayProducts,

            ...openFoodFactsProducts

        ];


        res.json({

            success:
                true,

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
// NUTRITION SCORE -> RATING
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
        String(
            grade || ""
        ).toLowerCase()
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
                "public",
                "index.html"
            )
        );

    }

);


// ==============================================
// START SERVER
// ==============================================

if (require.main === module) {

    app.listen(
        PORT,

        () => {

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

        }

    );

}


// ==============================================
// VERCEL EXPORT
// ==============================================

module.exports = app;