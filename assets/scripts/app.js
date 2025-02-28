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

// Fix the import method for the PUG template

import ReviewCarousel from "./page-elements/review-carousel.js";
import SortTable from "./sort-table/index.js";
import parseHTML from "./utils/parse-html.js";
import productProcessor from "./sort-table/productProcessor.js";
import pugTemplate from "./sort-table/table.pug";

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
      const processedData = productProcessor(productData);
      if (processedData && processedData.length > 0) {
        // Use the correct template function
        const renderedTable = pugTemplate({ productData: processedData });
        els[0].appendChild(parseHTML(renderedTable));
        SortTable(els);
      } else {
        console.error("No product data available");
      }
    },
  },
  {
    element: "#review-carousel",
    action: ReviewCarousel,
  },
];
