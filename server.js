const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Public papkasini ulash
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// API STATUS
// ==========================================
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "online",
        message: "PriceCompare API ishlayapti",
        sources: ["DummyJSON"]
    });
});

// ==========================================
// PRODUCT SEARCH API
// ==========================================
app.get("/api/search", async (req, res) => {
    const query = String(req.query.q || "").trim();

    if (!query) {
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
            throw new Error("DummyJSON API xatosi");
        }

        const data = await response.json();

        const products = (data.products || []).map((product) => ({
            id: `dummy-${product.id}`,
            name: product.title || "Noma'lum mahsulot",
            price: Number(product.price || 0),
            currency: "USD",
            rating: Number(product.rating || 0),
            image: product.thumbnail || "",
            category: product.category || "",
            brand: product.brand || "No brand",
            description: product.description || "",
            discountPercentage: Number(product.discountPercentage || 0),
            stock: Number(product.stock || 0),
            availabilityStatus: product.availabilityStatus || "Unknown",
            store: "Demo Catalog",
            url: `https://dummyjson.com/products/${product.id}`,
            source: "dummyjson"
        }));

        res.json({
            success: true,
            query,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Search error:", error);

        res.status(500).json({
            success: false,
            message: "Mahsulotlarni yuklashda xatolik yuz berdi"
        });
    }
});

// ==========================================
// LOCAL SERVER
// ==========================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`PriceCompare ishlayapti: http://localhost:${PORT}`);
    });
}

// Vercel uchun export
module.exports = app;