<template>
  <div class="event-time">
    <span class="title-label">When</span>
    <div class="time">
      <div class="begin">{{beginTime}}</div>
      <div class="end">{{endTime}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 304px;
  margin-left: 16px;
  border-top: 1px solid #e8e8e8;
  padding-bottom: 16px;
  padding-top: 16px;
  .title-label {
    color: #8560a9;
    font-size: 16px;
    font-weight: bold;
    border-left: #8560a9 3px solid;
    padding-left: 4px;
  }
  .time {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 10px;
    .begin,
    .end {
      height: 74px;
      font-size: 16px;
      color: #67616d;
      text-align: center;
    }
    .begin {
      width: 140px;
      border-right: 1px solid #e8e8e8;
    }
    .end {
      width: 158px;
    }
  }
}
</style>

<script>
import { formatDate } from "../utils";
export default {
  name: "EventTime",
  props: {
    begin: String,
    end: String
  },
  computed: {
    beginTime() {
      return formatDate(new Date(this.begin), "DD MM YYYY");
    },
    endTime() {
      return formatDate(new Date(this.end), "DD MM YYYY");
    }
  }
};
</script>
