export default function generateProductTable(productData) {
  if (productData === undefined) {
    const noProductsMessage = document.createElement("p");
    noProductsMessage.textContent = "No products to display";
    return noProductsMessage;
  }

  const products = productData;
  const gridTable = document.createElement("div");
  gridTable.classList.add("grid-table", "sortable");

  // Table controls
  const tableControls = document.createElement("div");
  tableControls.classList.add("table-controls");
  const innerControls = document.createElement("div");
  innerControls.classList.add("inner");

  // Create Sort By label
  const sortLabel = document.createElement("label");
  sortLabel.setAttribute("for", "category-sort");
  sortLabel.textContent = "Sort By:";
  innerControls.appendChild(sortLabel);

  // Sort category select
  const categorySortSelect = document.createElement("select");
  categorySortSelect.classList.add("category-sort");
  Object.keys(products[0]).forEach((option, idx) => {
    const optionElement = document.createElement("option");
    optionElement.value = JSON.stringify(option);
    optionElement.dataset.idx = idx;
    optionElement.textContent = products[0][option].label;
    if (products[0][option].default) {
      optionElement.selected = true;
    }
    categorySortSelect.appendChild(optionElement);
  });
  innerControls.appendChild(categorySortSelect);

  // Sort direction select
  const sortDirectionSelect = document.createElement("select");
  sortDirectionSelect.classList.add("sort-direction");
  const ascOption = document.createElement("option");
  ascOption.selected = true;
  ascOption.value = "true";
  ascOption.textContent = "asc";
  const descOption = document.createElement("option");
  descOption.value = "false";
  descOption.textContent = "desc";
  sortDirectionSelect.appendChild(ascOption);
  sortDirectionSelect.appendChild(descOption);
  innerControls.appendChild(sortDirectionSelect);

  tableControls.appendChild(innerControls);
  gridTable.appendChild(tableControls);

  // Table Header
  const tableHeader = document.createElement("div");
  tableHeader.classList.add("table-header");

  const headerRow1 = document.createElement("div");
  headerRow1.classList.add("table-header-row", "table-row", "header-header");

  const sourceHeader = document.createElement("div");
  sourceHeader.classList.add("table-header-cell", "table-cell", "source-header");
  sourceHeader.colSpan = 3;
  const sourceP = document.createElement("p");
  sourceP.textContent = "Source";
  sourceHeader.appendChild(sourceP);
  headerRow1.appendChild(sourceHeader);

  const deetsHeader = document.createElement("div");
  deetsHeader.classList.add("table-header-cell", "table-cell", "details-header");
  deetsHeader.colSpan = 5;
  const deetsP = document.createElement("p");
  deetsP.textContent = "Deets";
  deetsHeader.appendChild(deetsP);
  headerRow1.appendChild(deetsHeader);

  const scoreHeader = document.createElement("div");
  scoreHeader.classList.add("table-header-cell", "table-cell", "score-header");
  scoreHeader.colSpan = 4;
  const scoreP = document.createElement("p");
  scoreP.textContent = "Scores";
  scoreHeader.appendChild(scoreP);
  headerRow1.appendChild(scoreHeader);

  tableHeader.appendChild(headerRow1);

  // Dynamic header row
  const headerRow2 = document.createElement("div");
  headerRow2.classList.add("table-header-row", "table-row");
  products[0].forEach((header) => {
    const headerCell = document.createElement("div");
    headerCell.classList.add(
      "table-header-cell",
      "table-cell",
      header.mobile ? header.type : `${header.type} hide-mobile`,
      header.score ? "score" : "",
    );
    const headerP = document.createElement("p");
    headerP.textContent = header.label;
    headerCell.appendChild(headerP);
    headerRow2.appendChild(headerCell);
  });
  tableHeader.appendChild(headerRow2);
  gridTable.appendChild(tableHeader);

  // Table Body
  const tableBody = document.createElement("div");
  tableBody.classList.add("table-body");

  products.forEach((product) => {
    const bodyRow = document.createElement("div");
    bodyRow.classList.add("table-body-row", "table-row");

    Object.values(product).forEach((item) => {
      const bodyCell = document.createElement("div");
      bodyCell.classList.add(
        "table-body-cell",
        "table-cell",
        item.mobile ? item.type : `${item.type} hide-mobile`,
        item.score ? "score" : "",
      );

      const contentElement = document.createElement(item.link ? "a" : "p");
      if (item.link) {
        contentElement.setAttribute("href", item.link);
      }
      contentElement.classList.add(item.label.toLowerCase().replace(/\W/g, ""));
      contentElement.textContent = item.value;

      bodyCell.appendChild(contentElement);
      bodyRow.appendChild(bodyCell);
    });

    tableBody.appendChild(bodyRow);
  });

  gridTable.appendChild(tableBody);

  return gridTable;
}
