import { mapMutations, mapGetters } from 'vuex'

export default {
  computed: {
    sortOrder: {
      get () {
        return this.$store.state.plp.sortOrder
      },
      set (value) {
        this.mutateSortOrder(value)
      }
    },
    ...mapGetters('plp', ['productsCount'])
  },
  methods: {
    ...mapMutations('plp', ['toggleManualFilter', 'mutateSortOrder']),
  }
}
