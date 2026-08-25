// ============================================================
// STATE
// ============================================================

export const currentCurrency = "UZS";
export const SHOW_HOMEPAGE_CURRENCY_KEY = "pricecompare_show_homepage_currency";

export const state = {
    products: [],
    filteredProducts: [],

    favorites: JSON.parse(
        localStorage.getItem("pricecompare_favorites") || "[]"
    ),

    comparison: [],

    language:
        localStorage.getItem("pricecompare_language") || "uz",

    currency:
        localStorage.getItem("pricecompare_currency") || currentCurrency,

    theme:
        localStorage.getItem("pricecompare_theme") || "light",

    showThemeWidget:
        localStorage.getItem("pricecompare_show_theme_widget") === "1",

    showHomepageCurrency:
        localStorage.getItem(SHOW_HOMEPAGE_CURRENCY_KEY) === "true"
};

const storedComparison = JSON.parse(
    localStorage.getItem("pricecompare_comparison") || "[]"
);

state.comparison = Array.isArray(storedComparison)
    ? storedComparison.filter(product => product && typeof product === "object")
    : [];

localStorage.setItem(
    "pricecompare_comparison",
    JSON.stringify(state.comparison)
);
