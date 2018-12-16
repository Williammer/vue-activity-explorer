<template>
  <router-link :to="`/detail/${eventData.id}`">
    <div class="event-card">
      <div class="header">
        <img class="creator-avatar" :src="eventData.creator.avatar" />
        <span class="creator-name">{{eventData.creator.username}}</span>
        <span class="channel">{{eventData.channel.name}}</span>
      </div>
      <div class="sub-header">
        <div>
          <h3 class="event-name" :title="eventData.name">{{eventData.name}}</h3>
          <span class="time-info">{{displayTimeInfo}}</span>
        </div>
        <div
          v-if="eventData.images && eventData.images.length"
          class="event-cover"
          :style="{
            background: 'url('+eventData.images[1]+') center center no-repeat',
            backgroundSize: 'cover'
          }"
        ></div>
      </div>
      <p class="description" :title="eventData.description">
        {{eventData.description}}
      </p>
      <div class="me-info">
        <div v-if="eventData.me_going" class="join-info me">
         I am going!
        </div>
        <div v-else class="join-info">
         {{eventData.goings_count}} Going
        </div>
        <div v-if="eventData.me_likes" class="like-info me">
         I like it!
        </div>
        <div v-else class="like-info">
         {{eventData.likes_count}} Likes
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
}
.event-card:hover {
  box-shadow: -4px 4px 10px 0px #e8e8e8;
}
.event-card {
  transition: box-shadow 0.2s ease-in;
  width: 304px;
  padding-left: 16px;
  height: 208px;
  cursor: pointer;
  padding-top: 14px;
  justify-content: flex-start;
  align-items: center;

  .header {
    position: relative;
    display: flex;
    height: 20px;

    .creator-avatar {
      width: 20px;
      height: 20px;
      border-radius: 20px;
    }
    .creator-name {
      line-height: 1.6;
      margin-left: 8px;
      font-size: 12px;
      color: #67616d;
      font-weight: bold;
    }
    .channel {
      position: absolute;
      top: 0;
      right: 16px;
      color: #8560a9;
      font-size: 12px;
      height: 18px;
      padding: 0 8px;
      line-height: 1.5;
      border-radius: 10px;
      border: 1px solid #d3c1e5;
    }
  }
  .sub-header {
    display: flex;
    margin-right: 16px;
    margin-top: 8px;
    margin-bottom: 12px;
    height: 68px;
    justify-content: space-between;

    .event-name {
      font-size: 18px;
      color: #453257;
      margin: 0;
      margin-right: 8px;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .time-info::before {
      display: inline-block;
      content: "";
      width: 12px;
      height: 12px;
      background: url("../assets/img/time.svg");
      vertical-align: -2px;
      margin-right: 5px;
    }
    .time-info {
      position: relative;
      font-size: 12px;
      color: #8560a9;
    }

    .event-cover {
      flex: 0 0 64px;
      width: 64px;
      height: 64px;
    }
  }
  .description {
    margin: 0;
    margin-right: 16px;
    width: 288px;
    height: 54px;
    font-size: 14px;
    color: #67616d;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .me-info {
    height: 45px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: #ac8ec9;
    border-bottom: 1px #e8e8e8 solid;

    .join-info {
      margin-right: 30px;
    }
    .join-info.me,
    .like-info.me {
      color: #453257;
    }
    .join-info::before,
    .like-info::before {
      display: inline-block;
      content: "";
      margin-right: 5px;
    }
    .join-info::before {
      width: 9.6px;
      height: 9.8px;
      background: url("../assets/img/check-outline.svg");
    }
    .join-info.me::before {
      background: url("../assets/img/check.svg");
    }
    .like-info::before {
      width: 12px;
      height: 11px;
      vertical-align: -1px;
      background: url("../assets/img/like-outline.svg");
    }
    .like-info.me::before {
      background: url("../assets/img/like.svg");
    }
  }
}
</style>
<script>
export default {
  name: "EventCard",
  props: {
    eventData: Object
  },
  computed: {
    displayTimeInfo() {
      const { eventData, formatTime } = this;
      const { create_time, update_time } = eventData;
      return `${formatTime(create_time)} - ${formatTime(update_time)}`;
    }
  },
  methods: {
    formatTime(dateStr) {
      const dateTime = new Date(dateStr);
      const date = dateTime.toDateString().substr(4);
      if (this.eventData.images && this.eventData.images.length) {
        return date;
      }
      return `${date} ${dateTime.toTimeString().substr(0, 5)}`;
    }
  }
};
</script>
