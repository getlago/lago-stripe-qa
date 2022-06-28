require('dotenv').config()
const path = require('path')

const webpack = require('webpack')

module.exports = () => {
  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
    },
    resolve: {
      extensions: ['*', '.ts', '.tsx', '.js'],
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@mui/styled-engine': path.resolve(__dirname, 'node_modules/@mui/styled-engine-sc'),
      },
      symlinks: false,
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
      }),
      new webpack.DefinePlugin({
        STRIPE_SECRET_KEY: JSON.stringify(process.env.STRIPE_SECRET_KEY),
        API_URL: JSON.stringify(process.env.API_URL),
      }),
    ],
  }
}
