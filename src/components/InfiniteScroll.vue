<template>
  <div class="infinite-scroll-container">
    <slot name="scrollBody"></slot>
    <div v-if="completed" class="no-more">Scrolled to the end</div>
  </div>
</template>
<script>
import { throttle } from "../utils";

export default {
  name: "InfiniteScroll",
  data() {
    return {
      scrollTarget: null,
      isActive: false
    };
  },
  props: {
    threshold: {
      type: Number,
      default: 0
    },
    throttleTime: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    handler: Function
  },
  watch: {
    completed(val) {
      if (val === true) {
        this.deactivate();
      } else if (val === false) {
        this.activate();
      }
    }
  },
  mounted() {
    this.scrollTarget = this.getScrollTarget(this.$el);
    this.activate();
  },
  methods: {
    shouldLoad() {
      const scrolledHeight = this.getViewHeight() + this.getScrollTop();
      return this.scrollTarget.scrollHeight <= this.threshold + scrolledHeight;
    },
    scrollListener() {
      if (this.shouldLoad() && !this.disabled && !this.completed) {
        this.handler();
      }
    },
    getViewHeight() {
      return this.scrollTarget === window
        ? document.documentElement.clientHeight
        : this.scrollTarget.clientHeight;
    },
    getScrollTop() {
      return this.scrollTarget === window
        ? Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
        : this.scrollTarget.scrollTop;
    },
    getScrollTarget(elm = {}) {
      const { tagName, nodeType } = elm;
      if (tagName !== "HTML" && tagName !== "BODY" && nodeType === 1) {
        const isScrollElm = ["scroll", "auto"].includes(
          getComputedStyle(elm).overflowY
        );
        return isScrollElm ? elm : this.getScrollTarget(elm.parentNode);
      }
      return window;
    },
    activate() {
      if (this.isActive) {
        return;
      }
      this.throttledScrollListener = throttle(
        this.scrollListener,
        this.throttleTime
      );
      this.scrollTarget.addEventListener(
        "scroll",
        this.throttledScrollListener
      );
      this.isActive = true;
    },
    deactivate() {
      if (!this.isActive) {
        return;
      }
      this.scrollTarget.removeEventListener(
        "scroll",
        this.throttledScrollListener
      );
      this.isActive = false;
    }
  },
  destroyed() {
    this.deactivate();
  }
};
</script>
<style lang="scss" scoped>
.infinite-scroll-container {
  .no-more {
    background: #faf9fc;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bababa;
    font-size: 16px;
    padding: 10px 0;
  }
}
</style>
