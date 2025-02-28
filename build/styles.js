import * as fs from "fs";
import * as path from "path";
import * as sass from "sass";

const BuildStyles = (eleventyConfig, isWatchMode = false) => {
  if (isWatchMode) {
    // Watch the styles directory for changes
    console.log("Watching for style changes...");
    eleventyConfig.addWatchTarget("./assets/styles/**/*.scss");
  }

  // Ensure the output directory exists
  const outputDir = path.join(path.resolve(), "dist", "styles");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Function to compile Sass asynchronously
  const compileSass = async () => {
    try {
      const result = await sass.compileAsync(
        path.join(path.resolve(), "assets", "styles", "theme.scss"),
        {
          style: "compressed", // Minified output for production
          loadPaths: [
            path.join(path.resolve(), "assets", "styles"), // Your custom styles
            path.join(path.resolve(), "node_modules"), // Include node_modules to resolve dependencies like swiper and normalize
          ],
        },
      );

      // Write the compiled CSS to the output directory
      fs.writeFileSync(path.join(outputDir, "theme.css"), result.css);
      console.log("Styles compiled to theme.css");
    } catch (error) {
      console.error("Error compiling Sass:", error);
    }
  };

  // Compile Sass once during the build process
  eleventyConfig.on("beforeBuild", () => {
    compileSass();
  });
};

export default BuildStyles;
