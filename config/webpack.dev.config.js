const path = require('path'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line
const autoprefixer = require('autoprefixer'); // eslint-disable-line
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line

const buildPath = path.resolve(__dirname, 'public', 'build');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3020',
      'webpack/hot/only-dev-server',
      './client/app.js',
    ],
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/build/',
    path: buildPath,
  },
  module: {
    loaders: [{
      test: /\.(scss|css)/,
      loaders: ['style', 'css', 'postcss', 'sass'],
    }, {
      test: /\.js$/,
      loader: 'babel',
      // Exclude apollo client from the webpack config in case
      // we want to use npm link.
      exclude: /(node_modules\/(?!material-ui))|(apollo-client)/,
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
    }),
  ],
  postcss: [autoprefixer()],
  devServer: {
  },
};
