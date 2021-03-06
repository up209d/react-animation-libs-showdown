import path from 'path';
import webpack from 'webpack';
import glob from 'glob';
import basename from './base.config';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

const webpackConfig = {
  devtool: 'eval',
  mode: 'development',
  performance: {
    hints: false
  },
  cache: false,
  externals: {},
  watch: true,
  watchOptions: {
    ignored: /(node_modules|\.log$)/
  },
  entry: {
    appBundle: [
      'webpack-hot-middleware/client?reload=true',
      'react-hot-loader/patch',
      './client/client.js'
    ],
    vendorBundle: [
      'babel-polyfill',
      './src/js/vendors/index.js'
    ]
  },
  plugins: [
    new ResetRequireCache(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BABEL_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      // No need chunk filename if we combine all css together
      // chunkFilename: "[id].css"
    }),
    new HTMLWebpackPlugin({
      // If set it to index.html, so the express server will jump in it directly
      // So we cannot make the server rendering for the root url exp http://localhost:20987
      // Solution here is create template html with other than index.html
      filename: 'main.html', // avoid name index.html to make all requests have to fallback to our api (see server.development.js)
      // !!! IMPORTANT !!!
      hash: true, // add ?[build hash] to serving files to avoid caching
      // !!! IMPORTANT !!!
      favicon: './src/assets/images/favicon.ico',
      template: './src/index.html'
    }),
    // Copy Extras Files
    new CopyWebpackPlugin([
      // Remember the root folder for the destination is the global output path of config already
      // It is already 'dist' as the root folder
      // {
      //   from: './src/assets/images/favicon.ico',
      //   to: './favicon.[hash].ico'
      // },
      {
        from: './data/**/*.*',
        to: './[path][name].[ext]', // ?v=[hash] // [query]
        // Context is the way that we can use to manipulate the destination
        // for exp: copy from ./src/data so the path would be ./src/data
        // If we want the path doesn't contain ./src so we can remove that
        // by declare context ./src so, all path from 'from' and 'to' will start
        // from the context path, by default context = compiler.options.context
        // which is the root folder of compilation
        context: './src'
      },
      {
        context: './src',
        from: './assets/images/**/*',
        to: './assets/images/[name].[ext]'
      },
      {
        context: './src',
        from: './assets/fonts/**/*',
        to: './assets/fonts/[name].[ext]'
      }
    ], {
      // Exclude file types to copy here
      ignore: [
        // Doesn't copy any files with a txt extension
        // '*.txt',
        // Doesn't copy any file, even if they start with a dot
        // '**/*',
        // Doesn't copy any file, except if they start with a dot
        // { glob: '**/*', dot: false }
      ],
      copyUnmodified: true
    })
  ],
  optimization: {
    namedModules: true,
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true, //ModuleConcatenationPlugin
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendorBundle',
          chunks: 'all'
        },
        styles: {
          test: /\.css$/,
          name: 'stylesBundle',
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  resolve: {
    modules: [
      path.resolve(__dirname + '/bower_components'),
      path.resolve(__dirname + '/node_modules'),
      path.resolve(__dirname + '/src/js/vendor'),
      path.resolve(__dirname + '/src/assets'),
      path.resolve(__dirname + '/src/assets/images'),
      path.resolve(__dirname + '/src/assets/fonts'),
      path.resolve(__dirname + '/src/js'),
      path.resolve(__dirname + '/src'),
      path.resolve(__dirname + '/')
    ],
    alias: {
      ROOT_DIR: path.resolve(__dirname + '/'),
      SRC_DIR: path.resolve(__dirname + '/src'),
      JS_DIR: path.resolve(__dirname + '/src/js'),
      ASSETS_DIR: path.resolve(__dirname + '/src/assets'),
      IMAGE_DIR: path.resolve(__dirname + '/src/assets/images'),
      FONT_DIR: path.resolve(__dirname + '/src/assets/fonts')
    }
  },
  module: {
    rules: [
      // We use only one root rule as oneOf (switch case)
      {
        oneOf: [
          // QUICK FIX
          {
            // Hot Transform for ansi-regex only (it uses arrow function)
            // Thus, IE will not like that arrow function natively
            test: /ansi/,
            use: [
              {
                loader: 'babel-loader'
              }
            ]
          },
          // JS FILES
          {
            test: /\.jsx?$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: 'babel-loader'
              }
            ]
          },
          // SCSS FILES
          {
            test: /\.(css|scss)$/,
            // We cant exclude because we need to import some SCSS dependencies (exp: Bootstrap)
            // exclude: [/node_modules/],
            use: [
              {
                loader: 'style-loader'
              },
              // {
              //   loader: MiniCssExtractPlugin.loader,
              // },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          // FONT FILES
          {
            test: /\.eot$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/vnd.ms-fontobject',
                name: 'assets/fonts/[name].[ext]'
              }
            },
            exclude: [/node_modules/]
          },
          {
            test: /\.woff$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/font-woff',
                name: 'assets/fonts/[name].[ext]'
              }
            },
            exclude: [/node_modules/]
          },
          {
            test: /\.woff2$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/font-woff2',
                name: 'assets/fonts/[name].[ext]'
              }
            },
            exclude: [/node_modules/]
          },
          {
            test: /\.ttf$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/font-ttf',
                name: 'assets/fonts/[name].[ext]'
              }
            },
            exclude: [/node_modules/]
          },
          // ASSETS FILE
          {
            test: /\.(jpe?g|png|gif|ico|svg)$/,
            exclude: [/node_modules/],
            oneOf: [
              // if REQUIRE end with ?File
              {
                resourceQuery: /File/,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: 'assets/images/[name].[ext]'
                  }
                }
              },
              // if REQUIRE end with ?Raw
              {
                resourceQuery: /Raw/,
                use: {
                  loader: 'raw-loader'
                }
              },
              // if REQUIRE end with ?Data
              {
                resourceQuery: /Data/,
                use: {
                  loader: 'url-loader',
                }
              },
              // if REQUIRE is SVG File with URL LOADER
              {
                // svg and url-loader need to set MIMETYPE
                test: /\.svg$/,
                use: {
                  loader: 'url-loader',
                  options: {
                    limit: '10000',
                    mimetype: 'image/svg+xml',
                    name: 'assets/images/[name].[ext]'
                  }
                }
              },
              // REST CASES FALLBACK
              {
                use: {
                  loader: 'url-loader',
                  options: {
                    limit: '1000',
                    name: 'assets/images/[name].[ext]'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname + '/dist' + basename),
    publicPath: basename + '/',
    filename: '[name].js'
  }
};

function ResetRequireCache(options) {
  // Do smt with options object here
};

ResetRequireCache.prototype.apply = function (compiler) {
  // Webpack 4
  if (compiler.hooks && compiler.hooks.compilation) {
    compiler.hooks.done.tap('ResetRequireCache',stats => {
      stats.compilation.fileDependencies.forEach(dependency => {
        if (dependency.match(/(\/src\/)(.*)\.(jsx?)$/) !== null) {
          console.log('- Clear Cache - : ', dependency);
          delete require.cache[dependency];
        }
      });
    })
  } else {
    // Webpack 3 Fallback
    compiler.plugin('done', function (stats) {
      console.log('Global Context: ',compiler.options.context);
      // Clear the cache if of all file in ./src folder
      stats.compilation.fileDependencies.forEach(dependency => {
        if (dependency.match(/(\/src\/)(.*)\.(jsx?)$/) !== null) {
          console.log('- Clear Cache - : ', dependency);
          delete require.cache[dependency];
        }
      });
    });
  }
};

// This plugin is deprecated, make conflics with compilation hooks
const SMP = new SpeedMeasurePlugin();
export default webpackConfig;