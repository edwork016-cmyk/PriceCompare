const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// public papkasini ulash
app.use(express.static(path.join(__dirname, "public")));

// ================================
// BOSH SAHIFA
// ================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// QIDIRUV API
// ================================
app.get("/api/search", async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Qidiruv so'rovini kiriting"
        });
    }

    try {
        const response = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Product API xatosi");
        }

        const data = await response.json();

        const stores = ["Amazon", "DNS", "Ozon"];

        const products = data.products.map((product, index) => ({
            id: product.id,
            name: product.title,
            price: product.price,
            rating: product.rating || 0,
            image: product.thumbnail,
            category: product.category || "",
            brand: product.brand || "",
            store: stores[index % stores.length]
        }));

        res.json({
            success: true,
            query,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Search error:", error.message);

        res.status(500).json({
            success: false,
            message: "Mahsulotlarni yuklashda xatolik yuz berdi"
        });
    }
});

// Vercel uchun export
module.exports = app;

// Lokal kompyuterda ishlashi uchun
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`PriceCompare: http://localhost:${PORT}`);
    });
}