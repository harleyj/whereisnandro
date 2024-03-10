import { defineStore } from "pinia";
// import { lightTypeOptions, reportModuleOptions } from "@/utils/constants";
import { reactive, computed } from "vue";
import dayjs from "dayjs";

/** Global Store */
export const useEventsStore = defineStore({
  id: "events",

  // Default Global State
  state: (): EventsState => ({
    data: [],
    categories: {},
    page: 1,
    per_page: 48,
    total_events: 0,
    total_pages: 0,
    filters: {
      campuses: [],
      other: [],
    },
    selectedFilters: {
      course: null,
      audience: [],
      campus: [null],
      misc: [],
      other: [],
    },
    brandColours: ["primary", "red", "green", "pink", "ochre", "ocean-blue", "primary", "red", "ochre", "pink", "green", "ocean-blue"],
  }),
  // Getters
  getters: {
    preferredEvents(state) {
      // Sort these events by their start_time as well
      return state.data.filter((event) => event.cat_courses?.length || event.cat_audiences?.length).sort((a, b) => a.start_time - b.start_time);
    },
    normalEvents(state) {
      return state.data.filter((event) => !event.cat_courses.length && !event.cat_audiences?.length);
    },
    groupedEvents(state) {
      if (!state.normalEvents.length) return;
      const grouped: any[] = [];

      // Loop over each event, and calculate the starting date of the week it's in. Then, push it into the grouped object (creating the week entry along the way if not present)
      state.normalEvents.forEach((event) => {
        const startTime = dayjs.unix(event.start_time);
        // Add one day so we don't start on a Sunday
        const weekStart = startTime.startOf("week").add(1, "day").format("YYYY-MM-DD");
        let weekExistsIndex = grouped.findIndex((v) => v.weekStart === weekStart);
        if (weekExistsIndex === -1) {
          grouped.push({
            weekStart: weekStart,
            events: [],
          });
          weekExistsIndex = grouped.length - 1;
        }
        // Now loop through events and group them by the day start
        const dayStart = startTime.startOf("day").format("YYYY-MM-DD");
        let dayExistsIndex = grouped[weekExistsIndex].events.findIndex((v) => v.dayStart === dayStart);
        if (dayExistsIndex === -1) {
          grouped[weekExistsIndex].events.push({
            dayStart: dayStart,
            events: [],
          });
          dayExistsIndex = grouped[weekExistsIndex].events.length - 1;
        }
        grouped[weekExistsIndex].events[dayExistsIndex].events.push(event);
      });
      return grouped;
    },
  },
  // Actions
  actions: {
    downloadICS(event) {
      const startTime = dayjs.unix(event.start_time);
      const endTime = dayjs.unix(event.end_time);

      // Find a match from the this.filters.campuses array for cat_campuses ({ name, term_id })
      const campusName = this.filters.campuses.find((campus) => campus.term_id === event.cat_campuses[0]).name;
      // Find a match in this.categories.event_locations array for event_location ({ name, term_id })
      const locationName = this.categories.event_locations.find((location) => location.term_id == event.event_location[0]).name;

      // Add anyt relevant links to the description (e.g. b1, b2, b3)
      let icsDescription = `Campus: ${campusName}\nLocation: ${locationName}\n\n` + event.content;
      if (event.b1 === "yes") {
        icsDescription += `\n\n${event.b1_text}\n${event.b1_link}`;
      }
      if (event.b2 === "yes") {
        icsDescription += `\n\n${event.b2_text}\n${event.b2_link}`;
      }
      if (event.b3 === "yes") {
        icsDescription += `\n\n${event.b3_text}\n${event.b3_link}`;
      }
      // console.log(icsDescription, event.content);
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nandro Planner//Orientation Planner//EN
BEGIN:VEVENT
UID:FLORIENTATION-${event.id}
DTSTAMP:${dayjs().format("YYYYMMDDTHHmmss")}
DTSTART:${startTime.format("YYYYMMDDTHHmmss")}
DTEND:${endTime.format("YYYYMMDDTHHmmss")}
SUMMARY:Nandro Planner: ${event.title}
DESCRIPTION:${sanitizeICSDescription(icsDescription)}
LOCATION:${locationName ?? ""}
END:VEVENT
END:VCALENDAR`;
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.title}.ics`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
});

function sanitizeICSDescription(text) {
  // Escape backslashes, commas, colons, and newlines
  text = text.replace(/\\/g, "\\\\");
  text = text.replace(/,/g, "\\,");
  text = text.replace(/:/g, "\\:");
  text = text.replace(/\n/g, "\\n");

  // Replace URLs with their escaped versions
  text = text.replace(/(https?:\/\/[^\s]+)/g, function (match) {
    return match.replace(/:/g, "\\:"); // Escape colons in URLs
  });

  return text;
}
