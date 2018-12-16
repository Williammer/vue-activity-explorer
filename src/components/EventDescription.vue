<template>
  <div class="event-description" :class="{ 'restrict-height': shouldCollapse }">
    <span class="desc">{{desc}}</span>
    <div class="gradient-bg" v-if="shouldCollapse">
      <button class="view-all" @click="expandDesc">VIEW ALL</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-description {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 288px;
  padding-right: 16px;
  margin-top: 8px;
  margin-left: 16px;
  overflow: hidden;
  padding-bottom: 16px;
  margin-bottom: 16px;
  &.restrict-height {
    height: 180px;
  }
  .desc {
    color: #67616d;
    font-size: 14px;
  }
  .gradient-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 57px;
    background: linear-gradient(
      rgba(250, 249, 252, 0),
      rgba(250, 249, 252, 0.7),
      rgba(250, 249, 252, 1)
    );
    .view-all {
      position: absolute;
      bottom: 0;
      right: 16px;
      border: none;
      cursor: pointer;
      color: #67616d;
      font-size: 8px;
      font-weight: 500;
      background: #d5ef7f;
      border-radius: 12px;
      padding: 6px 8px;
    }
  }
}
</style>

<script>
export default {
  name: "EventDescription",
  props: {
    desc: String
  },
  computed: {
    shouldCollapse() {
      const isOversized = this.desc && this.desc.length > 475;
      return isOversized && !this.expanded;
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    expandDesc() {
      this.expanded = true;
    }
  }
};
</script>
