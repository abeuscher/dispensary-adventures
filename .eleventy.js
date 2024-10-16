const dateFilter = require("nunjucks-date");
const contentful = require("contentful");

require("dotenv").config();

const { BuildScripts } = require("./build/scripts.js");
const { BuildStyles } = require("./build/styles.js");

module.exports = function (eleventyConfig) {
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
  // Contentful client
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  eleventyConfig.addCollection("reviewPost", async () => {
    const entries = await client.getEntries({
      content_type: "reviewPost",
      order: "sys.createdAt",
    });

    return entries.items.map((item) => {
      // Format the date using nunjucks-date (as 'YYYY/MM/DD')
      const formattedDate = dateFilter(item.fields.date, "yyyy/MM/DD");

      // Clean the slug (basic example)
      const cleanSlug = item.fields.slug
        .replace(/&#39;/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();

      // Add the permalink field to the item
      return {
        ...item.fields, // Spread the existing fields
        permalink: `/${formattedDate}/${cleanSlug}/`, // Add the permalink field
      };
    });
  });

  eleventyConfig.addPassthroughCopy({ "src/public": "./" });
  BuildStyles(eleventyConfig, process.env.WATCH_MODE === "true");
  BuildScripts(eleventyConfig, process.env.WATCH_MODE === "true");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "dist",
    },
    // Force Nunjucks for all template formats
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
