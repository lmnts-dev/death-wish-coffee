import Video from '../video/video'
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    Video(this.$el)
    this.video.addEventListener('ended', () => {
      this.$emit('video-ended')
    })
  },
  computed: {
    video () {
      return this.$refs.video instanceof Array ? this.$refs.video[0] : this.$refs.video
    }
  },
  methods: {
    play () {
      this.video && this.video.play()
    },
    reset () {
      this.video && setTimeout(() => {
        this.video.currentTime = 0
        this.video.pause()
      }, 180)
    }
  }
}
