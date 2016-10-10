const webpack = require('webpack'); // eslint-disable-line
const autoprefixer = require('autoprefixer'); // eslint-disable-line

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
    publicPath: 'http://localhost:3020/',
    path: '/',
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
      exclude: /(node_modules)|(apollo-client)/,
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  postcss: [autoprefixer()],
  devServer: {
  },
};
