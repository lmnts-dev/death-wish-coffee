export default {
  namespaced: true,
  state () {
    return {
      filterDefinitions: [],
      filterValues: {},
      products: [],
      featuredProducts: [],
      isFiltering: false
    }
  },
  getters: {
    allProductOptionValues ({ products }) {
      const allValues = {}

      for (const product of products) {
        for (const [option, item] of Object.entries(product.options_by_name)) {
          allValues[option] = (allValues[option] || []).concat(item.option.values)
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
    displayedFeaturedProducts ({ featuredProducts, isFiltering }) {
      return isFiltering ? [] : featuredProducts
    },
    displayedFeaturedProductIds (state, { displayedFeaturedProducts }) {
      return displayedFeaturedProducts.map(product => product.id)
    },
    displayedProducts ({ products, filterValues, filterDefinitions }, { displayedFeaturedProductIds }) {
      let filteredProducts = products.filter(product => !displayedFeaturedProductIds.includes(product.id))

      const areIntersected = (array1, array2) => array1.some(value => array2.includes(value))

      const filterByTypes = {
        tag: (filterName, filterTags) => product => areIntersected(filterTags, product.tags),
        option: (filterName, filterOptions) => product =>
          areIntersected(filterOptions, product.options_by_name[filterName] ? product.options_by_name[filterName].option.values : [])
      }

      for (const filter of filterDefinitions) {
        if (!filterValues[filter.name] || filterValues[filter.name].length === 0) {
          continue
        }

        const criteria = filterByTypes[filter.type](filter.name, filterValues[filter.name])
        filteredProducts = filteredProducts.filter(criteria)
      }

      return filteredProducts
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
    mutateIsFiltering (state, isFiltering) {
      state.isFiltering = isFiltering
    }
  },
  actions: {
    init ({ commit }) {
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
    }
  }
}
