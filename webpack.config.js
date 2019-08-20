const ZipPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path')

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    code: './src/code.js', // The entry point for your plugin code
  },

  module: {
    rules: [],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new CopyPlugin([
        { from: './src/manifest.json', to: './' }
    ]),
    new ZipPlugin({
        filename: 'figma-typograf-plugin.zip',
        include: [ 'code.js', 'manifest.json'],
        exclude: [/\.map$/]
    })
  ],
})