const path = require('path');

module.exports = {
  mode: "development",
  entry: './views/projects/robothouse-funhouse/src/main.js',
  watch: true,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};