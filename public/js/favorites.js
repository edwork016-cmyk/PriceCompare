import { state } from "./state.js";
import { favoritesBtn, favoritesModal, closeModal, favoritesList } from "./dom.js";
import { t } from "./i18n.js";
import { formatPrice } from "./currency.js";
import { escapeHtml, escapeJs } from "./utils.js";
import { getImageUrl, renderProducts } from "./products.js";
import { updateCounts } from "./stats.js";

// ============================================================
// FAVORITES
// ============================================================

window.toggleFavorite = function (id) {
    id = String(id);

    const index = state.favorites.indexOf(id);

    if (index === -1) {
        state.favorites.push(id);
    } else {
        state.favorites.splice(index, 1);
    }

    localStorage.setItem(
        "pricecompare_favorites",
        JSON.stringify(state.favorites)
    );

    updateCounts();
    renderProducts();
    renderFavorites();
};

// ============================================================
// FAVORITES MODAL
// ============================================================

if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
        renderFavorites();
        favoritesModal?.classList.add("active");
    });
}

if (closeModal) {
    closeModal.addEventListener("click", () => {
        favoritesModal?.classList.remove("active");
    });
}

if (favoritesModal) {
    favoritesModal.addEventListener("click", event => {
        if (event.target === favoritesModal) {
            favoritesModal.classList.remove("active");
        }
    });
}

// ============================================================
// RENDER FAVORITES
// ============================================================

export function renderFavorites() {
    if (!favoritesList) {
        return;
    }

    const items = state.products.filter(
        product => state.favorites.includes(String(product.id))
    );

    if (!items.length) {
        favoritesList.innerHTML = `
            <div class="empty-message">
                ${t("noFavorites")}
            </div>
        `;

        return;
    }

    favoritesList.innerHTML = items
        .map(product => {
            const image = getImageUrl(product);

            return `
                <div
                    class="favorite-item"
                >

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(product.name)}"
                                >
                            `
                            : `
                                <div
                                    style="
                                        width:70px;
                                        height:70px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                    "
                                >
                                    <i
                                        class="fa-solid fa-image"
                                    ></i>
                                </div>
                            `
                    }

                    <div
                        class="favorite-item-info"
                    >

                        <strong>
                            ${escapeHtml(product.name)}
                        </strong>

                        <span>
                            ${formatPrice(product.price)}
                        </span>

                    </div>

                    <button
                        type="button"
                        onclick="toggleFavorite('${escapeJs(product.id)}')"
                        title="${t("remove")}"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </div>
            `;
        })
        .join("");
}
