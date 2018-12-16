<template>
  <div class="event-list">
    <EventCard v-for="event in events" :eventData="event" :key="event.id" />
  </div>
</template>

<script>
import EventCard from "./EventCard.vue";

export default {
  name: "EventList",
  components: {
    EventCard
  },
  props: {
    events: Array
  }
};
</script>

<style scoped lang="scss">
.event-list {
  width: 320px;
}
</style>
