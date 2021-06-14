import nanoajax from 'nanoajax'

const areIntersected = (array1, array2) => array1.some(value => array2.includes(value))

const filterByTypes = {
  tag: (filterName, filterTags) => product => areIntersected(filterTags, product.tags.map(t => t.toLowerCase())),
  option: (filterName, filterOptions) => product =>
    areIntersected(
      filterOptions,
      product.options_by_name[filterName]
        ? product.options_by_name[filterName].option.values.map(v => v.toLowerCase())
        : []
    )
}

const sortFunctions = {
  'title-ascending': (product1, product2) => product1.title > product2.title ? 1 : -1,
  'title-descending': (product1, product2) => product2.title > product1.title ? 1 : -1,
  'price-ascending': (product1, product2) => product1.price - product2.price,
  'price-descending': (product1, product2) => product2.price - product1.price,
  'date-descending': (product1, product2) => Date.parse(product2.published_at) - Date.parse(product1.published_at)
}

const loadProductsForPage = async (page) => {
  const url = location.href + (location.search ? '&' : '?') + `view=ajax&page=${page}`
  return new Promise(resolve => {
    nanoajax.ajax(
      {
        url,
        method: 'get'
      },
      (code, responseText) => {
        const products = JSON.parse(responseText)
        resolve(products)
      }
    )
  })
}

export {
  filterByTypes,
  sortFunctions,
  loadProductsForPage
}
