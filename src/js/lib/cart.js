import nanoajax from 'nanoajax'

class Cart {
  get () {
    return new Promise(resolve => {
      nanoajax.ajax(
        {
          url: '/cart.js',
          method: 'get'
        },
        (code, responseText) => {
          const cart = JSON.parse(responseText)
          resolve(cart)
        }
      )
    })
  }

  generateShopifyCartUpdateBody ({ id, quantity }) {
    return `updates[${id}]=${quantity}`
  }

  update (data) {
    return new Promise((resolve) => {
      nanoajax.ajax(
        {
          url: '/cart/update.js',
          method: 'post',
          body: this.generateShopifyCartUpdateBody(data)
        },
        (code, responseText) => {
          const cart = JSON.parse(responseText)
          if (Number(code) !== 200) {
            cart.errors = [cart.description]
          }
          resolve(cart)
        }
      )
    })
  }

  generateShopifyCartAddBody ({ id, quantity, properties }) {
    let propertiesParam = ''
    if (properties && Object.keys(properties)) {
      propertiesParam = Object.keys(properties)
        .map(key => properties[key] ? `properties[${key}]=${encodeURIComponent(properties[key])}` : '')
        .filter(item => !!item)
        .join('&')
    }
    return `quantity=${quantity}&id=${id}&${propertiesParam}`
  }

  /**
   * Adds a product to the Shopify cart
   *
   * @param {Object} data {id: <id>, quantity: <Number>}
   */
  add (data) {
    return new Promise(resolve => {
      nanoajax.ajax(
        {
          url: '/cart/add.js',
          method: 'post',
          body: this.generateShopifyCartAddBody(data)
        },
        (code, responseText) => {
          const cart = JSON.parse(responseText)
          if (Number(code) !== 200) {
            cart.errors = [cart.description]
          }
          resolve(cart)
        }
      )
    })
  }
}

export default new Cart()
