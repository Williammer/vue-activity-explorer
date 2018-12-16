<template>
  <div class="search" :class="{ opened }">
    <div class="filter-panel">
      <div style="text-align: center; margin-top: 10px"><span class="filter-title">DATE</span></div>
      <!-- filter date area -->
      <div class="filter-date">
        <li class="date-item" v-for="date in datesData" :key="date.key">
          <label :for="date.key" :class="{selected: date.isSelected}">
            {{date.name}}
          </label>
          <input :id="date.key" type="radio" :value="date.value" v-model="selectedDateRange" />
          <transition v-if="date.key === 'later'" name="fade">
            <div class="later-select-area" v-if="date.isSelected">
              <input class="date-input" type="date" name="from" v-model="laterFrom" required />
              -
              <input class="date-input" type="date" name="to" v-model="laterTo" required />
            </div>
          </transition>
        </li>
      </div>
      <div style="text-align: center"><span class="filter-title">CHANNEL</span></div>
      <!-- filter channel area -->
      <div class="filter-channel">
        <li class="ch-item" :key="'channel-all'">
          <label for="all" :class="{selected: isAllChannelSelected }">
            All
          </label>
          <input id="all" type="radio" :value="['all']" v-model="selectedChannels" />
        </li>
        <li class="ch-item" :key="ch.id" v-for="ch in event.channels">
          <label :class="{selected: selectedChannels && selectedChannels.includes(ch.id)}" :for="ch.name">
            {{ch.name}}
          </label>
          <input type="checkbox" :id="ch.name" :value="ch.id" v-model="selectedChannels" />
        </li>
      </div>
    </div>
    <!-- search button area -->
    <div class="search-btn" :class="{ activated }" @click="submitSearch">
      <span class="search-text">SEARCH</span>
      <span class="search-info" v-if="activated">{{searchInfoStr}}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
::-webkit-inner-spin-button {
  display: none;
}

.search {
  position: absolute;
  width: 240px;
  background: #453257;
  height: 572px;
  left: -240px;
  transition: left 0.3s ease;
  &.opened {
    left: 0;
  }
  .filter-panel {
    font-size: 12px;

    .filter-title {
      font-weight: bold;
      font-size: 12px;
      color: #ac8ec9;
      border-bottom: 1px solid #ac8ec9;
    }
    .filter-date {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin: 16px;
      margin-left: 8px;
      margin-bottom: 6px;
      list-style: none;
      .date-item {
        label {
          cursor: pointer;
          width: fit-content;
          display: flex;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          margin-left: 4px;
          margin-bottom: 8px;
          padding: 2px 6px;
          line-height: 1.5;
          &.selected {
            border-radius: 12px;
            background: #e5f7a9;
            color: #453257;
          }
        }
        input[type="radio"] {
          display: none;
        }
        .later-select-area {
          position: relative;
          color: #8560a9;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 25px;
          background: #fff;
          &::before {
            content: "";
            display: block;
            position: absolute;
            top: -6px;
            left: 20px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 6px solid #fff;
          }
          .date-input {
            position: relative;
            border: none;
            width: 98px;
            padding: 6px 2px;
            height: 18px;
            color: #8560a9;
            font-size: 13px;
            letter-spacing: -2px;

            &[name="from"]::after,
            &[name="to"]::after {
              content: "";
              display: block;
              position: absolute;
              width: 10px;
              height: 10px;
              top: 11px;
            }
            &[name="from"]::after {
              right: 22px;
              background: url("../assets/img/date-from.svg");
            }
            &[name="to"]::after {
              right: 24px;
              background: url("../assets/img/date-to.svg");
            }
          }
        }
      }
    }
    .filter-channel {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin: 16px;
      margin-left: 4px;
      list-style: none;
      .ch-item {
        label {
          display: flex;
          cursor: pointer;
          list-style: none;
          color: #fff;
          font-size: 12px;
          border: 1px solid #d3c1e5;
          border-radius: 12px;
          padding: 2px 10px;
          line-height: 1.5;
          margin-left: 12px;
          margin-bottom: 10px;
          &.selected {
            background: #e5f7a9;
            color: #453257;
          }
        }
        input {
          display: none;
        }
      }
    }
  }
  .search-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 240px;
    height: 64px;
    background: #bababa;
    color: #666;
    text-align: center;

    &.activated {
      cursor: pointer;
      background: #d5ef7f;
      color: #453257;
    }
    .search-text {
      font-size: 16px;
      font-weight: bold;
      &::before {
        width: 13px;
        height: 13px;
        vertical-align: -2px;
        margin-right: 2px;
        display: inline-block;
        content: "";
        background: url("../assets/img/search-gray.svg");
      }
    }
    .search-info {
      color: #8560a9;
      font-size: 10px;
      margin-top: 4px;
    }
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import {
  getTodayTsRange,
  getTmrTsRange,
  getWeekTsRange,
  getMonthTsRange,
  isDateRangeEqual,
  formatDate,
  toTs,
  getMonthAndDay,
  toSearchQueryString
} from "../utils";

export default {
  name: "Search",
  props: {
    opened: Boolean
  },
  data() {
    return {
      selectedChannels: [],
      selectedDateRange: [],
      // minLaterDate: formatDate(new Date()),
      laterFrom: formatDate(new Date()),
      laterTo: formatDate(new Date())
    };
  },
  watch: {
    laterRangeTs(laterRange) {
      this.selectedDateRange = laterRange;
    }
  },
  computed: {
    ...mapState({
      event: state => state.event
    }),
    activated() {
      return (
        this.selectedChannels.length > 0 && this.selectedDateRange.length > 0
      );
    },
    laterRangeTs() {
      if (!this.laterFrom || !this.laterTo) {
        return [];
      }
      const range = [toTs(this.laterFrom) + 1, toTs(this.laterTo) + 1];
      return range;
    },
    filterInfo() {
      const channels = this.selectedChannels
        .filter(ch => ch !== "all")
        .join(",");
      const [after, before] = this.selectedDateRange;
      return {
        channels,
        before,
        after
      };
    },
    searchInfoStr() {
      const chs = this.selectedChannels.filter(ch => ch !== "all");
      const [after, before] = this.selectedDateRange;
      const chLength = chs.length;

      const chStr =
        chLength > 1
          ? `Channel ${chs[0]} and ${chLength - 1} other activities`
          : chLength > 0
            ? `Channel ${chs[0]} activities`
            : `All activities`;
      const dateStr = before
        ? `${getMonthAndDay(after)} to ${getMonthAndDay(before)}`
        : "anytime";
      return `${chStr} from ${dateStr}`;
    },
    isAllChannelSelected() {
      return (
        this.selectedChannels.length === 1 && this.selectedChannels[0] === "all"
      );
    },
    datesData() {
      return [
        {
          key: "any",
          name: "ANYTIME",
          value: [0],
          isSelected: this.selectedDateRange[0] === 0
        },
        {
          key: "today",
          name: "TODAY",
          value: getTodayTsRange(),
          isSelected: isDateRangeEqual(
            getTodayTsRange(),
            this.selectedDateRange
          )
        },
        {
          key: "tmr",
          name: "TOMORROW",
          value: getTmrTsRange(),
          isSelected: isDateRangeEqual(getTmrTsRange(), this.selectedDateRange)
        },
        {
          key: "this-week",
          name: "THIS WEEK",
          value: getWeekTsRange(),
          isSelected: isDateRangeEqual(getWeekTsRange(), this.selectedDateRange)
        },
        {
          key: "this-month",
          name: "THIS MONTH",
          value: getMonthTsRange(),
          isSelected: isDateRangeEqual(
            getMonthTsRange(),
            this.selectedDateRange
          )
        },
        {
          key: "later",
          name: "LATER",
          value: this.laterRangeTs,
          isSelected: isDateRangeEqual(
            this.laterRangeTs,
            this.selectedDateRange
          )
        }
      ];
    }
  },
  methods: {
    ...mapActions("event", ["fetchChannels"]),
    submitSearch() {
      if (!this.activated) {
        return;
      }
      const queryStr = toSearchQueryString(this.filterInfo);
      this.selectedChannels = [];
      this.selectedDateRange = [];
      this.laterFrom = formatDate(new Date());
      this.laterTo = formatDate(new Date());
      this.$store.commit("event/toggleSearch");

      this.$router.push(`/search${queryStr}`);
    }
  },
  created() {
    if (!this.event.channels.length) {
      return this.fetchChannels();
    }
  }
};
</script>
