const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// public papkasidagi HTML, CSS va JS fayllarni ochish
app.use(express.static("public"));


// ==========================================
// QIDIRUV API
// Masalan: /api/search?q=iphone
// ==========================================

app.get("/api/search", async (req, res) => {

    const query = req.query.q;

    // Qidiruv bo'sh bo'lsa
    if (!query || query.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Qidiruv so'rovini kiriting"
        });
    }

    try {

        // Hozircha test uchun mahsulot API
        const response = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Product API xatosi");
        }

        const data = await response.json();

        // Demo do'konlar
        const stores = ["Amazon", "DNS", "Ozon"];

        // Mahsulotlarni bir xil formatga o'tkazamiz
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
            query: query,
            count: products.length,
            products: products
        });

    } catch (error) {

        console.error("Search error:", error.message);

        res.status(500).json({
            success: false,
            message: "Mahsulotlarni yuklashda xatolik yuz berdi"
        });

    }

});


// ==========================================
// SERVERNI ISHGA TUSHIRISH
// ==========================================

app.listen(PORT, () => {
    console.log("=================================");
    console.log("PriceCompare server ishladi!");
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");
});