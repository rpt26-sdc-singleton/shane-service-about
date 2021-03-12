const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/App.jsx',
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '/': 'http://localhost:3002'
    },
    contentBase: './public',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Development',
    template: './public/index.html',
  })],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
};
