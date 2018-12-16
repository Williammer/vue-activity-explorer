<template>
  <div class="no-event-area">
    <div class="icon"></div>
    <span class="info">No activity found</span>
  </div>
</template>

<style scoped lang="scss">
.no-event-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 320px;
  .icon {
    width: 60px;
    height: 60px;
    background: transparent url("../assets/img/no-activity.svg");
    margin-bottom: 14px;
  }
  .info {
    font-size: 14px;
    color: #bababa;
  }
}
</style>

<script>
export default {
  name: "NoEvent"
};
</script>
