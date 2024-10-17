const siteSettings = {
  imagePath: "",
  videoPath: "",
  templates: {},
  breakpoints: {
    xs: 0,
    s: 641,
    m: 1025,
    l: 1321,
    xl: 1921,
  },
};

const parseHTML = require("./utils/parse-html.js");
const productProcessor = require("./sort-table/productProcessor.js");
const widgetTemplates = {
  sortTable: require("./sort-table/table.pug"),
};
const ReviewCarousel = require("./page-elements/review-carousel.js");
const SortTable = require("./sort-table/index.js");

window.addEventListener("load", () => {
  for (const thisAction of siteActions) {
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(
        document.querySelectorAll(thisAction.element),
        siteSettings.scrollController,
      );
    }
  }
});

const siteActions = [
  {
    element: "#product-table-sortable",
    action: (els) => {
      productData = productProcessor(productData);
      if (typeof productData !== "undefined") {
        const renderedTable = widgetTemplates.sortTable({ productData });
        els[0].appendChild(parseHTML(renderedTable));
      }
      SortTable(els);
    },
  },
  {
    element: "#review-carousel",
    action: ReviewCarousel,
  },
  {
    element: "[data-bg]",
    action: require("./utils/data-bg.js"),
  },
  {
    element: "[data-bg-array]",
    action: require("./utils/data-bg-array.js"),
  },
];
