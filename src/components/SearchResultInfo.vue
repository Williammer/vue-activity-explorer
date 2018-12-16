<template>
  <div class="search-result-info">
    <div class="first-row">
      <span class="result-count-label">{{`${resultCount} Results`}}</span>
      <button class="clear-btn" @click="onClear">CLEAR SEARCH</button>
    </div>
    <span class="searched-info">{{searchedInfo}}</span>
  </div>
</template>

<style scoped lang="scss">
.search-result-info {
  background: #faf9fc;
  width: 320px;
  height: 68px;
  text-align: center;
  .first-row {
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    .result-count-label {
      color: #8560a9;
      font-size: 16px;
      margin-left: 27px;
    }
    .clear-btn {
      border: none;
      cursor: pointer;
      color: #67616d;
      font-size: 8px;
      font-weight: 500;
      background: #d5ef7f;
      border-radius: 12px;
      padding: 6px 8px;
      margin-right: 15px;
    }
  }
  .searched-info {
    font-size: 12px;
    color: #67616d;
  }
}
</style>

<script>
import { getMonthAndDay } from "../utils";

export default {
  name: "SearchResultInfo",
  props: {
    onClear: Function,
    resultCount: Number,
    searchData: Object
  },
  computed: {
    searchedInfo() {
      const { channels = "", before, after } = this.searchData;
      let chStr = "All channel Activites";
      const chArr = channels.split(",");
      if (channels) {
        const chLen = chArr.length;
        const firstCh = chArr[0];
        chStr =
          chLen > 1
            ? `Channel ${firstCh} and ${chLen - 1} other Activites`
            : `Channel ${firstCh} Activites`;
      }

      let dateStr = "from anytime";
      if (after && before) {
        if (after === before) {
          dateStr = `on ${getMonthAndDay(after)}`;
        } else {
          dateStr = `from ${getMonthAndDay(after)} to ${getMonthAndDay(
            before
          )}`;
        }
      } else if (after || before) {
        dateStr = after
          ? `from ${getMonthAndDay(after)}`
          : `before ${getMonthAndDay(before)}`;
      }
      return `Searched for ${chStr} ${dateStr}`;
    }
  }
};
</script>
