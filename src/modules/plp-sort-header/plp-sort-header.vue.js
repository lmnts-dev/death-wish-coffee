import { mapMutations } from 'vuex'

export default {
  computed: {
    sortOrder: {
      get () {
        return this.$store.state.plp.sortOrder
      },
      set (value) {
        this.mutateSortOrder(value)
      }
    }
  },
  methods: {
    ...mapMutations('plp', ['toggleManualFilter', 'mutateSortOrder'])
  }
}
