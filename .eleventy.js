const dateFilter = require("nunjucks-date");
const contentful = require("contentful");
require("dotenv").config();

const { BuildScripts } = require("./build/scripts.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", dateFilter);
  eleventyConfig.addFilter("prettyjson", (data) => {
    return JSON.stringify(data, undefined, 2);
  });
  eleventyConfig.addFilter("cleanSlug", function (value) {
    if (typeof value === "string") {
      return value
        .replace(/&#39;/g, "") // Removes HTML entities like &#39; (apostrophe)
        .replace(/[^\w\s-]/g, "") // Removes any non-alphanumeric characters except spaces and hyphens
        .trim()
        .replace(/\s+/g, "-") // Replaces spaces with hyphens
        .toLowerCase(); // Converts to lowercase
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
    return entries.items.map((item) => item.fields);
  });
  BuildScripts(eleventyConfig);

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
