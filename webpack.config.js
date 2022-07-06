const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      // 'webpack-hot-middleware/client?path=//localhost:3000/__webpack_hmr',
      './src/css/main.css',
      './src/js/main'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: 'main.js',
    chunkFilename: `[name]-[id].js?version=${Date.now()}`
  },
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
        extract: true,
        use: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'src/js/lib'),
      modules: path.resolve(__dirname, 'src/modules'),
      mixins: path.resolve(__dirname, 'src/js/mixins'),
      root: path.resolve(__dirname, 'src'),
      vue: process.env.ENV === 'production' ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
    }
  },
  plugins: [
    new StylelintPlugin({
      emitError: true,
      files: './src/**/*.css'
    })
  ]
}
