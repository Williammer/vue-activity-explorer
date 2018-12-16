<template>
  <div class="event-involvements">
    <div class="going-list">
      <span class="icon-label">{{eventDetail.going_count || 0}} going</span>
      <div class="icon-list">
        <img
          v-for="user in eventParticipants"
          :key="user.id"
          :src="user.avatar"
          :title="user.username"
        />
      </div>
    </div>
    <div class="likes-list">
      <span class="icon-label">{{eventDetail.likes_count || 0}} likes</span>
      <div class="icon-list">
        <img
          v-for="user in eventLikes"
          :key="user.id"
          :src="user.avatar"
          :title="user.username"
        />
      </div>
    </div>
    <CommentList :eventId="eventDetail.id" />
    <div class="involve-panel">
      <button class="btn dark-btn comment" @click="goToComment"></button>
      <button
        class="btn dark-btn like"
        :class="{ me: eventDetail.me_likes }"
        @click="() => toggleLike(eventDetail.id)"
      ></button>
      <button
        class="btn going"
        :class="{ me: eventDetail.me_going }"
        @click="() => toggleGoing(eventDetail.id)"
      >
        {{ eventDetail.me_going ? "I am going" : "Join" }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-involvements {
  position: relative;
  width: 320px;
  margin-top: 20px;
  border-bottom: 1px solid #e8e8e8;
  .going-list,
  .likes-list {
    margin: 16px 0 12px 16px;
    width: 304px;
    height: 52px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;

    .icon-label {
      width: 80px;
      font-size: 12px;
      color: #67616d;
      text-align: center;
    }
    .icon-list {
      padding: 12px 0 12px 16px;
      img {
        width: 24px;
        height: 24px;
        border-radius: 24px;
        margin-right: 6px;
      }
    }
  }
  .involve-panel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    .btn {
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding-left: 0;
      padding-right: 0;
      border: none;
      &::before {
        display: block;
        content: "";
        width: 24px;
        height: 24px;
      }
    }
    .dark-btn {
      background: #8560a9;
      width: 90px;
      &.comment {
        &::before {
          background: transparent url("../assets/img/comment-single.svg");
        }
      }
      &.like {
        &::before {
          background: transparent url("../assets/img/like-outline.svg");
        }
        &.me {
          &::before {
            background: transparent url("../assets/img/like-light.svg");
          }
        }
      }
    }
    .going {
      width: 140px;
      background: #d5ef7f;
      color: #788c36;
      font-size: 14px;
      font-weight: 500;
      &::before {
        margin-right: 12px;
        background: transparent url("../assets/img/check-outline.svg");
      }
      &.me {
        color: #8560a9;
        &::before {
          background: transparent url("../assets/img/check-dark.svg");
        }
      }
    }
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import CommentList from "./CommentList.vue";

export default {
  name: "EventInvolvements",
  components: {
    CommentList
  },
  computed: {
    ...mapState("event", ["eventDetail", "eventParticipants", "eventLikes"])
  },
  methods: {
    ...mapActions("event", ["toggleLike", "toggleGoing"]),
    goToComment() {
      this.$router.push(`/detail/${this.eventDetail.id}/comments`);
    }
  }
};
</script>
