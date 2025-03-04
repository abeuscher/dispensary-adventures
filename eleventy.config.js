import { HtmlBasePlugin, IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";

import BuildScripts from "./build/scripts.js";
import BuildStyles from "./build/styles.js";
import addFilters from "./config/filters.js";
import htmlmin from "html-minifier";
import path from "path";

console.log("eleventy start");

export default async function (eleventyConfig) {
  // Add filters from separate module
  addFilters(eleventyConfig);

  // Add standard plugins
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy({ "public/": "/" });
  eleventyConfig.addPassthroughCopy({ "assets/images/": "/images/" });

  // Collections
  eleventyConfig.addCollection("reviews", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/**/*.md").sort((a, b) => {
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

  // Simple responsive image shortcode that references pre-processed images
  eleventyConfig.addShortcode("responsiveImage", function (src, alt, sizes, className = "") {
    if (!src) return "";

    // Handle path formatting
    const imgPath = src.startsWith("/") ? src.substring(1) : src;
    const directory = path.dirname(imgPath);
    const filename = path.basename(imgPath, path.extname(imgPath));

    // Define widths
    const widths = [400, 800, 1200];

    // Generate srcsets
    const webpSrcset = widths.map((w) => `/${directory}/${filename}-${w}.webp ${w}w`).join(", ");

    const jpegSrcset = widths.map((w) => `/${directory}/${filename}-${w}.jpg ${w}w`).join(", ");

    // Original as fallback
    const fallbackSrc = `/${imgPath}`;

    // Build HTML with clean formatting
    return `<picture><source type="image/webp" srcset="${webpSrcset}" sizes="${sizes || "100vw"}"><source type="image/jpeg" srcset="${jpegSrcset}" sizes="${sizes || "100vw"}"><img src="${fallbackSrc}" alt="${alt || ""}" ${className ? `class="${className}"` : ""} loading="lazy" decoding="async"></picture>`;
  });

  // Watch for changes to scripts and styles
  eleventyConfig.addWatchTarget("./scripts/**/*.js");
  eleventyConfig.addWatchTarget("./styles/**/*.scss");
  eleventyConfig.addWatchTarget("./assets/images/**/*");

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
