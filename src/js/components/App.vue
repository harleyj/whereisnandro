<template>
  <v-app>
    <v-container :class="`fev-scope-${scope}`">
      <v-sheet color="grey-lighten-4" class="pa-3 pa-lg-6 p-relative">
        <div class="d-flex mx-n1 mx-md-n3 fev-filters-wrapper flex-wrap flex-md-nowrap">
          <div class="fev-select-filter fev-select-filter-courses flex-grow-1 flex-shrink-1 mt-2 mt-md-0 mx-1 mx-md-3">
            <div class="fev-filter-label">Select your course</div>
            <select class="fev-mobile-select text-body-1" v-if="mobile" v-model="events.selectedFilters.course"
              placeholder="Tap to select your course...">
              <option selected disabled :value="null">Select your course...</option>
              <option v-for="(course, index) in courses" :key="index" :value="course.value">{{ course.title }}</option>
            </select>
            <v-select v-else-if="mdAndDown" v-model="events.selectedFilters.course" :items="courses"
              placeholder="Tap to select your course..." variant="outlined" bg-color="white" hide-details
              :density="mdAndDown ? 'compact' : 'default'" :menu-props="{
                attach: '.fev-select-filter-courses',
              }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" v-text="`${item.title} [${item.value}]`" />
              </template>
              <template v-slot:selection="{ props, item }">
                <span v-bind="props" v-text="`${item.title} [${item.value}]`" />
              </template>
            </v-select>
            <v-autocomplete v-else v-model="events.selectedFilters.course" :items="courses"
              placeholder="Tap to select your course..." variant="outlined" hide-details :menu-props="{
                attach: '.fev-select-filter-courses',
              }" bg-color="white">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" v-if="item.raw.campus"
                  v-text="`${item.title} ${item.raw.campus} [${item.value}]`" />
                <v-list-item v-else v-bind="props" v-text="`${item.title} [${item.value}]`" />
              </template>
              <template v-slot:selection="{ props, item }">
                <span v-bind="props">
                  <span v-text="item.title" />
                  <span v-if="item.raw.campus" class="text-grey-darken-1">&nbsp;{{ item.raw.campus }}</span>
                  <span>&nbsp;[{{ item.value }}]</span>
                </span>
              </template>
            </v-autocomplete>
          </div>
          <div class="fev-select-filter fev-select-filter-campuses flex-grow-1 flex-shrink-1 mt-2 mt-md-0 mx-1 mx-md-3"
            ref="eventFiltersWrapper">
            <div class="fev-filter-label">Select your campus</div>
            <v-select v-model="events.selectedFilters.campus" :items="campusesComputed" variant="outlined" hide-details
              placeholder="Tap to select your campus..." item-value="term_id" item-title="name" bg-color="white"
              :density="mdAndDown ? 'compact' : 'default'" multiple :menu-props="{
                attach: '.fev-select-filter-campuses',
              }"></v-select>
          </div>
          <!-- <div class="fev-select-filter fev-select-filter-other flex-grow-1 flex-shrink-1 mt-2 mt-md-0 mx-1 mx-md-3">
            <div class="fev-filter-label">Other filters</div>
            <v-select
              v-model="events.selectedFilters.other"
              :items="events.filters.other"
              variant="outlined"
              hide-details
              placeholder="Tap to filter other options..."
              bg-color="white"
              :density="mdAndDown ? 'compact' : 'default'"
              multiple
              :menu-props="{
                attach: '.fev-select-filter-other',
              }"
            ></v-select>
          </div> -->
          <div
            class="fev-clear-filters-wrapper flex-grow-1 flex-shrink-1 d-flex align-flex-end mt-2 mt-md-0 px-1 px-md-3">
            <v-btn @click="clearFilters" color="red" variant="outlined" class="mt-auto mr-3"
              :size="mdAndDown ? 'small' : 'x-large'" block>Clear<span v-if="!mdAndDown">&nbsp;filters</span></v-btn>
          </div>
        </div>
        <div class="fev-search-wrapper mt-3 mt-lg-6" ref="eventSearchWrapper">
          <v-text-field bg-color="white" v-model="search" placeholder="Start typing to search..." hide-details clearable
            variant="outlined" :density="mdAndDown ? 'compact' : 'default'">
            <template v-slot:prepend-inner>
              <v-icon :icon="mdiMagnify" :size="smAndDown ? 20 : 24" color="green" />
            </template>
          </v-text-field>
        </div>
        <div class="d-flex align-center mt-1 mt-md-3 mt-lg-6 fev-filters-wrapper flex-wrap flex-md-nowrap">
          <span class="fev-filter-label mr-3 my-1">Additional filters:</span>
          <div v-for="(otherFilter, index) in events.filters.other" :key="index"
            class="mr-3 mr-lg-6 bg-white pl-1 pr-2 pl-md-2 pr-md-4 rounded-md grey-border">
            <v-checkbox v-model="events.selectedFilters.other" :label="otherFilter.title" :value="otherFilter.value"
              :input-value="otherFilter.value" :density="mdAndDown ? 'compact' : 'default'" color="green" hide-details>
              <template v-slot:label>
                <span class="fev-checkbox-label text-body-2 text-lg-body-1">{{ otherFilter.title }}</span>
              </template>
            </v-checkbox>
          </div>
        </div>
      </v-sheet>

      <v-sheet color="grey-lighten-4 pa-3 pa-lg-6 mt-1 mt-lg-2 d-md-flex align-md-center justify-md-space-between">
        <div v-if="!smAndDown">
          <div v-if="events.data && events.data.length" class="text-center text-grey-darken-1">Showing {{ (events.page -
            1) * events.per_page + 1 }} - {{ (events.page - 1) * events.per_page + events.data.length }} of {{
    events.total_events }} events</div>
        </div>
        <div>
          <v-btn-toggle v-model="displayType" class="ml-md-3 mr-md-0 mt-lg-0 pa-1 bg-white" mandatory
            :density="lgAndDown ? 'compact' : 'default'">
            <v-btn :value="'grid'"><v-icon color="blue" :icon="mdiViewGrid" class="ml-n1 mr-2" />Grid view</v-btn>
            <v-btn :value="'list'"><v-icon color="blue" :icon="mdiViewAgenda" class="ml-n1 mr-2" />List view</v-btn>
          </v-btn-toggle>
        </div>
      </v-sheet>

      <div class="fev-event-loading my-1 my-md-3 mb-lg-6">
        <v-progress-linear indeterminate size="64" width="9" color="ochre" v-show="loadingEvents"></v-progress-linear>
      </div>
      <div v-if="wantsToSeeMandatoryEvents && !events.preferredEvents.length && !loadingEvents"
        class="text-center mb-6 mb-lg-10">
        <div v-if="events.selectedFilters.course">It looks like there's no extra scheduled events for your chosen course
          (<span v-text="events.selectedFilters.course"></span>) at this time.</div>
        <div v-else-if="events.selectedFilters.other">It looks like there's no extra scheduled events for your chosen
          filter at this time.</div>
      </div>

      <EventsList v-if="events.data && events.data.length"
        :loading-events="loadingEvents" />

      <div v-if="(!events.data || !events.data.length) && !loadingEvents"
        class="text-center mt-6 mt-lg-10 text-grey-darken-1">
        <div>Sorry, we couldn't find any events here.</div>
        <div v-if="search" class="mt-3">Try searching for something else.</div>
      </div>

      <div v-if="events.data && events.data.length && !isNaN(events.total_events)"
        class="text-center mt-6 mt-lg-10 text-grey-darken-1">Showing {{ (events.page - 1) * events.per_page + 1 }} - {{
          (events.page - 1) * events.per_page + events.data.length }} of {{ events.total_events }} events</div>
      <div v-show="loadingEvents && events.data && events.data.length" style="max-width: 200px"
        class="mx-auto mt-4 mb-n4">
        <v-progress-linear class="mx-auto" indeterminate color="ochre" width="9" size="64"></v-progress-linear>
      </div>
      <div class="fev-event-pagination-wrapper pa-3 mt-md-2 mt-lg-5" v-if="events.data && events.data.length">
        <v-pagination v-model="currentPage" :length="events.total_pages" :totalVisible="6" variant="outlined" />
      </div>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { mdiMagnify, mdiViewAgenda, mdiViewGrid } from "@mdi/js";
import { courses } from "../plugins/constants";
import { useDisplay } from "vuetify";
import EventsList from "./EventsList.vue";
import axios from "axios";
import { useEventsStore } from "../plugins/store/events";

const { mobile, smAndDown, mdAndDown, lgAndDown } = useDisplay();
const scope = ref("orientation");
const eventSearchWrapper = ref(null);
const eventFiltersWrapper = ref(null);
const initialLoad = ref(false);
const events = useEventsStore();

const apiUrl = "/events";
const apiFiltersUrl = "/filters";

const displayType = ref("grid");

// User input
const currentPage = ref(1);
const search = ref("");
const itemsPerPage = ref(60);
const clearFilters = () => {
  events.selectedFilters = {
    course: null,
    audience: [],
    campus: [null],
    misc: [],
    other: []
  };
  currentPage.value = 1;
};

const fetchFilters = async () => {
  // Send a GET request to the api endpoint
  await axios
    .get(apiFiltersUrl, {
      params: {
        scope: scope.value,
      },
    })
    .then((res) => {
      // Set the value of the events variable
      events.filters = res.data;
    })
    .catch((error) => {
      // console.log(error);
    });
};

const loadingEvents = ref(true);
const loadingEventsTimeout: any = ref(null);
const fetchEvents = (shouldJump: boolean = true, shouldResetColours: boolean = false) => {
  // Send a GET request to the api endpoint
  loadingEvents.value = true;
  clearTimeout(loadingEventsTimeout.value);
  loadingEventsTimeout.value = setTimeout(() => {
    axios
      .get(apiUrl, {
        params: {
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value,
          search: search.value,
          ...events.selectedFilters,
          scope: scope.value,
        },
      })
      .then((res) => {
        // Is the user's screen below the .event-results-wrapper element? If so, then smooth scroll up...

        // Set the value of the events variable
        events.data = res.data.data;
        events.categories = res.data.categories;
        events.page = res.data.page;
        events.per_page = res.data.per_page;
        events.total_events = res.data.total_events;
        events.total_pages = res.data.total_pages;
      })
      .catch((error) => {
        // console.log(error);
      })
      .finally(() => {
        // Has the user already scrolled past this element? If so, allow scrollIntoView
        const hasScrolledPast = window.scrollY > eventSearchWrapper.value?.offsetTop;
        if (shouldJump && hasScrolledPast && eventSearchWrapper.value && initialLoad.value)
          eventSearchWrapper.value?.scrollIntoView({
            block: "start",
            behavior: "smooth",
          });

        initialLoad.value = true;
        loadingEvents.value = false;
      });
  }, 300);
};

onMounted(async () => {
  await fetchFilters();
  fetchEvents(false);
});

const campusesComputed = computed(() => {
  return [{ name: "All campuses", term_id: null }, ...events.filters?.campuses];
});
const wantsToSeeMandatoryEvents = computed(() => {
  // have they selected a course, or an audience (other) filter?
  return events.selectedFilters.course || events.selectedFilters.other.length;
})

// watchEffect(
//   () => {
//     console.log(events.selectedFilters.campus)
//   }
// );
const changeCampusTimeous = ref(null);
watch(
  () => events.selectedFilters.campus,
  (newVal, oldVal) => {
    // // Is 'null' in newVal but not oldVal? unchecke verything else
    if (newVal.length > 1 && oldVal.includes(null)) {
      // Then remove 'All campuses' from the list
      events.selectedFilters.campus = newVal.filter((v) => v !== null);
    } else if (newVal.includes(null) && newVal.length > 1 && !oldVal.includes(null)) {
      // They selected 'All campuses' - so remove all additionals
      events.selectedFilters.campus = [null];
    } else if (newVal.length === 0) {
      events.selectedFilters.campus = [null];
    }
    fetchEvents();
  }
);
watch(
  () => [currentPage.value],
  () => {
    fetchEvents();
  }
);
watch(
  () => [search.value, itemsPerPage.value, events.selectedFilters.course, events.selectedFilters.other],
  () => {
    currentPage.value = 1;
    fetchEvents(false, true);
  }
);
</script>

<style>@import "../../sass/app.scss";</style>
