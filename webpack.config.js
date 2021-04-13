const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './client/index.jsx',
  devtool: 'source-map',
  // devtool: 'inline-source-map',
  // devServer: {
  //   proxy: {
  //     '/': 'http://localhost:3002',
  //   },
  //   contentBase: './public',
  //   hot: true,
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // plugins: [new HtmlWebpackPlugin({
  //   title: 'Production',
  //   template: './public/index.html',
  // })],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
};
