import { state } from "./state.js";
import { themeBtn, themePanel } from "./dom.js";
import { themeList } from "./themes-data.js";
import { renderSettingsPanel, renderMainThemeDropdown } from "./settings.js";

// ============================================================
// THEME BUTTON
// ============================================================

if (themeBtn && themePanel) {
    themeBtn.addEventListener("click", event => {
        event.stopPropagation();
        themePanel.classList.toggle("active");
    });
}

// ============================================================
// APPLY THEME
// ============================================================

export function applyTheme(theme) {
    const exists = themeList.some(item => item.id === theme);

    if (!exists) {
        theme = "light";
    }

    state.theme = theme;

    document.body.dataset.theme = theme;

    localStorage.setItem("pricecompare_theme", theme);

    syncQuickThemePanelActiveState();
    renderSettingsPanel();
    renderMainThemeDropdown();
}

// ============================================================
// QUICK THEME BUTTONS
// ============================================================

export function bindQuickThemeButtons() {
    document
        .querySelectorAll(".theme-option[data-theme]")
        .forEach(button => {
            button.addEventListener("click", () => {
                applyTheme(button.dataset.theme);
                themePanel?.classList.remove("active");
            });
        });
}

bindQuickThemeButtons();

// ============================================================
// SYNC THEME
// ============================================================

export function syncQuickThemePanelActiveState() {
    document
        .querySelectorAll(".theme-option[data-theme]")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.theme === state.theme
            );
        });
}

// ============================================================
// CLOSE THEME PANEL
// ============================================================

document.addEventListener("click", event => {
    if (
        themePanel &&
        !themePanel.contains(event.target) &&
        event.target !== themeBtn
    ) {
        themePanel.classList.remove("active");
    }
});
