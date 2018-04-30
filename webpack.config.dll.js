import path from 'path';
import webpack from 'webpack';

process.env.NODE_ENV = 'development';
import basename from './base.config';

export default {
  devtool: 'source-map',
  mode: 'development',
  // node: {
  //   fs: 'empty',
  //   child_process: 'empty'
  // },
  entry: {
    // All libraries here need to be the library work in client, exclude all the ones work in server-side
    vendorBundle: [
      'animejs',
      'axios',
      'babel-runtime/core-js', // Replace babel-core otherwise the build wont work
      'babel-polyfill',
      'babel-register',
      'd3',
      'dat.gui',
      'framesync',
      'gsap',
      'history',
      'jquery',
      'jsonwebtoken',
      'jss',
      'lodash',
      'material-ui',
      'material-ui-icons',
      'phaser',
      'pixi.js',
      'popmotion',
      'popmotion-pose',
      'react',
      'react-dom',
      'react-jss',
      'react-motion',
      'react-motion-ui-pack',
      'react-move',
      'react-pose',
      'react-redux',
      'react-router',
      'react-router-dom',
      'react-router-redux',
      'react-spring',
      'react-transition-group',
      'redux',
      'redux-thunk',
      'reselect',
      'stylefire',
      'three',
      'velocity-react',
      'webfontloader',
      'zepto'
    ]
  },
  plugins: [
    // new webpack.IgnorePlugin(/fs|child_process|npm/),
    new webpack.DllPlugin({
      path: path.resolve(__dirname + '/lib' + basename) + '/[name]_manifest.json',
      name: '[name]_dll' // Beware don't use '.' since webpack will parse this name as a js variable name
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(vert|frag|cs|html)$/,
        use: 'raw-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname + '/lib' + basename),
    filename: '[name]_dll.js',
    sourceMapFilename: './[name]_dll.js.map',
    library: '[name]_dll' // Beware don't use '.' since webpack will parse this name as a js variable name
  }
};
