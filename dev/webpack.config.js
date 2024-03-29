const entry = require('webpack-glob-entry')
const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const minimizeOutput = false

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      './css/main.css',
      './js/main',
    ],
  },
  mode: 'production',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 'core-js@3',
                    targets: ['defaults', 'not ie < 11']
                  }
                ]
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              formatter: 'codeframe'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          // Extract css during build
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          // Uncomment to use MiniCssExtract to load styles into DOM
          // 'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader',
        ],
      },
    ],
  },
  output: {
    path: path.join(__dirname, '..', 'assets'),
    filename: 'main.js',
    chunkFilename: `[name]-[id].js?version=${Date.now()}`,
    publicPath: '',
  },
  optimization: {
    minimize: minimizeOutput,
    minimizer: [
      new TerserPlugin(),
      // Uncomment to use CssMinimizer
      // new CssMinimizerPlugin({
      //   minimizerOptions: {
      //     preset: [
      //       'cssnano-preset-default', {
      //         normalizeWhitespace: false,
      //       },
      //     ],
      //   }
      // }),
    ],
    splitChunks: {
      cacheGroups: {
        // Combine all CSS into a single file
        styles: {
          // CSS file name
          name: 'main',
          //  For webpack@5
          // type: 'css/mini-extract',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, '../dev/js/lib'),
      modules: path.resolve(__dirname, '../dev/modules'),
      mixins: path.resolve(__dirname, '../dev/js/mixins'),
      root: path.resolve(__dirname, '../dev'),
      vue: 'vue/dist/vue.min.js',
    },
  },
  stats: {
    warningsFilter: [
      // postcss-extend displays several warnings about @extend being
      // called to extend something in @media from another @media. We're
      // not ready to fix these situations but the warnings don't help.
      //
      // https://github.com/travco/postcss-extend#extending-something-in-an-media-while-inside-an-media
      /@media from within another @media/,

    ],
  },
  plugins: [
    new StylelintPlugin({
      emitError: true,
      files: './**/*.css',
    }),
    new MiniCssExtractPlugin({
      filename: `[name].min.css`,
      linkType: false,
    }),
  ],
}
