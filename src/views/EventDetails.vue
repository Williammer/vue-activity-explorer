<template>
    <div class="container">
      <MainHeader :canSearch="canSearch" :avatar="userAvatar" />
      <router-view name="baseInfo" :details="eventDetail"></router-view>
      <div class="event-tabs">
        <router-link :to="`/detail/${eventId}/`">Details</router-link>
        <router-link :to="`/detail/${eventId}/participants`">Participants</router-link>
        <router-link :to="`/detail/${eventId}/comments`">Comments</router-link>
      </div>
      <router-view :details="eventDetail"></router-view>
    </div>
</template>

<style lang="scss" scoped>
.container {
  width: 320px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  .event-tabs {
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
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import MainHeader from "../components/MainHeader.vue";
import { commentsPageSize } from "../config";

export default {
  components: {
    MainHeader
  },
  data() {
    return {
      canSearch: false,
      eventId: null
    };
  },
  computed: {
    ...mapState("event", ["eventDetail"]),
    userAvatar() {
      return this.$store.state.user.user.avatar;
    }
  },
  methods: {
    ...mapActions("event", [
      "fetchEventDetail",
      "fetchEventParticipants",
      "fetchEventLikes",
      "fetchEventComments"
    ]),
    async prepareDetailData(path) {
      if (path.startsWith(`/detail/${this.eventId}`)) {
        await this.fetchEventDetail(this.eventId);
        await this.fetchEventParticipants(this.eventId);
        await this.fetchEventLikes({ eventId: this.eventId });
        await this.fetchEventComments({
          eventId: this.eventId,
          limit: commentsPageSize
        });
      }
    }
  },
  created() {
    const { params, path } = this.$route;
    this.eventId = +params.id;
    return this.prepareDetailData(path);
  }
};
</script>
