import ProductCard from '../product-card/product-card.vue'
import PlpFilter from '../plp-filter/plp-filter.vue'
import PlpSortHeader from '../plp-sort-header/plp-sort-header.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    currentTags: {
      type: Array,
      default: () => []
    },
    collectionName: {
      type: String,
      default: ''
    }
  },
  components: {
    ProductCard,
    PlpFilter,
    PlpSortHeader
  },
  computed: {
    formattedCurrentTags () {
      return this.currentTags.length && this.currentTags.map(tag => `"${tag}"`).join(', ')
    },
    isFiltered () {
      return Object.entries(this.filterValues).length > 0
    },
    ...mapState('plp', ['products', 'filterValues']),
    ...mapGetters('plp', ['displayedProducts', 'displayedFeaturedProducts'])
  },
  methods: {
    checkIfProductFeatured (product) {
      return this.displayedFeaturedProducts.findIndex(featuredProduct => product.id === featuredProduct.id) >= 0
    },
    getFeaturedProductIndexForPosition (index) {
      return Math.ceil(index / 3) - 1
    },
    getFeaturedProductClass (index) {
      const classes = [
        'product-card--row-1-plp',
        'product-card--row-4-plp'
      ]
      return classes[this.getFeaturedProductIndexForPosition(index)]
    }
  }
}
