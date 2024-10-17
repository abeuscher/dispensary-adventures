require("dotenv").config();

const { BuildScripts } = require("./build/scripts.js");
const { BuildStyles } = require("./build/styles.js");
const { getFields } = require("./src/data/getFields.js");
const { addFilters } = require("./src/filters/index.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("src/macros/**");

  addFilters(eleventyConfig);
  getFields(eleventyConfig);

  eleventyConfig.addPassthroughCopy({ "src/public": "./" });
  console.log("WATCH_MODE", process.env.WATCH_MODE);
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
