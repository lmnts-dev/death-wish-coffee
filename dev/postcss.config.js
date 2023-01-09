const config = {
  plugins: [
    require('./postcss-tasks/postcss-module-import'),
    require('precss'),
    require('postcss-mixins'),
    require('postcss-inline-svg'),
    require('postcss-color-function'),
    require('autoprefixer')({
      browsers: [
        'last 3 versions',
        'iOS >= 8',
        'Safari >= 8',
        'ie 11'
      ]
    }),
    require('postcss-automath'),
    require('postcss-hexrgba'),
    require('postcss-extend'),
    require('postcss-for'),
    require('postcss-each')
  ]
}

if (process.env.ENV === 'development') {
  // Chuck in directly after importing files
  config.plugins.splice(1, 0,
    require('./postcss-tasks/postcss-shopify-fonts')('//cdn.shopify.com/s/files/1/2403/8187/t/77/assets/')
  )
}

module.exports = config
