<template>
  <div class="fev-event-results-wrapper fev-event-style-list py-3 mt-md-2 mt-lg-4" v-if="events.data && events.data.length">
    <v-row v-if="preferredEvents.length" class="mb-3 mb-lg-6 mb-xl-12">
      <v-col cols="12" md="4" lg="3" class="border-bottom pa-3 px-lg-6">
        <div class="pa-3 pa-lg-6" :class="`bg-${rotationOfBrandColoursForRows[5]}`">
          <div class="fev-week-week">Recommended events</div>
          <div class="fev-week-literal">Based on your selected course</div>
        </div>
      </v-col>
      <v-col>
        <EventRow v-for="event in preferredEvents" :key="event.id" :event="event" :categories="events.categories" :filters="filters" />
      </v-col>
    </v-row>
    <v-row v-for="(group, index) in groupedEvents" :key="index" class="mb-3 mb-lg-6 mb-xl-12">
      <v-col cols="12" md="4" lg="3" class="border-bottom pa-3 px-lg-6">
        <div class="pa-3 pa-lg-6" :class="`bg-${rotationOfBrandColoursForRows[index]}`">
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
        <EventRow v-for="event in group.events" :key="event.id" :event="event" :categories="events.categories" :filters="filters" />
      </v-col>
    </v-row>
    <!-- <div class="fev-event-result" v-for="event in events.data" :key="event.id" :class="{ 'fev-event-result-preferred': event.cat_courses.length }">
      <EventCard :event="event" :categories="events.categories" :filters="filters" />
    </div>
    <div class="fev-event-spacer flex-grow-1 flex-shrink-0" /> -->
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import EventRow from "./EventRow.vue";

const { events, filters } = defineProps({
  events: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  filters: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const preferredEvents = computed(() => {
  return events.data.filter((event) => event.cat_courses?.length);
});
const normalEvents = computed(() => {
  return events.data.filter((event) => !event.cat_courses.length);
});
const rotationOfBrandColoursForRows = [
  "primary",
  "red",
  "ochre",
  "pink",
  "green",
  "blue",
  "ocean-blue",
];

const groupedEvents = computed(() => {
  if (!normalEvents.value.length) return;
  const grouped: any[] = [];

  // Loop over each event, and calculate the starting date of the week it's in. Then, push it into the grouped object (creating the week entry along the way if not present)
  normalEvents.value.forEach((event) => {
    const weekStart = dayjs(event.start_time).startOf("week").format("YYYY-MM-DD");
    let weekExistsIndex = grouped.findIndex((v) => v.weekStart === weekStart);
    if (weekExistsIndex === -1) {
      grouped.push({
        weekStart: weekStart,
        events: [],
      });
      weekExistsIndex = grouped.length - 1;
    }
    grouped[weekExistsIndex].events.push(event);
  });
  return grouped;
});
</script>
