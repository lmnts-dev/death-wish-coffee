const cart = require('./../apis/cart.js/data.json')
const productBase = require('./product.js')
const orderBase = require('./order.js')

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

const products = []

for (let i = 0; i < 50; i++) {
  const product = deepClone(productBase)
  product.id = `product-${i}`
  if (i === 0) {
    product.title = 'Lemtosh Dust'
    product.tags = [
      'material-dust'
    ]
  }
  products.push(product)
}

module.exports = {
  title: 'Barrel | Base Modules',
  shop: {
    name: 'Barrel Base Modules'
  },
  form: {
    'form.posted_successfully?': true
  },
  checkout: false,
  linklists: {
    'plp-sidebar': {
      links: [
        {
          title: 'Product',
          url: '/collections/product-a',
          object: {
            handle: 'all'
          },
          links: [
            {
              title: 'Product A',
              url: '/collections/product-a',
              object: {
                handle: 'all'
              }
            },
            {
              title: 'Product B',
              url: '/collections/product-b',
              object: {
                handle: 'all'
              }
            }
          ]
        },
        {
          title: 'Collection',
          url: '/collections/collection-a',
          object: {
            handle: 'all'
          },
          links: [
            {
              title: 'Collection A',
              url: '/collections/collection-a',
              object: {
                handle: 'all'
              }
            },
            {
              title: 'Collection B',
              url: '/collections/collection-b',
              object: {
                handle: 'all'
              }
            }
          ]
        }
      ]
    },
    'main-menu': {
      'handle': 'main-menu',
      'title': 'Header Menu',
      'links': [
        {
          'url': '/collections',
          'title': 'Collections',
          'links': [
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Games'
                }
              ]
            },
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Games'
                }
              ]
            },
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Dresses'
                }
              ]
            },
            {
              'url': '/collections/games',
              'title': 'Dresses',
              'object': {
                'image': '/assets/squad-shot_2520x.jpg?v=1557785697'
              }
            }
          ]
        },
        {
          'url': '/products',
          'title': 'Products'
        },
        {
          'url': '/accessories',
          'title': 'Accessories'
        }
      ]
    },
    'secondary-menu': {
      'handle': 'main-menu',
      'title': 'Header Menu',
      'links': [
        {
          'url': '/collections',
          'title': 'Collections',
          'links': [
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Games'
                }
              ]
            },
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Games'
                }
              ]
            },
            {
              'url': '/collections/all',
              'title': 'All products',
              'links': [
                {
                  'url': '/collections/all',
                  'title': 'All products'
                },
                {
                  'url': '/collections/games',
                  'title': 'Games'
                }
              ]
            },
            {
              'url': '/collections/dresses',
              'title': 'Dresses',
              'object': {
                'image': '/assets/squad-shot_2520x.jpg?v=1557785697'
              }
            }
          ]
        },
        {
          'url': '/products',
          'title': 'Products'
        },
        {
          'url': '/accessories',
          'title': 'Accessories'
        }
      ]
    },
    'social-menu': {
      'handle': 'social-menu',
      'title': 'Social Menu',
      'links': [
        {
          'url': '#',
          'title': 'Instagram'
        },
        {
          'url': '#',
          'title': 'Facebook'
        },
        {
          'url': '#',
          'title': 'YouTube'
        }
      ]
    },
    'footer': {
      'handle': 'main-menu',
      'title': 'Header Menu',
      'links': [
        {
          'url': '/collections',
          'title': 'Collections'
        },
        {
          'url': '/products',
          'title': 'Products'
        },
        {
          'url': '/accessories',
          'title': 'Accessories'
        },
        {
          'url': '/collections',
          'title': 'Collections'
        },
        {
          'url': '/products',
          'title': 'Products'
        },
        {
          'url': '/accessories',
          'title': 'Accessories'
        },
        {
          'url': '/collections',
          'title': 'Collections'
        },
        {
          'url': '/products',
          'title': 'Products'
        }
      ]
    },
    'footer-bottom': {
      'handle': 'main-menu',
      'title': 'Header Menu',
      'links': [
        {
          'url': '/footer-bottom-1',
          'title': 'Footer Bottom 1'
        },
        {
          'url': '/footer-bottom-2',
          'title': 'Footer Bottom 2'
        },
        {
          'url': '/footer-bottom-3',
          'title': 'Footer Bottom 3'
        },
        {
          'url': '/footer-bottom-4',
          'title': 'Footer Bottom 4'
        },
        {
          'url': '/footer-bottom-5',
          'title': 'Footer Bottom 5'
        },
        {
          'url': '/footer-bottom-6',
          'title': 'Footer Bottom 6'
        }
      ]
    }
  },
  cart: cart,
  search: {
    results: [
      products[0],
      products[1],
      products[2]
    ]
  },
  collection: {
    handle: 'All',
    title: 'Default Collection',
    description: 'This is a description',
    url: 'collections/All',
    image: '/assets/PLP_Originals_Optical_1440x.jpg?v=1528847057',
    products: products
  },
  paginate: {
    pages: 1
  },
  'current_page': 1,
  customer: {
    orders: [deepClone(orderBase)],
    default_address: {
      first_name: 'Barrel',
      last_name: 'O\'laughs',
      company: 'Barrel',
      address1: '197 Grand St',
      address2: 'Suite 7S',
      city: 'New York',
      province: 'NY',
      zip: 11249,
      country: 'United States',
      phone: '123 456 7890'
    },
    addresses: [{
      first_name: 'Barrel',
      last_name: 'O\'laughs',
      company: 'Barrel',
      address1: '197 Grand St',
      address2: 'Suite 7S',
      city: 'New York',
      province: 'NY',
      zip: 11249,
      country: 'United States',
      phone: '123 456 7890'
    }]
  },
  order: deepClone(orderBase),
  newsletter: {
    provider: 'klaviyo',
    mailchimp_url: 'https://drjart.us7.list-manage.com/subscribe/post-json?u=1c45fceca4996e6cafb8f60d2&amp;id=c646eeb648',
    klaviyo_url: 'https://manage.kmail-lists.com/ajax/subscriptions/subscribe',
    klaviyo_group: 'PP8Dfr',
    form_placeholder: 'Newsletter sign up',
    form_error_message: 'An error occurred. Please check the email address and try again.',
    form_success_message: 'You have been subscribed to the mailing list.',
    form_btn_text: 'Sign up'
  },
  settings: {
    contacts_phone: '000',
    contacts_email: 'xx@xx.com',
    contacts_chat_url: '1234',
    contacts_phone_text: 'Phone',
    contacts_email_text: 'Email',
    contacts_chat_text: 'Chat',
    contacts_phone_image: 'icon-phone_669df080-b015-42ba-a6a2-ccab4ea174c3_200x.png?v=1529427195',
    contacts_email_image: 'icon-email_3df21641-2a8f-4225-9183-685a936180ae_200x.png?v=1529427202',
    contacts_chat_image: 'icon-chat_ee98c7fc-e2b3-4fdc-96ea-f589907baf76_200x.png?v=1529427210'
  },
  index: [
    {
      title: 'Age Gate',
      description: 'Clear cookie to trigger age gate on first load.',
      items: [
        {
          title: 'Age Gate',
          url: '/pages/gated'
        }
      ]
    },
    {
      title: 'Account pages',
      items: [
        {
          title: 'Login',
          url: '/account/login'
        },
        {
          title: 'Register',
          url: '/account/register'
        },
        {
          title: 'Password Reset',
          url: '/account/reset'
        },
        {
          title: 'Activate Account',
          url: '/account/activate'
        },
        {
          title: 'Account / Orders',
          url: '/account/'
        },
        {
          title: 'Order detail',
          url: '/account/orders/0001'
        },
        {
          title: 'Addresses',
          url: '/account/addresses'
        },
        {
          title: 'Recover',
          url: '/account/recover'
        }
      ]
    },
    {
      title: 'Cart',
      items: [
        {
          title: 'Cart',
          url: '/cart'
        }
      ]
    },
    {
      title: 'FAQ',
      url: '/pages/faq'
    },
    {
      title: 'Home Page',
      items: [
        {
          title: 'Hero - Slideshow w/ Images and Ambient Video',
          url: '/'
        },
        {
          title: 'Logo Row - (Desktop) Static / (Mobile) Slider',
          url: '/'
        },
        {
          title: 'Text Focus - Headings',
          url: '/'
        },
        {
          title: 'Three Up - Content Cards',
          url: '/'
        },
        {
          title: 'Two Up - Image Right + Content (CTA) Left',
          url: '/'
        },
        {
          title: 'Testimonial Slider',
          url: '/'
        },
        {
          title: 'Two Up - Media w/ Image or Video',
          url: '/'
        },
        {
          title: 'Three Up - Products',
          url: '/'
        },
        {
          title: 'Callout - Image w/ text + CTA',
          url: '/'
        }
      ]
    },
    {
      title: 'Home (Mega)',
      items: [
        {
          title: 'Header - Mega',
          url: '/pages/mega'
        },
        {
          title: 'Footer - Mega',
          url: '/pages/mega'
        }
      ]
    },
    {
      title: 'PDP',
      items: [
        {
          title: 'PDP - Zoom',
          url: '/products/lemtosh'
        },
        {
          title: 'PDP - Enhanced Zoom',
          url: '/products/enhanced'
        }
      ]
    },
    {
      title: 'PLP',
      items: [
        {
          title: 'PLP Sidebar',
          url: '/collections/'
        },
        {
          title: 'PLP Grid w/ Sorting',
          url: '/products/all'
        }
      ]
    },
    {
      title: 'Store Locator',
      url: '/pages/store-locator'
    }
  ]
}
