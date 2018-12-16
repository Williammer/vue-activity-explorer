<template>
  <div v-if="imgs && imgs.length" class="img-gallery">
    <div class="img-container" :style="{ left: 0, width: `${imgs.length * 192}px` }">
      <img v-for="imgUrl in imgs" :key="imgUrl" :src="imgUrl" class="event-img" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-gallery {
  position: relative;
  width: 304px;
  padding: 16px 0 0 16px;
  height: 110px;
  overflow: hidden;
  .img-container {
    display: flex;
    position: relative;
    height: 120px;
    transition: left 0.2s ease;
    .event-img {
      width: 180px;
      height: 100px;
      border-radius: 10px;
      margin-right: 12px;
    }
  }
}
</style>

<script>
export default {
  name: "EventImages",
  props: {
    imgs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    wheelHandler({ wheelDelta, target }) {
      let containerNode = target;
      if (target.className === "event-img") {
        containerNode = target.parentNode;
      }

      const width = +containerNode.style.width.split("px")[0];
      const lastLeft = +containerNode.style.left.split("px")[0];
      let curLeft = lastLeft + wheelDelta;

      if (curLeft <= 300 - width) curLeft = 300 - width;
      if (curLeft >= 0) curLeft = 0;
      containerNode.style.left = `${curLeft}px`;
    },
    enableWheelControl() {
      this.$el.addEventListener("wheel", this.wheelHandler, { passive: true });
    },
    disableWheelControl() {
      this.$el.removeEventListener("wheel", this.wheelHandler, {
        passive: true
      });
    }
  },
  mounted() {
    this.enableWheelControl();
  },
  destroyed() {
    this.disableWheelControl();
  }
};
</script>
