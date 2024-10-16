const fs = require("fs");
const esbuild = require("esbuild");
const path = require("path");
const pugFunctionPlugin = require("./pug-function.js");

const BuildScripts = (eleventyConfig, isWatchMode = false) => {
  const outputDir = path.join(__dirname, "../dist/scripts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Shared esbuild configuration
  const esbuildConfig = {
    entryPoints: ["./src/scripts/app.js"],
    bundle: true,
    outdir: outputDir,
    loader: {
      ".js": "jsx",
    },
    plugins: [pugFunctionPlugin],
    minify: false,
    platform: "browser",
    sourcemap: true,
  };

  esbuild
    .build(esbuildConfig)
    .then(() => {
      console.log("Script Build successful!");

      // Only watch for changes in development mode
      if (isWatchMode) {
        console.log("Watching for changes...");
        esbuild
          .context(esbuildConfig)
          .then((context) => {
            context.watch();
            console.log("Watching for changes...");
          })
          .catch((error) => {
            console.error("Error watching files:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Build failed:", error);
      process.exit(1);
    });
};

module.exports = { BuildScripts };
