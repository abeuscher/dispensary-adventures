const fs = require("fs");
const esbuild = require("esbuild");
const path = require("path");
const sass = require("sass");
const pugFunctionPlugin = require("./pug-function.js");
const aliasPlugin = require("esbuild-plugin-alias");

const BuildScripts = (eleventyConfig, isWatchMode = false) => {
  const outputDir = path.join(__dirname, "../dist/scripts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Shared esbuild configuration
  const esbuildConfig = {
    entryPoints: ["./src/scripts/app.js", "./src/styles/theme.scss"],
    bundle: true,
    outdir: path.join(__dirname, "../dist"),
    loader: {
      ".js": "jsx",
    },
    plugins: [
      aliasPlugin({
        swiper: path.resolve(__dirname, "node_modules/swiper"),
      }),
      {
        name: "sass-plugin",
        setup(build) {
          build.onLoad({ filter: /\.scss$/ }, async (args) => {
            const result = sass.renderSync({
              file: args.path,
              importer: [
                function (url, prev, done) {
                  if (url.startsWith("swiper")) {
                    return { file: path.resolve("node_modules", url) };
                  }
                  return null;
                },
              ],
            });
            return { contents: result.css.toString(), loader: "css" };
          });
        },
      },
      pugFunctionPlugin,
    ],
    minify: false,
    platform: "browser",
    sourcemap: true,
  };

  esbuild
    .build(esbuildConfig)
    .then(() => {
      console.log("Build successful!");

      // Only watch for changes in development mode
      if (isWatchMode) {
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
