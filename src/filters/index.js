const nunjucks = require("nunjucks");
const dateFilter = require("nunjucks-date");
const markdownIt = require("markdown-it");
const markdownLib = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

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
  eleventyConfig.addFilter("cleanJSONLD", function (value, spaces = 0) {
    if (!value) return value;

    // Convert SafeString instances to regular strings
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }

    // Handle strings and escape special JSON characters
    if (typeof value === "string") {
      // Escaping problematic characters
      value = value
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/"/g, '\\"') // Escape double quotes
        .replace(/\n/g, "\\n") // Escape newlines
        .replace(/\r/g, "\\r"); // Escape carriage returns
    }

    // Convert to JSON string and ensure '<' characters are safe
    const jsonString = JSON.stringify(value, null, spaces).replace(/</g, "\\u003c");

    // Return the sanitized and marked safe string
    return nunjucks.runtime.markSafe(jsonString);
  });
  eleventyConfig.addFilter("divideScore", function (score) {
    return (score / 3).toFixed(0);
  });

  eleventyConfig.addFilter("markdownify", (content) => {
    return markdownLib.render(content || ""); // Convert Markdown to HTML
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
