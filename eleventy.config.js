import { HtmlBasePlugin, IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";

import BuildScripts from "./build/scripts.js";
import BuildStyles from "./build/styles.js";
import addFilters from "./config/filters.js";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import htmlmin from "html-minifier";

console.log("eleventy start");

export default async function (eleventyConfig) {
  // Add filters from separate module
  addFilters(eleventyConfig);

  // Add standard plugins
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Passthrough copy
  // Static asset handling
  eleventyConfig.addPassthroughCopy({ "public/": "/" });
  eleventyConfig.addPassthroughCopy({ "assets/images/": "/images/" });

  // Collections
  eleventyConfig.addCollection("reviews", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/**/*.md").sort((a, b) => {
      // Sort by date descending
      return new Date(b.data.date || 0) - new Date(a.data.date || 0);
    });
  });
  eleventyConfig.addGlobalData("site", {
    url: "https://dispensaryadventures.com",
  });
  // HTML minification
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath?.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
        minifyJS: true,
      });
    }
    return content;
  });

  // Watch for changes to scripts and styles
  eleventyConfig.addWatchTarget("./scripts/**/*.js");
  eleventyConfig.addWatchTarget("./styles/**/*.scss");

  // Build scripts and styles
  BuildStyles(eleventyConfig);
  BuildScripts(eleventyConfig);

  // Debug events
  eleventyConfig.on("eleventy.before", () => {
    console.log("Starting Eleventy build...");
  });

  eleventyConfig.on("eleventy.after", ({ results }) => {
    console.log("=== BUILD COMPLETE ===");
    console.log(`Generated ${results.length} files`);

    // Log collection information
    const collections = results.collections || {};
    console.log("Collections summary:");
    Object.keys(collections).forEach((key) => {
      console.log(`- ${key}: ${collections[key]?.length || 0} items`);
    });
  });

  return {};
}

export const config = {
  templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  dir: {
    input: "content",
    includes: "../_includes",
    layouts: "../_includes/layouts",
    data: "../_data",
    output: "dist",
  },
};
