import { state } from "./state.js";
import { translations } from "./i18n-data.js";

// ============================================================
// TRANSLATION FUNCTION
// ============================================================

export function t(key) {
    return (
        translations[state.language]?.[key] ||
        translations.uz[key] ||
        key
    );
}

export const languageNames = {
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English"
};
