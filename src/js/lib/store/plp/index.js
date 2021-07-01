import { filterByTypes, sortFunctions, loadProductsForPage } from './helpers'

export default {
  namespaced: true,
  state () {
    return {
      filterDefinitions: [],
      filterValues: {},
      products: [],
      featuredIndexes: [],
      sortOrder: '',
      isManualFilter: false,
      totalCount: 0
    }
  },
  getters: {
    allProductOptionValues ({ products }) {
      const allValues = {}

      for (const product of products) {
        for (const [option, item] of Object.entries(product.options_by_name)) {
          const values = item.option.values.map(v => ({ value: v.toLowerCase(), label: v }))
          allValues[option] = (allValues[option] || []).concat(values)
        }
      }
      // De-duplicate
      for (const [option, values] of Object.entries(allValues)) {
        allValues[option] = values.reduce((result, v) => {
          if (!result.some(r => r.value === v.value)) {
            result.push(v)
          }
          return result
        }, [])
      }

      return allValues
    },
    allProductTypeValues ({ products }) {
      const allValues = products
        .reduce(
          (result, product) => {
            const type = product.type
            if (!result.some(r => r.value === type.toLowerCase())) {
              result.push({ value: type.toLowerCase(), label: type })
            }
            return result
          },
          [])
        .sort((type1, type2) => type1.value > type2.value ? 1 : -1)
      return allValues
    },
    filterAvailableValues ({ filterDefinitions }, { allProductOptionValues, allProductTypeValues }) {
      return filterDefinitions.reduce(
        (result, filter) => {
          // Generate all available options from the products in current collection
          if (filter.type === 'option' && allProductOptionValues[filter.name]) {
            result[filter.name] = allProductOptionValues[filter.name]
          } else if (filter.type === 'type') {
            result[filter.name] = allProductTypeValues
          } else {
            result[filter.name] = filter.options.map(o => ({ value: o.toLowerCase(), label: o }))
          }

          return result
        },
        {}
      )
    },
    displayedFeaturedProducts ({ products, sortOrder, featuredIndexes }, { isFiltering }) {
      return isFiltering || sortOrder ? [] : products.filter((product, index) => featuredIndexes.findIndex(i => i === index) >= 0)
    },
    displayedProducts ({ products, filterValues, filterDefinitions, sortOrder }) {
      let filteredProducts = [...products]

      for (const filter of filterDefinitions) {
        if (!filterValues[filter.name] || filterValues[filter.name].length === 0) {
          continue
        }

        const criteria = filterByTypes[filter.type](filter.name, filterValues[filter.name])
        filteredProducts = filteredProducts.filter(criteria)
      }

      if (sortOrder) {
        filteredProducts.sort(sortFunctions[sortOrder])
      }

      return filteredProducts
    },
    productsCount (state, { displayedProducts }) {
      return displayedProducts.length
    },
    isFiltering ({ filterValues }) {
      return Object.entries(filterValues).length > 0
    }
  },
  mutations: {
    mutateFilterDefinitions (state, definitions) {
      state.filterDefinitions = definitions
    },
    mutateProducts (state, products) {
      state.products = products
    },
    mutateFeaturedIndexes (state, indexes) {
      state.featuredIndexes = indexes
    },
    mutateFilterValues (state, filterValues) {
      state.filterValues = filterValues
    },
    toggleManualFilter (state) {
      state.isManualFilter = !state.isManualFilter
    },
    mutateSortOrder (state, sortOrder) {
      state.sortOrder = sortOrder
    },
    mutateTotalCount (state, totalCount) {
      state.totalCount = totalCount
    },
    concatProducts (state, products) {
      state.products = state.products.concat(products)
    }
  },
  actions: {
    async init ({ commit }) {
      if (typeof window.DWC_PLP === 'undefined') {
        return
      }

      if (typeof window.DWC_PLP.definitions !== 'undefined') {
        commit('mutateFilterDefinitions', window.DWC_PLP.definitions)
      }

      if (typeof window.DWC_PLP.products !== 'undefined') {
        commit('mutateProducts', window.DWC_PLP.products)
      }

      if (typeof window.DWC_PLP.featuredIndexes !== 'undefined') {
        commit('mutateFeaturedIndexes', window.DWC_PLP.featuredIndexes)
      }

      if (typeof window.DWC_PLP.totalCount !== 'undefined') {
        commit('mutateTotalCount', window.DWC_PLP.totalCount)
      }

      if (typeof window.DWC_PLP.totalPages !== 'undefined' && window.DWC_PLP.totalPages > 1) {
        const promises = []

        for (let page = 2; page <= window.DWC_PLP.totalPages; page++) {
          promises.push(loadProductsForPage(page))
        }

        const allPages = await Promise.all(promises)
        commit('concatProducts', allPages.flat())
      }
    }
  }
}
