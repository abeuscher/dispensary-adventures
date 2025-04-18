import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";

const pugFunctionPlugin = {
  name: "pug-function",
  setup(build) {
    build.onLoad({ filter: /\.pug$/ }, async (args) => {
      const filePath = path.resolve(args.path);

      // Read the content of the Pug file
      const source = await fs.promises.readFile(filePath, "utf8");

      // Compile the Pug template to a function string
      const compiledFunction = pug.compileClient(source, {
        filename: filePath,
        inlineRuntimeFunctions: false, // Externalize runtime for cleaner output
      });

      // Return the compiled Pug function with proper runtime inclusion
      return {
        contents: `
          const pug = require('pug-runtime');
          module.exports = ${compiledFunction};
        `,
        loader: "js",
      };
    });
  },
};

export default pugFunctionPlugin;
