const dev = require('./webpack.dev.config')
const prod = require('./webpack.prod.config')

const env = process.env.NODE_ENV || 'dev'
const config = (env === 'production') ? prod : dev

module.exports = {
  bail: config.bail,
  entry: config.entry,
  output: config.output,
  externals: config.externals,
  plugins: config.plugins,
  devServer: config.devServer,
  devtool: config.devtool,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]-[local]__[hash:base64:5]!stylus-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}