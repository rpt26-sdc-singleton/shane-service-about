const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './client/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || 'localhost:3002'),
      'process.env.REVIEWS_URL': JSON.stringify(process.env.REVIEWS_URL || 'localhost:3001'),
      'process.env.TITLE_URL': JSON.stringify(process.env.TITLE_URL || 'localhost:3007'),
      'process.env.INSTRUCTOR_URL': JSON.stringify(process.env.INSTRUCTOR_URL || 'localhost:3003'),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
};
