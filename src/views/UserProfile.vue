<template>
    <div class="container">
      <MainHeader :canSearch="canSearch" :avatar="profile.avatar" />
      <div class="user-info">
        <img :src="profile.avatar" class="avatar" />
        <span class="username">{{profile.username}}</span>
        <span class="email">{{profile.email}}</span>
      </div>
      <div class="user-tabs">
        <router-link class="likes" :to="`/profile`">{{profile.likes_count || 0}} Likes</router-link>
        <router-link class="going" :to="`/profile/going`">{{profile.goings_count || 0}} Going</router-link>
        <router-link class="past" :to="`/profile/past`">{{profile.past_count || 0}} Past</router-link>
      </div>
      <div class="list-container">
        <InfiniteScroll
          :threshold="20"
          :disabled="shouldInfiniteScrollDisabled"
          :completed="!hasMore && userEvents.length > 0"
          :handler="loadMoreEvent"
        >
          <EventList slot="scrollBody" v-if="userEvents.length > 0" :events="userEvents" />
          <NoEvent slot="scrollBody" v-else class="no-event-wrap" />
        </InfiniteScroll>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
  width: 320px;
  height: 572px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 30px 0 20px;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 80px;
    }
    .username {
      font-size: 24px;
      color: #67616d;
      line-height: 2;
    }
    .email {
      font-size: 14px;
      color: #8560a9;

      &::before {
        display: block;
        content: "";
        position: absolute;
        left: -20px;
        width: 16px;
        height: 13px;
        background: transparent url("../assets/img/email.svg");
      }
    }
  }
  .user-tabs {
    width: 320px;
    height: 40px;
    display: flex;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    justify-content: space-evenly;
    align-items: center;
    a {
      text-decoration: none;
      font-size: 12px;
      color: #8c8c8c;
      height: 15px;
      border-left: #e8e8e8 1px solid;
      padding-left: 18px;
      &:first-child {
        border-left: none;
        padding-left: 0;
      }
      &.router-link-exact-active {
        color: #aecb4f;
      }
    }
  }
  .list-container {
    height: 295px;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px #ac8ec9;
      border-radius: 2px;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      box-shadow: inset 0 0 3px #d3c1e5;
      background-color: #ac8ec9;
    }
  }
  .no-event-wrap {
    margin-top: 72px;
  }
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import MainHeader from "../components/MainHeader.vue";
import EventList from "../components/EventList.vue";
import NoEvent from "../components/NoEvent.vue";
import InfiniteScroll from "../components/InfiniteScroll.vue";
import { eventListPageSize } from "../config";

export default {
  components: {
    MainHeader,
    EventList,
    NoEvent,
    InfiniteScroll
  },
  data() {
    return {
      canSearch: false
    };
  },
  watch: {
    $route({ path }) {
      return this.loadMoreEvent(path);
    }
  },
  computed: {
    ...mapState("user", [
      "user",
      "profile",
      "userEvents",
      "isRequesting",
      "hasMore",
      "eventType"
    ]),
    shouldInfiniteScrollDisabled() {
      return this.isRequesting || !this.hasMore;
    }
  },
  methods: {
    ...mapActions("user", ["fetchMyDetails"]),
    ...mapActions("user", ["fetchMyEvents"]),
    loadMoreEvent(path = this.$route.path) {
      const type = path.split("/")[2] || "liked";
      const isSameType = this.eventType === type;
      if (isSameType && !this.hasMore) {
        return;
      }
      const offset = isSameType ? this.userEvents.length : 0;
      const options = {
        type,
        offset,
        limit: eventListPageSize,
        lazy: isSameType
      };
      return this.fetchMyEvents(options);
    }
  },
  async created() {
    await this.fetchMyDetails();
    await this.loadMoreEvent();
  }
};
</script>
