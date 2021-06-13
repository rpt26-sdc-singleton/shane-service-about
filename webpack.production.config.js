const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

require('dotenv').config();

console.log('base url:', process.env.BASE_URL);

module.exports = {
  mode: 'production',
  entry: './client/index.jsx',
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
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || 'http://localhost:3002'),
      'process.env.REVIEWS_URL': JSON.stringify(process.env.REVIEWS_URL || 'http://localhost:3001'),
      'process.env.TITLE_URL': JSON.stringify(process.env.TITLE_URL || 'http://localhost:3007'),
      'process.env.INSTRUCTOR_URL': JSON.stringify(process.env.INSTRUCTOR_URL || 'http://localhost:3003'),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
};
