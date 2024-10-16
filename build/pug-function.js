const pug = require("pug");
const path = require("path");
const fs = require("fs");

const pugFunctionPlugin = {
  name: "pug-function",
  setup(build) {
    // Intercept .pug file imports
    build.onLoad({ filter: /\.pug$/ }, async (args) => {
      const filePath = path.resolve(args.path);

      // Read the content of the Pug file
      const source = await fs.promises.readFile(filePath, "utf8");

      // Compile the Pug file into a function
      const compiledFunction = pug.compileClient(source, {
        filename: filePath,
      });

      // Return the compiled function as JavaScript code
      return {
        contents: `
          const pug = require('pug-runtime');
          module.exports = ${compiledFunction};
        `,
        loader: "js", // Ensure it's treated as JS by esbuild
      };
    });
  },
};

module.exports = pugFunctionPlugin;
