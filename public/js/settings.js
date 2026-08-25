import { state, SHOW_HOMEPAGE_CURRENCY_KEY } from "./state.js";
import {
    languageSelect,
    mainCurrencyControl,
    mainCurrencySelect,
    themePanel,
    settingsBtn,
    settingsModal,
    closeSettingsModal,
    openAllThemesBtn,
    settingsLanguageOptions,
    settingsThemeOptions,
    settingsCurrencyOptions,
    mainThemeControl,
    mainThemeBtn,
    mainThemeDropdown,
    toggleThemeWidget,
    toggleHomepageCurrency
} from "./dom.js";
import { t, languageNames } from "./i18n.js";
import { currencyNames, currencySymbols } from "./currency-data.js";
import { themeList, themePreviewColors } from "./themes-data.js";
import { applyTheme } from "./theme.js";
import { renderProducts } from "./products.js";
import { updateStats } from "./stats.js";
import { updateCompare } from "./compare.js";
import { setPriceRangeFromProducts, resetPriceControls } from "./filters.js";
import { updateTranslations } from "./main.js";

// ============================================================
// CURRENCY CHANGE
// ============================================================

export function applyCurrencyChange() {
    if (state.products.length) {
        setPriceRangeFromProducts();
    } else {
        resetPriceControls();
    }

    renderProducts();
    updateStats();
    updateCompare();
}

if (mainCurrencySelect) {
    mainCurrencySelect.value = state.currency;
    mainCurrencySelect.addEventListener("change", () => {
        state.currency = mainCurrencySelect.value;
        localStorage.setItem("pricecompare_currency", state.currency);
        applyCurrencyChange();
        renderSettingsPanel();
    });
}

// ============================================================
// LANGUAGE
// ============================================================

if (languageSelect) {
    languageSelect.addEventListener("change", () => {
        state.language = languageSelect.value;

        localStorage.setItem("pricecompare_language", state.language);

        updateTranslations();
    });
}

// ============================================================
// SETTINGS MODAL
// ============================================================

if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener("click", () => {
        renderSettingsPanel();
        settingsModal.classList.add("active");
    });
}

if (closeSettingsModal && settingsModal) {
    closeSettingsModal.addEventListener("click", () => {
        settingsModal.classList.remove("active");
    });
}

if (settingsModal) {
    settingsModal.addEventListener("click", event => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });
}

// ============================================================
// OPEN ALL THEMES
// ============================================================

if (openAllThemesBtn) {
    openAllThemesBtn.addEventListener("click", () => {
        themePanel?.classList.remove("active");

        renderSettingsPanel();

        settingsModal?.classList.add("active");

        const themeSection = settingsThemeOptions?.closest(".settings-section");

        if (themeSection) {
            themeSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

// ============================================================
// SETTINGS PANEL
// ============================================================

export function renderSettingsPanel() {
    // ========================================================
    // LANGUAGE
    // ========================================================

    if (settingsLanguageOptions) {
        settingsLanguageOptions.innerHTML = Object.keys(languageNames)
            .map(
                code => `
                    <button
                        type="button"
                        class="settings-option ${code === state.language ? "active" : ""}"
                        data-lang="${code}"
                    >

                        <span>
                            ${languageNames[code]}
                        </span>

                        <i
                            class="fa-solid fa-check check-icon"
                        ></i>

                    </button>
                `
            )
            .join("");

        settingsLanguageOptions
            .querySelectorAll("[data-lang]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    state.language = button.dataset.lang;

                    if (languageSelect) {
                        languageSelect.value = state.language;
                    }

                    localStorage.setItem("pricecompare_language", state.language);

                    updateTranslations();
                });
            });
    }

    if (settingsCurrencyOptions) {
        const names = currencyNames[state.language] || currencyNames.uz;

        settingsCurrencyOptions.innerHTML = Object.keys(currencySymbols)
            .map(code => `
                <button type="button" class="settings-option ${
                    code === state.currency ? "active" : ""
                }" data-currency="${code}">
                    <span>${names[code] || code}</span>
                    <i class="fa-solid fa-check check-icon"></i>
                </button>
            `)
            .join("");

        settingsCurrencyOptions.querySelectorAll("[data-currency]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    state.currency = button.dataset.currency;
                    localStorage.setItem("pricecompare_currency", state.currency);
                    if (mainCurrencySelect) {
                        mainCurrencySelect.value = state.currency;
                    }
                    applyCurrencyChange();
                    renderSettingsPanel();
                });
            });
    }

    // ========================================================
    // THEMES
    // ========================================================

    if (settingsThemeOptions) {
        settingsThemeOptions.innerHTML = themeList
            .map(theme => {
                const colors = themePreviewColors[theme.id] || ["#000", "#666", "#333"];
                const active = theme.id === state.theme;

                return `
                    <button
                        type="button"
                        class="theme-swatch ${active ? "active" : ""}"
                        data-theme-select="${theme.id}"
                    >

                        <div
                            class="swatch-preview"
                        >
                            <span style="background:${colors[0]}"></span>
                            <span style="background:${colors[1]}"></span>
                            <span style="background:${colors[2]}"></span>
                        </div>

                        <div
                            class="swatch-name"
                        >
                            <span>
                                <i class="fa-solid ${theme.icon}"></i>
                                ${theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}
                            </span>

                            <i class="fa-solid fa-check"></i>
                        </div>

                    </button>
                `;
            })
            .join("");

        settingsThemeOptions
            .querySelectorAll("[data-theme-select]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    applyTheme(button.dataset.themeSelect);
                });
            });
    }
}

// ============================================================
// MAIN PAGE CONTROLS
// ============================================================

export function applyMainControlsVisibility() {
    if (mainThemeControl) {
        mainThemeControl.hidden = !state.showThemeWidget;

        if (!state.showThemeWidget && mainThemeDropdown) {
            mainThemeDropdown.classList.remove("active");
        }
    }

    if (mainCurrencyControl) {
        mainCurrencyControl.hidden = !state.showHomepageCurrency;
    }

    if (toggleThemeWidget) {
        toggleThemeWidget.classList.toggle("active", state.showThemeWidget);
    }

    if (toggleHomepageCurrency) {
        toggleHomepageCurrency.classList.toggle("active", state.showHomepageCurrency);
    }
}

// ============================================================
// MAIN THEME DROPDOWN
// ============================================================

export function renderMainThemeDropdown() {
    if (!mainThemeDropdown) {
        return;
    }

    mainThemeDropdown.innerHTML = themeList
        .map(theme => {
            const colors = themePreviewColors[theme.id] || ["#000", "#666", "#333"];
            const active = theme.id === state.theme;

            return `
                <button
                    type="button"
                    class="main-theme-dropdown-item ${active ? "active" : ""}"
                    data-main-theme-select="${theme.id}"
                >
                    <span class="swatch-dot" style="background:${colors[1]}"></span>
                    <span>
                        ${theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}
                    </span>
                </button>
            `;
        })
        .join("");

    mainThemeDropdown
        .querySelectorAll("[data-main-theme-select]")
        .forEach(button => {
            button.addEventListener("click", () => {
                applyTheme(button.dataset.mainThemeSelect);
                mainThemeDropdown.classList.remove("active");
            });
        });
}

// ============================================================
// MAIN THEME BUTTON
// ============================================================

if (mainThemeBtn && mainThemeDropdown) {
    mainThemeBtn.addEventListener("click", event => {
        event.stopPropagation();
        mainThemeDropdown.classList.toggle("active");
    });

    document.addEventListener("click", event => {
        if (
            !mainThemeDropdown.contains(event.target) &&
            event.target !== mainThemeBtn
        ) {
            mainThemeDropdown.classList.remove("active");
        }
    });
}

// ============================================================
// TOGGLE THEME WIDGET
// ============================================================

if (toggleThemeWidget) {
    toggleThemeWidget.addEventListener("click", () => {
        state.showThemeWidget = !state.showThemeWidget;

        localStorage.setItem(
            "pricecompare_show_theme_widget",
            state.showThemeWidget ? "1" : "0"
        );

        applyMainControlsVisibility();
    });
}

if (toggleHomepageCurrency) {
    toggleHomepageCurrency.addEventListener("click", () => {
        state.showHomepageCurrency = !state.showHomepageCurrency;
        localStorage.setItem(
            SHOW_HOMEPAGE_CURRENCY_KEY,
            String(state.showHomepageCurrency)
        );
        applyMainControlsVisibility();
    });
}
