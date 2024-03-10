<template>
  <!-- // bg-grey-lighten-4 -->
  <v-card class="fev-event-result-row elevation-0 bg-grey-lighten-4 rounded-lg mb-3 mb-lg-5" :data-eid="event.id">
    <v-row>
      <v-col cols="12" sm="6" lg="7" xl="8" class="pb-0 pb-md-3">
        <div class="fev-event-content pa-3 pa-sm-5 pa-md-6 pa-xl-8">
          <div class="text-subtitle-1 mt-n2 text-red" v-text="startTime" />
          <div class="text-h6 text-lg-h5" v-text="event.title" />

          <div class="text-body-1 mt-3">
            <span v-if="!expandText">{{ shortDescription }}</span>
            <span v-if="!expandText"> ... <a href="#" @click.prevent="expandText = !expandText">(read more)</a> </span>
            <span v-if="expandText">
              <div v-html="event.content" />
              <a href="#" @click.prevent="expandText = !expandText">(hide)</a>
            </span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="5" xl="4" class="pt-0 pt-md-3">
        <v-sheet class="bg-white pa-3 ma-3 rounded-lg">
          <table class="fev-event-info-grid fill-width text-grey-darken-3 text-body-2">
            <tr>
              <td class="pa-2" style="width: 60px"><v-icon :icon="mdiCalendar" aria-label="Date of event" /></td>
              <td class="pa-2 px-lg-3">
                <time :datetime="startDate" v-text="startDate" />
                <!-- Make start and end times accessible             -->
                <span v-if="endDate != startDate">
                  -
                  <time :datetime="endDate" v-text="endDate" />
                </span>
              </td>
            </tr>
            <tr>
              <td class="pa-2"><v-icon :icon="startTimeIcon" aria-label="Time of event" /></td>
              <td class="pa-2 px-lg-3"><time :datetime="startTime" v-text="startTime" /> - <time :datetime="endTime" v-text="endTime" /></td>
            </tr>
            <tr v-if="event.event_location && matchedLocation">
              <td class="pa-2"><v-icon :icon="mdiMapMarker" aria-label="Location of event" /></td>
              <td class="pa-2 px-lg-3">
                <span v-text="matchedLocation.name" />
                <!-- Does this location have an address field? -->
                <a v-if="matchedLocation.lat && matchedLocation.lng" :href="`https://maps.google.com/?q=${matchedLocation.lat},${matchedLocation.lng}`" target="_blank" class="d-inline-block ml-1"> Maps <v-icon :icon="mdiOpenInNew" /></a>
                <a v-else-if="matchedLocation.address" :href="`https://maps.google.com/?q=${matchedLocation.address}`" target="_blank" class="d-inline-block ml-1">Maps <v-icon :icon="mdiOpenInNew" /></a>
              </td>
            </tr>
            <tr v-else-if="eventCampuses">
              <td class="pa-2"><v-icon :icon="mdiMapMarker" aria-label="Campus of event" /></td>
              <td class="pa-2 px-lg-3"><span v-text="eventCampuses.map((v) => v.name).join(', ')" /> campus</td>
            </tr>
            <tr>
              <td class="pa-2"><v-icon :icon="mdiCalendarExport" aria-label="Download event to calendar as an ICS file" /></td>
              <td class="pa-2 px-lg-3">
                <a @click.prevent="events.downloadICS(event)" href="#"> Download calendar file </a>
              </td>
            </tr>
          </table>
        </v-sheet>
      </v-col>
    </v-row>
    <div class="fev-event-footer bg-grey-lighten-3 d-flex justify-end grey-border-top py-3 px-1 py-lg-5 px-lg-3" v-if="shouldShowFooter">
      <template v-if="event.b1 && event.b1 != 'no' && event.b1_link">
        <v-btn color="red" :href="event.b1_link" variant="flat" target="_blank" class="mr-1 mr-lg-2" :size="smAndDown ? 'small' : 'large'">
          <span v-text="event.b1_text" />
        </v-btn>
      </template>
      <template v-if="event.b2 && event.b2 != 'no' && event.b2_link">
        <v-btn color="red" :href="event.b2_link" variant="flat" target="_blank" class="mr-1 mr-lg-2" :size="smAndDown ? 'small' : 'large'">
          <span v-text="event.b2_text" />
        </v-btn>
      </template>
      <template v-if="event.b3 && event.b3 != 'no' && event.b3_link">
        <v-btn color="red" :href="event.b3_link" variant="outlined" target="_blank" class="mr-1 mr-lg-2" :size="smAndDown ? 'small' : 'large'">
          <span v-text="event.b3_text" />
        </v-btn>
      </template>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCalendar, mdiCalendarExport, mdiClockTimeEightOutline, mdiClockTimeElevenOutline, mdiClockTimeFiveOutline, mdiClockTimeFourOutline, mdiClockTimeNineOutline, mdiClockTimeOneOutline, mdiClockTimeSevenOutline, mdiClockTimeSixOutline, mdiClockTimeTenOutline, mdiClockTimeThreeOutline, mdiClockTimeTwelveOutline, mdiClockTimeTwoOutline, mdiMapMarker, mdiOpenInNew } from "@mdi/js";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { useDisplay } from 'vuetify';
import { courses } from "../plugins/constants";

import { useEventsStore } from "../plugins/store/events";
const events = useEventsStore();
const mdiClockTimes = [mdiClockTimeOneOutline, mdiClockTimeTwoOutline, mdiClockTimeThreeOutline, mdiClockTimeFourOutline, mdiClockTimeFiveOutline, mdiClockTimeSixOutline, mdiClockTimeSevenOutline, mdiClockTimeEightOutline, mdiClockTimeNineOutline, mdiClockTimeTenOutline, mdiClockTimeElevenOutline, mdiClockTimeTwelveOutline];

const shouldShowFooter = computed(() => {
  return (event.b1 && event.b1 != "no" && event.b1_link) || (event.b2 && event.b2 != "no" && event.b2_link) || (event.b3 && event.b3 != "no" && event.b3_link);
});
const { smAndDown } = useDisplay()

const { event, filters } = defineProps({
  event: {
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

const eventType = computed(() => {
  if (event.cat_general) {
    return event.cat_general.map((item) => {
      let found = events.categories.cat_general?.find((audience) => audience.term_id == item);
      if (found) return found;
    });
  }
});

const eventAudiences = computed(() => {
  if (event.cat_audiences) {
    return event.cat_audiences.map((item) => {
      let found = events.categories.cat_audiences?.find((audience) => audience.term_id == item);
      if (found) return found;
    });
  }
});

// @todo - hide this
const eventCourses = computed(() => {
  if (event.cat_courses) {
    return event.cat_courses.reduce((acc, eventType3Slug) => {
      let slug = eventType3Slug.toUpperCase();
      let found = courses.find((course) => course.value == slug);
      if (found) acc.push(found.title);
      return acc;
    }, []);
  }
});

const eventCampuses = computed(() => {
  if (event.cat_campuses && filters.campuses?.length) {
    return event.cat_campuses.map((item) => {
      let found = filters.campuses?.find((campus) => campus.term_id == item);
      if (found) return found;
    });
  }
});

const eventColleges = computed(() => {
  if (event.event_type_6) {
    return event.event_type_6.map((item) => {
      let found = events.categories.event_type_6?.find((college) => college.term_id == item);
      if (found) return found;
    });
  }
});

const eventMisc = computed(() => {
  if (event.event_type_7) {
    return event.event_type_7.map((item) => {
      let found = events.categories.event_type_7?.find((misc) => misc.term_id == item);
      if (found) return found;
    });
  }
});

const shouldShowEventGrid = computed(() => {
  return eventType.value || eventAudiences.value || eventCourses.value || eventCampuses.value || eventColleges.value || eventMisc.value;
});
const isPreferredEvent = computed(() => {
  return event.cat_courses && event.cat_courses.length;
});

// Need to parse dates in GMT because of how they come from the server.
const startDateObject = computed(() => {
  return dayjs.unix(event.start_time); //.tz("GMT");
});
const endDateObject = computed(() => {
  return dayjs.unix(event.end_time); //.tz("GMT");
});
const startTime = computed(() => {
  return startDateObject.value.format("h:mm A");
});
const startTimeIcon = computed(() => {
  let hour = startDateObject.value.hour() - 1;
  if (hour > 11) hour = hour - 12;
  return mdiClockTimes[hour];
});
const endTime = computed(() => {
  return endDateObject.value /*.tz("GMT")*/
    .format("h:mm A");
});
const startDate = computed(() => {
  return startDateObject.value.format("DD/MM/YYYY");
});
const endDate = computed(() => {
  return endDateObject.value.format("DD/MM/YYYY");
});
const expandText = ref(false);
const shortDescription = computed(() => {
  // Remove HTML tags and truncate to 90 words
  const size = smAndDown.value ? 30 : 90
  return event.content
    .replace(/(<([^>]+)>)/gi, "")
    .split(" ")
    .splice(0, size)
    .join(" ");
});
const extraText = computed(() => {
  // Remove HTML tags and truncate to 90 words
  const size = smAndDown.value ? 30 : 90
  return event.content
    .replace(/(<([^>]+)>)/gi, "")
    .split(" ")
    .splice(0, size)
    .join(" ");
});
const matchedLocation = computed(() => {
  if (event.event_location) {
    return events.categories.event_locations?.find((location) => location.term_id == event.event_location);
  }
});
</script>
