const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Require your custom pug-loader from the /build directory
const pugLoader = require("./build/pug-function.js");

module.exports = {
  entry: {
    main: "./src/styles/theme.scss",
    app: "./src/scripts/app.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name].js",
  },
  module: {
    rules: [
      // Rule for SCSS
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      // Rule for JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      // Rule for Pug files using the custom loader
      {
        test: /\.pug$/,
        use: [
          {
            loader: path.resolve(__dirname, "./build/pug-loader.js"),
            options: {
              pretty: true, // Enable pretty output if needed
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/theme.css",
    }),
  ],
  mode: "development",
  watch: true,
};
