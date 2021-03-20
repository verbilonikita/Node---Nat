const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "public/js/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/js"),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};
