<template>
  <div class="event-location">
    <span class="title-label">When</span>
    <span class="loc-1">Marina Bay Sands</span>
    <span class="loc-2">10 Bayfront Ave, S018956</span>
    <img src="../assets/img/gmap.png" class="map" />
  </div>
</template>

<style scoped lang="scss">
.event-location {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 288px;
  padding: 16px 16px 0 0;
  margin-left: 16px;
  border-top: 1px solid #e8e8e8;
  .title-label {
    color: #8560a9;
    font-size: 16px;
    font-weight: bold;
    border-left: #8560a9 3px solid;
    padding-left: 4px;
    margin-bottom: 8px;
  }
  .loc-1,
  .loc-2 {
    font-size: 14px;
    color: #67616d;
    line-height: 1.5;
  }
  .loc-1 {
    font-weight: bold;
  }
  .map {
    margin-top: 8px;
    border-radius: 8px;
    width: 288px;
    height: 88px;
  }
}
</style>

<script>
export default {
  name: "EventLocation",
  data() {
    return {};
  }
};
</script>
