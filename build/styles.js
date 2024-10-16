const sass = require("sass");
const fs = require("fs");
const path = require("path");

function BuildStyles(eleventyConfig, isWatchMode = false) {
  if (isWatchMode) {
    // Watch the styles directory for changes
    eleventyConfig.addWatchTarget("./src/styles/theme.scss");
  }

  // Ensure the output directory exists
  const outputDir = path.join(__dirname, "../dist/styles");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Function to compile Sass
  const compileSass = () => {
    const result = sass.renderSync({
      file: path.join(__dirname, "../src/styles/theme.scss"),
      outputStyle: "compressed", // Minified output for production
    });

    // Write the compiled CSS to the output directory
    fs.writeFileSync(path.join(outputDir, "theme.css"), result.css);
    console.log("Styles compiled to theme.css");
  };

  // Compile Sass once during the build process
  eleventyConfig.on("beforeBuild", () => {
    compileSass();
  });
}

module.exports = { BuildStyles };
