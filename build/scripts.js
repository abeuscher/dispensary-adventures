import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";

import pugFunctionPlugin from "./pug-function.js";

const BuildScripts = async (eleventyConfig, isWatchMode = false) => {
  const outputDir = path.join(path.resolve(), "dist", "scripts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const esbuildConfig = {
    entryPoints: ["./assets/scripts/app.js"], // Only build app.js
    bundle: true,
    outdir: outputDir,
    loader: {
      ".js": "jsx",
    },
    plugins: [pugFunctionPlugin],
    minify: !isWatchMode,
    platform: "browser",
    sourcemap: true,
  };

  try {
    if (isWatchMode) {
      eleventyConfig.addWatchTarget("./assets/scripts/**/*.js"); // Watch all JS files for changes
      eleventyConfig.on("beforeBuild", async () => {
        await esbuild.build(esbuildConfig); // Only build app.js on any change
        console.log("Rebuilding app.js due to script changes...");
      });
    } else {
      await esbuild.build(esbuildConfig); // Initial build
      console.log("Script Build successful!");
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

export default BuildScripts;
