<template>
  <div class="event-brief">
    <span class="channel-name">{{channelName}}</span>
    <span class="event-name">{{details.name}}</span>
    <div class="creator-info">
      <img class="creator-avatar" :src="avatar" />
      <div class="creator-text-info">
        <span class="creator-name">{{creatorName}}</span>
        <span class="create-time">
          Published {{getDaysAgo(details.create_time)}} days ago
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-brief {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 320px;
  margin: 16px 0 20px 16px;

  .channel-name {
    margin-bottom: 12px;
    color: #8560a9;
    font-size: 12px;
    padding: 0 8px;
    line-height: 1.5;
    border-radius: 10px;
    border: 1px solid #d3c1e5;
  }
  .event-name {
    width: 288px;
    margin-bottom: 16px;
    font-size: 20px;
    color: #453257;
    font-weight: 500;
  }
  .creator-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .creator-avatar {
      width: 36px;
      height: 36px;
      border-radius: 36px;
      margin-right: 12px;
    }
    .creator-text-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .creator-name {
        line-height: 1.5;
        font-size: 14px;
        color: #67616d;
      }
      .create-time {
        font-size: 12px;
        color: #bababa;
      }
    }
  }
}
</style>

<script>
import { getDayDifference } from "../utils";

export default {
  name: "EventBrief",
  props: {
    details: Object
  },
  computed: {
    creatorName() {
      return (this.details.creator && this.details.creator.name) || "";
    },
    avatar() {
      return (this.details.creator && this.details.creator.avatar) || "";
    },
    channelName() {
      return (this.details.channel && this.details.channel.name) || "";
    }
  },
  methods: {
    getDaysAgo(createTime) {
      const now = new Date();
      return getDayDifference(now, createTime);
    }
  }
};
</script>
