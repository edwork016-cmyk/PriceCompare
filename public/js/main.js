import { state } from "./state.js";
import {
    languageSelect,
    themePanel,
    mainThemeDropdown,
    favoritesModal,
    settingsModal,
    sortSelect,
    searchInput,
    searchButton
} from "./dom.js";
import { t } from "./i18n.js";
import { renderProducts } from "./products.js";
import { updateStats, updateCounts } from "./stats.js";
import { updateCompare } from "./compare.js";
import { renderSettingsPanel, renderMainThemeDropdown, applyMainControlsVisibility } from "./settings.js";
import { syncQuickThemePanelActiveState } from "./theme.js";
import { resetPriceControls, updatePriceText } from "./filters.js";

// Modules imported only for their side effects (they wire up their own
// DOM event listeners at the top level, same as the original single-file script).
import "./search.js";
import "./favorites.js";
import "./compare.js";
import "./theme.js";
import "./settings.js";

// ============================================================
// INIT
// ============================================================

function init() {
    document.body.dataset.theme = state.theme;

    if (languageSelect) {
        languageSelect.value = state.language;
    }

    state.products = [];
    state.filteredProducts = [];

    updateTranslations();
    updateCounts();
    updateStats();
    updateCompare();
    renderSettingsPanel();
    syncQuickThemePanelActiveState();
    renderMainThemeDropdown();
    applyMainControlsVisibility();
    resetPriceControls();
}

init();

// ============================================================
// UPDATE TRANSLATIONS
// ============================================================

export function updateTranslations() {
    const setText = (id, key) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = t(key);
        }
    };

    setText("heroTitle", "heroTitle");
    setText("heroText", "heroText");
    setText("clearText", "clear");
    setText("productsText", "products");
    setText("sourcesText", "sources");
    setText("averageText", "average");
    setText("favoritesText", "favorites");
    setText("compareTitle", "compareTitle");
    setText("compareSubtitle", "compareSubtitle");
    setText("compareBackText", "back");
    setText("clearCompareText", "clearCompare");
    setText("compareEmptyTitle", "emptyCompare");
    setText("compareEmptyText", "emptyCompareText");
    setText("compareGoProductsText", "showProducts");
    setText("favoritesTitle", "favoritesTitle");

    if (searchInput) {
        searchInput.placeholder = t("search");
    }

    if (searchButton) {
        searchButton.innerHTML = `<i class="fa-solid fa-search"></i> ${t("searchButton")}`;
    }

    setText("allThemesText", "allThemes");
    setText("settingsTitle", "settings");
    setText("settingsLanguageLabel", "language");
    setText("settingsCurrencyLabel", "currency");
    setText("settingsThemeLabel", "themes");
    setText("settingsMainControlsLabel", "mainPageControls");
    setText("toggleThemeWidgetText", "showThemeWidget");
    setText("toggleHomepageCurrencyText", "showHomepageCurrency");

    // Select labels
    updateSortOptions();

    if (state.products.length) {
        renderProducts();
    }

    renderSettingsPanel();
    renderMainThemeDropdown();
    updatePriceText();
}

// ============================================================
// SORT OPTIONS
// ============================================================

function updateSortOptions() {
    if (!sortSelect) {
        return;
    }

    const current = sortSelect.value || "cheap";

    sortSelect.innerHTML = `
        <option value="cheap">
            ${t("cheap")}
        </option>

        <option value="expensive">
            ${t("expensive")}
        </option>

        <option value="rating">
            ${t("rating")}
        </option>
    `;

    sortSelect.value = current;
}

// ============================================================
// KEYBOARD ESC
// ============================================================

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") {
        return;
    }

    themePanel?.classList.remove("active");
    mainThemeDropdown?.classList.remove("active");
    favoritesModal?.classList.remove("active");
    settingsModal?.classList.remove("active");
});

// ============================================================
// FINAL INITIALIZATION
// ============================================================

updatePriceText();
updateCounts();
updateStats();
syncQuickThemePanelActiveState();
applyMainControlsVisibility();

// ============================================================
// DEBUG
// ============================================================

console.log("PriceCompare frontend loaded successfully.");
