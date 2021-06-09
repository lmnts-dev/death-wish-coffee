const areIntersected = (array1, array2) => array1.some(value => array2.includes(value))

const filterByTypes = {
  tag: (filterName, filterTags) => product => areIntersected(filterTags, product.tags),
  option: (filterName, filterOptions) => product =>
    areIntersected(filterOptions, product.options_by_name[filterName] ? product.options_by_name[filterName].option.values : [])
}

const sortFunctions = {
  'title-ascending': (product1, product2) => product1.title > product2.title ? 1 : -1,
  'title-descending': (product1, product2) => product2.title > product1.title ? 1 : -1,
  'price-ascending': (product1, product2) => product1.price - product2.price,
  'price-descending': (product1, product2) => product2.price - product1.price,
  'date-descending': (product1, product2) => Date.parse(product2.published_at) - Date.parse(product1.published_at)
}

export {
  filterByTypes,
  sortFunctions
}
