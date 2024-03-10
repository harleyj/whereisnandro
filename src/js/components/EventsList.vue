<template>
  <div class="fev-event-results-wrapper fev-event-style-list py-0" v-if="events.groupedEvents && events.groupedEvents.length">
    <v-row v-if="events.preferredEvents.length" class="mb-3 mb-lg-6 mb-xl-12 fev-event-results-preferred">
      <v-col cols="12" md="4" lg="3" class="border-bottom pa-3 px-lg-6">
        <div class="pa-3 pa-lg-6" :class="`bg-green`">
          <div class="fev-week-week">Recommended events</div>
          <div class="fev-week-literal">Based on your selected course</div>
        </div>
      </v-col>
      <v-col>
        <EventRow v-for="event in events.preferredEvents" :key="event.id" :event="event" :filters="filters" />
      </v-col>
    </v-row>
    <v-row v-for="(group, index) in events.groupedEvents" :key="index" class="mb-3 mb-lg-6 mb-xl-12">
      <v-col cols="12" md="4" lg="3" class="border-bottom pa-3 pb-0 px-lg-6 pb-lg-3">
        <div class="pa-3 pa-lg-6">
          <div class="fev-week-text">Week starting</div>
          <div class="fev-week-week">
            <!-- Jan 24th (etc) -->
            {{ dayjs(group.weekStart).format("MMMM D") }}
          </div>
          <div class="fev-week-literal">
            <!-- Jan 24 - Jan 31, etc-->
            {{ dayjs(group.weekStart).format("MMM D") }} - {{ dayjs(group.weekStart).add(6, "day").format("MMM D") }}
          </div>
        </div>
      </v-col>
      <v-col>
        <div v-for="day in group.events" :key="day.dayStart">
          <div class="fev-event-day d-inline-block pa-3 px-lg-5 font-weight-bold mb-2 mb-lg-3" :key="day.dayStart">
            {{ dayjs(day.dayStart).format("dddd, MMM D") }}
          </div>
          <EventRow v-for="event in day.events" :key="event.id" :event="event" :filters="filters" />
        </div>
      </v-col>
    </v-row>
    <!-- <div class="fev-event-result" v-for="event in events.data" :key="event.id" :class="{ 'fev-event-result-preferred': event.cat_courses.length }">
      <EventCard :event="event" :filters="filters" />
    </div>
    <div class="fev-event-spacer flex-grow-1 flex-shrink-0" /> -->
  </div>
</template>
<script setup lang="ts">

import { useEventsStore } from "../plugins/store/events";
import { computed } from "vue";
import dayjs from "dayjs";
import EventRow from "./EventRow.vue";

const events = useEventsStore();

const { filters } = defineProps({
  filters: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

</script>
