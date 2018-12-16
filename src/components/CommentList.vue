<template>
  <div class="comment-list">
    <CommentItem
      v-for="comment in eventComments"
      :key="comment.id"
      :comment="comment"
      :onReply="onReply"
    />
  </div>
</template>

<style scoped lang="scss">
.comment-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 320px;
  height: 320px;
  overflow-x: hidden;
  overflow-y: scroll;
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
</style>

<script>
import { mapState } from "vuex";
import CommentItem from "./CommentItem.vue";

export default {
  name: "CommentList",
  props: {
    onReply: Function
  },
  components: {
    CommentItem
  },
  computed: {
    ...mapState("event", ["eventComments"])
  }
};
</script>
