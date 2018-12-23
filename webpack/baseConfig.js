const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InlineChunksHTMLWebpackPlugin = require('inline-chunks-html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const workboxWebpackPlugin = require('workbox-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const helpers = require('./helpers');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.front')
});

const includedEnvs = ['PUBLIC_PATH'];

const cleanPublicPath = helpers.cleanSlashes(process.env.PUBLIC_PATH);
const outputDir = path.join(__dirname, '../build/' + cleanPublicPath);
const entryFile = path.join(__dirname, '../src-client/entry.js');

module.exports = {
  name: 'frontend',
  bail: true,
  entry: entryFile,
  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    path: outputDir,
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      env: helpers.mapEnvsToPrimitiveTypes(process.env, includedEnvs)
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      path: outputDir,
      filename: 'index.html',
      title: process.env.WEBSITE_NAME,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css'
    }),
    new InlineChunksHTMLWebpackPlugin({
      deleteFile: true,
      inlineChunks: ['main.css', 'vendors~main.css']
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../public'),
      ignore: ['index.html']
    }]),
    new workboxWebpackPlugin.GenerateSW({
      importWorkboxFrom: 'local',
      skipWaiting: true,
      clientsClaim: true,
      swDest: 'serviceWorker.js',
      cacheId: 'brokoli',
      exclude: [
        /\.map$/gim,
        /\.txt$/gim,
        /\.png$/gim,
        /\.ico$/gim,
        /main\.(?:.*?)\.css$/gim,
        /manifest\.json?$/gim
      ],
      runtimeCaching: [{
        urlPattern: /api/gim,
        handler: 'networkFirst',
        options: {
         // Fall back to the cache after 10 seconds.
         networkTimeoutSeconds: 10,
         // Use a custom cache name for this route.
         cacheName: 'api-cache',
         // matchOptions and fetchOptions are used to configure the handler.
         fetchOptions: {
           mode: 'no-cors'
         }
       }
     }]
    })
  ],
  module: {
    rules: [
      {
        test: path.join(__dirname, '../node_modules/fluxible-js/src/'),
        enforce: 'pre',
        use: [
          'babel-loader',
          /**
           * the following is optional and used for
           * on-build code removal
           */
          {
            loader: 'webpack-loader-clean-pragma',
            options: {
              pragmas: [
                {
                  start: '/** @fluxible-config-async */',
                  end: '/** @end-fluxible-config-async */'
                },
                {
                  start: '/** @fluxible-config-persist */',
                  end: '/** @end-fluxible-config-persist */'
                },
                {
                  start: '/** @fluxible-config-use-JSON */',
                  end: '/** @end-fluxible-config-use-JSON */'
                },
                {
                  start: '/** @fluxible-no-synth-events */',
                  end: '/** @end-fluxible-no-synth-events */'
                }
              ]
            }
          }
        ]
      },
      {
        test: path.join(__dirname, '../src-client/workers/'),
        use: {
          loader: 'worker-loader',
          options: {
            fallback: true
          }
        }
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'webpack-loader-clean-pragma',
            options: {
              pragmas: [
                {
                  start: '/** @delete */',
                  end: '/** @enddelete */'
                }
              ]
            }
          }
        ]
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, '../src-client/styles/imports')],
              functions: {
                  url (_path, done) {
                    done(
                      nodeSass.types.String(
                        'url(\'/' + helpers.cleanSlashes(_path.getValue()) + '\')'
                      )
                    );
                  }
                }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [postcssPresetEnv()]
            }
          }
        ]
      },
      {
        test: /\.ttf|\.woff2|\.woff|\.eot/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
            publicPath: process.env.PUBLIC_PATH
          }
        }
      },
      {
        test: /\.gif|\.png|\.jpg|\.jpeg/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
            publicPath: process.env.PUBLIC_PATH
          }
        }
      },
      {
        test: /\.svg/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'svgs/[name].[ext]',
            publicPath: process.env.PUBLIC_PATH
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            booleans_as_integers: true
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: false
      }),
      new OptimizeCssAssetsWebpackPlugin()
    ],
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      _helpers: path.join(__dirname, '../src-client/helpers'),
      _components: path.join(__dirname, '../src-client/components'),
      _styles: path.join(__dirname, '../src-client/styles'),
      _routes: path.join(__dirname, '../src-client/routes'),
      _mutations: path.join(__dirname, '../src-client/store/mutations'),
      _store: path.join(__dirname, '../src-client/store'),
      _workers: path.join(__dirname, '../src-client/workers')
    }
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    // eslint-disable-next-line
    child_process: 'empty'
  }
};
