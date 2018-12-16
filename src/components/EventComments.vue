<template>
  <div class="event-comments">
    <div v-if="justSentComment" class="toast">Message sent!</div>
    <CommentList :onReply="onReply" />
    <div class="comment-panel">
      <div class="input-area">
        <img class="rm-input" src="../assets/img/cross.svg" @click="removeInput" />
        <input class="comment-input" :placeholder="inputHintText" v-model="commentToSend" />
      </div>
      <button class="send-comment" @click="sendComment"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-comments {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 320px;
  .toast {
    background: #e5f7a9;
    width: 100%;
    height: 32px;
    color: #8560a9;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 32px;
  }
  .comment-panel {
    display: flex;
    width: 320px;
    height: 56px;
    justify-content: flex-start;
    align-items: center;
    .input-area {
      display: flex;
      align-items: center;
      background: #8560a9;
      width: 256px;
      height: 56px;

      .rm-input {
        margin-left: 4px;
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
      .comment-input {
        width: 207px;
        height: 32px;
        border-radius: 20px;
        background: #fff;
        padding-left: 18px;
        margin-left: 4px;
        border: none;
        &::placeholder {
          font-size: 14px;
          color: #d3c1e5;
        }
      }
    }
    .send-comment {
      position: relative;
      height: 56px;
      width: 64px;
      background: #d5ef7f;
      &::before {
        display: block;
        content: "";
        background: url("../assets/img/send.svg");
        width: 28px;
        height: 28px;
        margin-left: 10px;
      }
    }
  }
}
</style>

<script>
import { mapActions } from "vuex";
import CommentList from "./CommentList.vue";

export default {
  name: "EventComments",
  components: {
    CommentList
  },
  data() {
    return {
      replyTo: "",
      commentToSend: "",
      justSentComment: false
    };
  },
  computed: {
    inputHintText() {
      return this.replyTo ? `@${this.replyTo}` : "Leave your comment here";
    },
    hasCommentsAbove() {
      return false;
    }
  },
  methods: {
    ...mapActions("event", ["postComment"]),
    onReply(username) {
      this.commentToSend = "";
      this.replyTo = username;
    },
    removeInput() {
      this.commentToSend = "";
    },
    showToast() {
      this.justSentComment = true;
      setTimeout(() => {
        this.justSentComment = false;
      }, 3000);
    },
    async sendComment() {
      const eventId = +this.$route.params.id;
      const comment = this.replyTo
        ? `@${this.replyTo} ${this.commentToSend}`
        : this.commentToSend;
      await this.postComment({ eventId, comment });
      this.removeInput();
      this.showToast();
    }
  }
};
</script>
