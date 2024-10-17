const dateFilter = require("nunjucks-date");

const addFilters = (eleventyConfig) => {
  eleventyConfig.addFilter("date", dateFilter);
  eleventyConfig.addFilter("cleanLineBreaks", (str) => {
    return str.replace(/(\r\n|\n|\r)/gm, "");
  });
  eleventyConfig.addFilter("prettyjson", (data) => {
    return JSON.stringify(data, undefined, 2);
  });
  eleventyConfig.addFilter("stringify", (data) => {
    return JSON.stringify(data);
  });
  eleventyConfig.addFilter("cleanSlug", function (value) {
    if (typeof value === "string") {
      return value
        .replace(/&#39;/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    }
    return value;
  });

  eleventyConfig.addFilter("date", dateFilter);
  eleventyConfig.addFilter("cleanLineBreaks", (str) => {
    return str.replace(/(\r\n|\n|\r)/gm, "");
  });
  eleventyConfig.addFilter("prettyjson", (data) => {
    return JSON.stringify(data, undefined, 2);
  });
  eleventyConfig.addFilter("stringify", (data) => {
    return JSON.stringify(data);
  });
  eleventyConfig.addFilter("cleanSlug", function (value) {
    if (typeof value === "string") {
      return value
        .replace(/&#39;/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    }
    return value;
  });
  eleventyConfig.addFilter("getPrevNext", function (data, current) {
    let previousEntry = null;
    let nextEntry = null;

    data.forEach((item, index) => {
      if (item.slug === current.slug) {
        // Check if the index is within bounds before setting previous or next entries
        if (index > 0) {
          nextEntry = data[index - 1];
        }
        if (index < data.length - 1) {
          previousEntry = data[index + 1];
        }
      }
    });

    return { previousEntry, nextEntry };
  });
};

module.exports = { addFilters };
