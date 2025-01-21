module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                "./src/styles/variables.scss",
                "./src/styles/mixins.scss",
              ],
            },
          },
        ],
      },
    ],
  },
};
