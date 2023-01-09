// TODO: remove this file, it isn't used now that the upscribe options have been removed
// from commit: https://github.com/lmnts-dev/death-wish-coffee/commit/763fb243c3c44f91d9847e0e86dbfd40d42123b4
export default {
  template: `
      <div class="cu-option__option"
          v-if="option"
          :class="{'is-active': isActive}"
          @click="clickOption"
      >
          <span class="cu-option__mainText"
              v-if="option.mainText"
          >{ option.mainText }</span>
          <span class="cu-option__subText"
              v-if="option.subText"
          >{ option.subText }</span>
      </div>
  `,
  computed: {
    isActive () {
      return this.selectedIndex === this.index
    }
  },
  props: {
    option: {
      type: [Object, Boolean],
      default: false
    },
    index: {
      type: Number,
      required: true
    },
    selectedIndex: {
      type: Number,
      required: true
    },
    selectFrequencyOptions: {
      type: Array,
      required: true
    }
  },
  methods: {
    // emit selected val
    clickOption () {
      this.$emit('click-option', this.index)
    }
  }
}
