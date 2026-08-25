import { state } from "./state.js";
import {
    compareNavBtn,
    compareSection,
    compareBackBtn,
    compareGoProducts,
    clearComparison,
    compareEmpty,
    compareTableWrap,
    compareTable
} from "./dom.js";
import { t } from "./i18n.js";
import { formatPrice } from "./currency.js";
import { escapeHtml } from "./utils.js";
import { getSourceName, renderProducts } from "./products.js";
import { updateCounts } from "./stats.js";

// ============================================================
// COMPARE
// ============================================================

window.toggleCompare = function (id) {
    id = String(id);

    const index = state.comparison.findIndex(
        product => String(product.id) === id
    );

    if (index !== -1) {
        state.comparison.splice(index, 1);
    } else {
        if (state.comparison.length >= 4) {
            alert(t("maximumCompare"));
            return;
        }

        const product = state.products.find(
            item => String(item.id) === id
        );

        if (!product) {
            return;
        }

        state.comparison.push(product);
    }

    localStorage.setItem(
        "pricecompare_comparison",
        JSON.stringify(state.comparison)
    );

    updateCounts();
    renderProducts();
    updateCompare();
};

// ============================================================
// COMPARE NAV
// ============================================================

if (compareNavBtn) {
    compareNavBtn.addEventListener("click", () => {
        compareSection?.classList.add("active");

        compareSection?.scrollIntoView({
            behavior: "smooth"
        });

        updateCompare();
    });
}

if (compareBackBtn) {
    compareBackBtn.addEventListener("click", () => {
        compareSection?.classList.remove("active");

        document
            .getElementById("productsSection")
            ?.scrollIntoView({ behavior: "smooth" });
    });
}

if (compareGoProducts) {
    compareGoProducts.addEventListener("click", () => {
        compareSection?.classList.remove("active");

        document
            .getElementById("productsSection")
            ?.scrollIntoView({ behavior: "smooth" });
    });
}

// ============================================================
// CLEAR COMPARE
// ============================================================

if (clearComparison) {
    clearComparison.addEventListener("click", () => {
        state.comparison = [];

        localStorage.setItem("pricecompare_comparison", "[]");

        updateCounts();
        updateCompare();
        renderProducts();
    });
}

// ============================================================
// UPDATE COMPARE
// ============================================================

export function updateCompare() {
    if (!compareEmpty || !compareTableWrap || !compareTable) {
        return;
    }

    const products = state.comparison;

    if (products.length < 2) {
        compareEmpty.style.display = "block";
        compareTableWrap.style.display = "none";
        return;
    }

    compareEmpty.style.display = "none";
    compareTableWrap.style.display = "block";

    compareTable.innerHTML = `

        <tr>
            <th>
                ${t("name")}
            </th>
            ${products
                .map(
                    product => `
                    <th>
                        ${escapeHtml(product.name)}
                    </th>
                    `
                )
                .join("")}
        </tr>

        <tr>
            <td>
                ${t("brand")}
            </td>
            ${products
                .map(
                    product => `
                    <td>
                        ${escapeHtml(product.brand || "-")}
                    </td>
                    `
                )
                .join("")}
        </tr>

        <tr>
            <td>
                ${t("price")}
            </td>
            ${products
                .map(
                    product => `
                    <td>
                        <strong>
                            ${formatPrice(product.price)}
                        </strong>
                    </td>
                    `
                )
                .join("")}
        </tr>

        <tr>
            <td>
                ${t("ratingLabel")}
            </td>
            ${products
                .map(
                    product => `
                    <td>
                        ${product.rating ? product.rating : "-"}
                    </td>
                    `
                )
                .join("")}
        </tr>

        <tr>
            <td>
                ${t("stock")}
            </td>
            ${products
                .map(
                    product => `
                    <td>
                        ${escapeHtml(product.stock || "-")}
                    </td>
                    `
                )
                .join("")}
        </tr>

        <tr>
            <td>
                ${t("store")}
            </td>
            ${products
                .map(
                    product => `
                    <td>
                        ${escapeHtml(getSourceName(product))}
                    </td>
                    `
                )
                .join("")}
        </tr>
    `;
}
