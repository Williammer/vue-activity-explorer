<template>
  <div class="comment-item">
    <img :src="comment.user.avatar" class="avatar" />
    <div class="info">
      <div class="first-row">
        <span class="name">{{comment.user.username}}</span>
        <span class="time">{{hourAgo}}</span>
        <button class="reply" @click="handleReply"></button>
      </div>
      <div class="comment" :title="comment.comment">{{comment.comment}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 288px;
  min-height: 50px;
  padding: 0 16px;
  margin-bottom: 16px;

  .avatar {
    width: 32px;
    height: 32px;
  }
  .info {
    margin-left: 12px;
    .first-row {
      position: relative;
      width: 244px;
      height: 15px;
      .name {
        color: #8560a9;
        font-size: 12px;
        margin-right: 12px;
      }
      .time {
        color: #bababa;
        font-size: 10px;
      }
      .reply {
        border: none;
        position: absolute;
        width: 16px;
        height: 16px;
        right: 0;
        top: 2px;
        background: url("../assets/img/reply.svg");
      }
    }
    .comment {
      color: #666666;
      font-size: 14px;
      margin-top: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<script>
import { getHourDifference } from "../utils";
export default {
  name: "CommentItem",
  props: {
    comment: Object,
    onReply: Function
  },
  computed: {
    hourAgo() {
      const hrDiff = getHourDifference(this.comment.create_time, new Date());
      return `${Math.abs(hrDiff)} hours ago`;
    }
  },
  methods: {
    handleReply() {
      if (!this.$route.path.includes("comments")) {
        return;
      }
      this.onReply(this.comment.user.username);
    }
  }
};
</script>
