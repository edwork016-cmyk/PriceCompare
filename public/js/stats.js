import { state } from "./state.js";
import { t } from "./i18n.js";
import { formatPrice } from "./currency.js";

// ============================================================
// STATS
// ============================================================

export function updateStats() {
    const products = state.filteredProducts || [];

    const countElement = document.getElementById("count");
    const sourcesElement = document.getElementById("favTotal");
    const averageElement = document.getElementById("avgPrice");

    if (countElement) {
        countElement.textContent = products.length;
    }

    const sources = new Set(
        products
            .map(product => product?.source)
            .filter(Boolean)
    );

    if (sourcesElement) {
        sourcesElement.textContent = sources.size;
    }

    const prices = products
        .map(product => Number(product?.price))
        .filter(price => Number.isFinite(price) && price > 0);

    if (!averageElement) {
        return;
    }

    if (!prices.length) {
        averageElement.textContent = t("priceUnavailable");
        return;
    }

    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    averageElement.textContent = formatPrice(average);
}

// ============================================================
// COUNTS
// ============================================================

export function updateCounts() {
    document
        .querySelectorAll("#favCount")
        .forEach(element => {
            element.textContent = state.favorites.length;
        });

    const compareCount = document.getElementById("compareCount");

    if (compareCount) {
        compareCount.textContent = state.comparison.length;
    }
}
