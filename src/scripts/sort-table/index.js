function SortTable(tables) {
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const categoryMenu = table.querySelector(".category-sort");
        const directionMenu = table.querySelector(".sort-direction");

        categoryMenu.addEventListener("change", handleSort);
        directionMenu.addEventListener("change", handleSort);

        function handleSort() {
            const selectedCategory = JSON.parse(categoryMenu.options[categoryMenu.selectedIndex].value);
            const isAscending = directionMenu.value === "true";
            doSort(isAscending, selectedCategory.label.toLowerCase().replace(/\W/g, ''), table, selectedCategory.type);
        }
    }
}

function doSort(ascending, columnClassName, el, dataType) {
    const tbody = el.querySelector(".table-body");
    const rows = Array.from(tbody.querySelectorAll(".table-row"));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`.${columnClassName}`).textContent;
        const bValue = b.querySelector(`.${columnClassName}`).textContent;

        switch (dataType) {
            case "number":
                return compareNumbers(aValue, bValue, ascending);
            case "date":
                return compareDates(aValue, bValue, ascending);
            default:
                return compareStrings(aValue, bValue, ascending);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

function compareNumbers(a, b, ascending) {
    const aNum = cleanNumber(a);
    const bNum = cleanNumber(b);
    return ascending ? aNum - bNum : bNum - aNum;
}

function compareDates(a, b, ascending) {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return ascending ? aDate - bDate : bDate - aDate;
}

function compareStrings(a, b, ascending) {
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
}

function cleanNumber(n) {
    return parseFloat(n.replace(/[$%]/g, ""));
}

module.exports = SortTable;