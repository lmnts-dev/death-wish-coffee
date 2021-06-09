import ProductCard from '../product-card/product-card.vue'
import PlpFilter from '../plp-filter/plp-filter.vue'
import PlpSortHeader from '../plp-sort-header/plp-sort-header.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    ProductCard,
    PlpFilter,
    PlpSortHeader
  },
  computed: {
    ...mapState('plp', ['products']),
    ...mapGetters('plp', ['displayedProducts', 'displayedFeaturedProducts'])
  },
  methods: {
    getFeaturedProductIndexForPosition (index) {
      return Math.ceil(index / 3) - 1
    },
    getFeaturedProductForIndex (index) {
      return this.displayedFeaturedProducts[this.getFeaturedProductIndexForPosition(index)]
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
