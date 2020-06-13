const path = require('path');
const glob = require('glob');
const NodemonPlugin = require('nodemon-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const babel = {
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      "presets": [
        ["@babel/preset-env", {"targets": { node: "10" }}],
        "@babel/preset-react"
      ],
      "plugins": [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-transform-react-jsx", {
          "pragma": "Nullstack.element",
          "pragmaFrag": "'Fragment'",
          "throwIfNamespace": false
        }]
      ]
    }
  }
};

function server(env, argv) {
  const folder = argv.mode === 'development' ? '.development' : '.production';
  const devtool = argv.mode === 'development' ? 'inline-source-map' : undefined;
  const minimize = argv.mode !== 'development';
  const plugins = argv.mode === 'development' ? ([
    new NodemonPlugin({
      watch: path.resolve('./.development'),
      script: './.development/server.js',
    })
  ]) : undefined;
  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, '../../'+folder),
      filename: 'server.js'
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
          })
        ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        babel,
        {
          test: /.js$/,
          loader: path.resolve('./node_modules/nullstack/register-static-from-server-loader.js'),
        },
        {
          test: /.js$/,
          loader: path.resolve('./node_modules/nullstack/render-method-proposal.js'),
        },
        {
          test: /.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{ENVIRONMENT}}', replace: 'server', flags: 'ig' }
            ]
          }
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            { loader: 'ignore-loader'}
          ]
        },
      ]
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins
  }
}

function client(env, argv) {
  const folder = argv.mode === 'development' ? '.development' : '.production';
  const devtool = argv.mode === 'development' ? 'inline-source-map' : undefined;
  const minimize = argv.mode !== 'development';
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "client.css"
    })
  ]
  if(argv.mode === 'production') {
    plugins.push(new PurgecssPlugin({
      paths: glob.sync(`src/**/*`,  { nodir: true }),
      whitelist: ['script', 'body', 'html', 'style'],
      extractors: [
        {
          extractor: (content) => content.match(/[A-z0-9-\+:\/]+/g),
          extensions: ['js']
        }
      ]
    }));
  } else {
    plugins.push(new LiveReloadPlugin({
      appendScriptTag: true,
      port: 0,
      delay: 3000,
    }));
  }
  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, '../../'+folder),
      filename: 'client.js'
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        babel,
        {
          test: /.js$/,
          loader: path.resolve('./node_modules/nullstack/remove-static-from-client-loader.js'),
        },
        {
          test: /.js$/,
          loader: path.resolve('./node_modules/nullstack/render-method-proposal.js'),
        },
        {
          test: /.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{ENVIRONMENT}}', replace: 'client', flags: 'ig' }
            ]
          }
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader'},
            { loader: 'sass-loader'}
          ],
        }
      ]
    },
    target: 'node',
    plugins
  }
}

module.exports = [server, client]