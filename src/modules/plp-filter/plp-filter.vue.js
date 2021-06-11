import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      expandedFilters: [],
      localFilterState: {}
    }
  },
  computed: {
    /**
     * Conditionally bind the individual filter options to either local state or vuex state based on whether
     * the user needs to manually click Apply (on mobile) or not.
     */
    selectedOptions: {
      get () {
        const filterState = this.isManualFilter ? this.localFilterState : this.filterValues

        return Object.entries(filterState).map(
          ([key, values]) => values.map(value => `${key}|${value}`)
        ).flat()
      },
      set (pairs) {
        // Otherwise on desktop, construct the state object and mutate the filters immediately
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

        this.localFilterState = filterValues

        if (!this.isManualFilter) {
          this.applyFilters()
        }
      }
    },
    filterCount () {
      const count = Object.entries(this.localFilterState).length
      return count > 0 ? ` (${count})` : ''
    },
    ...mapState('plp', ['filterDefinitions', 'filterValues', 'isManualFilter']),
    ...mapGetters('plp', ['filterAvailableValues'])
  },
  methods: {
    applyFilters () {
      this.mutateFilterValues(this.localFilterState)
    },
    clearFilters () {
      this.localFilterState = {}
    },
    ...mapMutations('plp', ['mutateFilterValues'])
  }
}