import { state } from "./state.js";
import { currencyRates, currencySymbols, uzsSymbol } from "./currency-data.js";
import { t } from "./i18n.js";

// ============================================================
// FORMAT PRICE
// ============================================================

export function formatPrice(uzs) {
    const number = Number(uzs);

    if (!Number.isFinite(number) || number <= 0) {
        return t("priceUnavailable");
    }

    const value = convertFromUZS(number);
    const decimals = state.currency === "UZS" || state.currency === "JPY" ? 0 : 2;

    return (
        new Intl.NumberFormat(
            "ru-RU",
            {
                maximumFractionDigits: decimals
            }
        ).format(value)
        +
        " "
        +
        currencySymbols[state.currency] || uzsSymbol
    );
}

export function convertFromUZS(uzs) {
    const value = Number(uzs);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return value * (currencyRates[state.currency] || 1);
}
