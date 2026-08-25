import { state } from "./state.js";
import { priceRange, priceInput, priceDisplay, clearFilters, sortSelect } from "./dom.js";
import { currencySymbols, uzsSymbol } from "./currency-data.js";
import { convertFromUZS } from "./currency.js";
import { renderProducts } from "./products.js";
import { updateStats } from "./stats.js";

let isSyncingPriceControls = false;

// ============================================================
// SORT
// ============================================================

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        renderProducts();
        updateStats();
    });
}

// ============================================================
// FORMAT PRICE INPUT
// ============================================================

export function formatPriceValue(value) {
    const numericValue = Math.max(0, Math.round(Number(value || 0)));

    return (
        new Intl.NumberFormat("ru-RU").format(numericValue)
        + " "
        + (currencySymbols[state.currency] || uzsSymbol)
    );
}

// ============================================================
// UPDATE PRICE TEXT
// ============================================================

export function updatePriceText() {
    if (!priceRange) {
        return;
    }

    const max = Number(priceRange.max || 2000000);

    let value = Number(priceRange.value || max);

    if (!Number.isFinite(value) || value < 0) {
        value = max;
    }

    value = Math.min(value, max);

    priceRange.value = String(value);

    if (priceInput) {
        priceInput.value = formatPriceValue(value);
    }

    if (priceDisplay) {
        priceDisplay.textContent = "≤";
    }

    const percent = max > 0 ? (value / max) * 100 : 100;

    priceRange.style.setProperty(
        "--value",
        `${Math.min(100, Math.max(0, percent))}%`
    );
}

// ============================================================
// RESET PRICE CONTROLS
// ============================================================

export function resetPriceControls() {
    if (!priceRange) {
        return;
    }

    priceRange.max = "2000000";
    priceRange.value = "2000000";

    updatePriceText();
}

// ============================================================
// SET PRICE RANGE FROM PRODUCTS
// ============================================================

export function setPriceRangeFromProducts() {
    if (!priceRange) {
        return;
    }

    const prices = state.products
        .map(product => Number(product?.price))
        .filter(price => Number.isFinite(price) && price > 0);

    if (!prices.length) {
        resetPriceControls();
        return;
    }

    const maxUZS = Math.ceil(Math.max(...prices) / 100000) * 100000;

    const finalMax = Math.max(Math.ceil(convertFromUZS(maxUZS)), 1);

    priceRange.max = String(finalMax);
    priceRange.value = String(finalMax);

    updatePriceText();
}

// ============================================================
// PRICE RANGE INPUT
// ============================================================

if (priceRange) {
    priceRange.addEventListener("input", () => {
        if (isSyncingPriceControls) {
            return;
        }

        const max = Number(priceRange.max || 2000000);

        let value = Number(priceRange.value);

        if (!Number.isFinite(value)) {
            value = max;
        }

        value = Math.max(0, Math.min(value, max));

        isSyncingPriceControls = true;

        priceRange.value = String(value);

        if (priceInput) {
            priceInput.value = formatPriceValue(value);
        }

        isSyncingPriceControls = false;

        renderProducts();
        updateStats();
    });
}

// ============================================================
// PRICE INPUT
// ============================================================

if (priceInput) {
    priceInput.addEventListener("input", () => {
        if (isSyncingPriceControls) {
            return;
        }

        const max = Number(priceRange?.max || 2000000);

        const digits = String(priceInput.value).replace(/\D/g, "");

        let value = digits ? Number(digits) : 0;

        if (!Number.isFinite(value) || value < 0) {
            value = 0;
        }

        value = Math.min(value, max);

        isSyncingPriceControls = true;

        if (priceRange) {
            priceRange.value = String(value);
        }

        priceInput.value = formatPriceValue(value);

        isSyncingPriceControls = false;

        renderProducts();
        updateStats();
    });
}

// ============================================================
// CLEAR FILTERS
// ============================================================

if (clearFilters) {
    clearFilters.addEventListener("click", () => {
        if (sortSelect) {
            sortSelect.value = "cheap";
        }

        if (state.products.length) {
            setPriceRangeFromProducts();
        } else {
            resetPriceControls();
        }

        renderProducts();
        updateStats();
    });
}
