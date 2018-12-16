<template>
  <div class="outer">
    <Search :opened="event.searchOpened" />
    <div class="container" :class="{ 'push-right': event.searchOpened }">
      <MainHeader :canSearch="canSearch" :avatar="user.user.avatar" />
      <SearchResultInfo
        v-if="$route.path === '/search'"
        :onClear="clearSearch"
        :resultCount="event.eventList.length"
        :searchData="$route.query"
      />
      <InfiniteScroll
        :threshold="20"
        :disabled="shouldInfiniteScrollDisabled"
        :completed="!event.hasMore && event.eventList.length > 0"
        :handler="loadMore"
      >
        <EventList v-if="event.eventList.length > 0" :events="event.eventList" slot="scrollBody" />
        <NoEvent v-else class="no-event-wrap" slot="scrollBody" />
      </InfiniteScroll>
    </div>
    <div class="loading" v-if="event.isRequesting"></div>
  </div>
</template>

<style scoped lang="scss">
.outer {
  display: flex;
  justify-content: flex-start;
  .container {
    position: relative;
    width: 320px;
    height: 572px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    overflow-y: scroll;
    overflow-x: hidden;
    left: 0;
    transition: left 0.3s ease;
    &.push-right {
      left: 240px;
    }
    .no-event-wrap {
      margin-top: 120px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px #ac8ec9;
      border-radius: 2px;
    }
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      box-shadow: inset 0 0 3px #d3c1e5;
      background-color: #ac8ec9;
    }
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 572px;
    background: #fefefe;
    opacity: 0.7;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      display: block;
      content: "";
      width: 50px;
      height: 50px;
      background: transparent url("../assets/img/loading-spinner.svg");
    }
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import MainHeader from "../components/MainHeader.vue";
import EventList from "../components/EventList.vue";
import Search from "../components/Search.vue";
import NoEvent from "../components/NoEvent.vue";
import SearchResultInfo from "../components/SearchResultInfo.vue";
import InfiniteScroll from "../components/InfiniteScroll.vue";
import { eventListPageSize } from "../config";

export default {
  components: {
    MainHeader,
    EventList,
    Search,
    NoEvent,
    SearchResultInfo,
    InfiniteScroll
  },
  data() {
    return {
      canSearch: true
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      event: state => state.event
    }),
    shouldInfiniteScrollDisabled() {
      const { isRequesting, hasMore } = this.event;
      return isRequesting || !hasMore;
    }
  },
  watch: {
    $route(to) {
      return this.loadEvents(to.path, to.query);
    }
  },
  methods: {
    ...mapActions("event", ["fetchEventList", "searchEvents"]),
    clearSearch() {
      this.$router.push("/");
    },
    loadEvents(path, query = {}) {
      const options = { ...query, limit: eventListPageSize };
      if (path === "/search") {
        return this.searchEvents(options);
      }
      return this.fetchEventList(options);
    },
    loadMore() {
      if (!this.event.hasMore) {
        return;
      }
      const base = { offset: this.event.eventList.length, lazy: true };
      const { path, query } = this.$route;
      return this.loadEvents(path, { ...base, ...query });
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !this.user.user) {
      this.$store.commit("user/loginSuccess", user);
    }
    return this.loadEvents(this.$route.path, this.$route.query);
  }
};
</script>
