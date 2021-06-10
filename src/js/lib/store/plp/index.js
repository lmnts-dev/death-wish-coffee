import { filterByTypes, sortFunctions, loadProductsForPage } from './helpers'

export default {
  namespaced: true,
  state () {
    return {
      filterDefinitions: [],
      filterValues: {},
      products: [],
      featuredProducts: [],
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
          const values = item.option.values.map(v => v.toLowerCase())
          allValues[option] = (allValues[option] || []).concat(values)
        }
      }
      // De-duplicate
      for (const [option, values] of Object.entries(allValues)) {
        allValues[option] = [...new Set(values)]
      }

      return allValues
    },
    filterAvailableValues ({ filterDefinitions }, { allProductOptionValues }) {
      return filterDefinitions.reduce(
        (result, filter) => {
          // Generate all available options from the products in current collection
          if (filter.type === 'option' && allProductOptionValues[filter.name]) {
            result[filter.name] = allProductOptionValues[filter.name]
          } else {
            result[filter.name] = filter.options
          }

          return result
        },
        {}
      )
    },
    displayedFeaturedProducts ({ featuredProducts, sortOrder }, { isFiltering }) {
      return isFiltering || sortOrder ? [] : featuredProducts
    },
    displayedFeaturedProductIds (state, { displayedFeaturedProducts }) {
      return displayedFeaturedProducts.map(product => product.id)
    },
    displayedProducts ({ products, filterValues, filterDefinitions, sortOrder }, { displayedFeaturedProductIds }) {
      let filteredProducts = products.filter(product => !displayedFeaturedProductIds.includes(product.id))

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
    productsCount ({ totalCount, sortOrder }, { displayedProducts, isFiltering }) {
      return (isFiltering || sortOrder) ? displayedProducts.length : totalCount
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
    mutateFeaturedProducts (state, products) {
      state.featuredProducts = products
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

      if (typeof window.DWC_PLP.featuredProducts !== 'undefined') {
        commit('mutateFeaturedProducts', window.DWC_PLP.featuredProducts)
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
