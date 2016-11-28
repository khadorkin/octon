const webpack = require('webpack'); // eslint-disable-line
const path = require('path'); // eslint-disable-line
const buildPath = path.resolve(__dirname, '..', 'public', 'build');
const mainPath = path.resolve(__dirname, '..', 'client', 'app.js');

const config = {
  // We change to normal source mapping
  devtool: 'source-map',
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'bundle.js',
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      'process.env.GOOGLE_GA': JSON.stringify('UA-59303778-3'),
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
  ],
};

module.exports = config;
