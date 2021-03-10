const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/App.jsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
};
