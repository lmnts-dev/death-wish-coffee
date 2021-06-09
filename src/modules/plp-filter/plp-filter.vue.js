import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      expandedFilters: []
    }
  },
  computed: {
    // Two-way binding with Vuex state via mutations
    selectedOptions: {
      get () {
        const checked = Object.entries(this.filterValues).map(
          ([key, values]) => values.map(value => `${key}|${value}`)
        ).flat()

        return checked
      },
      set (pairs) {
        if (pairs.length === 0) {
          this.mutateIsFiltering(false)
        } else {
          this.mutateIsFiltering(true)
        }

        const filterValues = pairs.reduce(
          (result, pair) => {
            const [key, value] = pair.split('|')
            if (!result[key]) {
              result[key] = []
            }
            result[key].push(value)

            return result
          },
          {}
        )

        this.mutateFilterValues(filterValues)
      }
    },
    ...mapState('plp', ['filterDefinitions', 'filterValues']),
    ...mapGetters('plp', ['filterAvailableValues'])
  },
  methods: {
    ...mapMutations('plp', ['mutateFilterValues', 'mutateIsFiltering'])
  }
}
