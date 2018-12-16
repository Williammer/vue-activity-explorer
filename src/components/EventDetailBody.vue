<template>
  <div class="event-detail-body">
    <EventImages :imgs="details.images" />
    <EventDescription :desc="details.description" />
    <EventTime :begin="details.begin_time" :end="details.end_time" />
    <EventLocation :location="details.location" />
    <EventInvolvements />
  </div>
</template>

<style scoped lang="scss">
.event-detail-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 320px;
}
</style>

<script>
import EventImages from "./EventImages.vue";
import EventDescription from "./EventDescription.vue";
import EventTime from "./EventTime.vue";
import EventLocation from "./EventLocation.vue";
import EventInvolvements from "./EventInvolvements.vue";

export default {
  name: "EventDetailBody",
  components: {
    EventImages,
    EventDescription,
    EventTime,
    EventLocation,
    EventInvolvements
  },
  props: {
    details: Object
  }
};
</script>
