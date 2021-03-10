const productBase = require('./product.js')

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  name: '#0001',
  customer_url: '/account/orders/0001',
  created_at: '2018-07-23 13:09:44 -0400',
  total_price: '1000',
  financial_status_label: 'Paid',
  fulfillment_status_label: 'Unfulfilled',
  cancelled: true,
  cancelled_at: '2018-07-23 13:09:44 -0400',
  cancel_reason: 'This is the cancelled reason',
  line_items: [{
    product: deepClone(productBase),
    image: '/assets/lemtosh-color-red-pos-1.jpg?12205968699439793742',
    variant: {},
    price: 1000,
    properties: [{
      first: 'Property Key',
      last: 'Property Value'
    }],
    sku: 'SKU000001',
    quantity: 2,
    fulfillment: {
      created_at: '2018-07-23 13:09:44 -0400',
      tracking_url: '/',
      tracking_numer: '000000001'
    }
  }],
  discounts: [{
    code: '10OFF',
    savings: 20
  }],
  shipping_methods: [{
    title: 'Ground Shipping',
    price: 15
  }],
  tax_lines: [{
    title: 'Sales Tax',
    rate: 1,
    price: 8
  }],
  billing_address: {
    name: 'Superman',
    company: 'Ruckus',
    street: '240 W 37th St. 11th Floor',
    city: 'New York',
    province: 'NY',
    zip: 10018,
    country: 'United States',
    phone: '123 456 7890'
  },
  shipping_address: {
    name: 'Superman',
    company: 'Ruckus',
    street: '240 W 37th St. 11th Floor',
    city: 'New York',
    province: 'NY',
    zip: 10018,
    country: 'United States',
    phone: '123 456 7890'
  }
}
