const glob = require("glob");
const path = require("path");

const entries = {};
glob.sync("./src/http/**/index.js").forEach((entryPath, index) => {
  entries[`entry${index}`] = {
    import: entryPath,
    filename: entryPath,
  };
});

module.exports = {
  target: "node",
  externals: [],
  entry: entries,
  output: {
    path: __dirname,
    // filename: "index.js",
  },
  optimization: {
    minimize: true, // enabling this reduces file size and readability
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared/"),
    },
  },
};
