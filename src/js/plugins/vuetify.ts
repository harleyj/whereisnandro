import "vuetify/styles";
// import '../../sass/app.scss';

import { createVuetify, ThemeDefinition } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiInformationOutline } from "@mdi/js";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // background: "#f8f3f2",
    primary: "#ffd300",
    dusty: "#f6eee1",
    grey: "#b7b7b7",
    red: "#ee5524",
    ochre: "#de9f46",
    'ochre-lighten-1': "#e8a85a",
    'ochre-lighten-2': "#f0b86c",
    pink: "#f3b8cb",
    green: "#146858",
    blue: "#002f60",
    "ocean-blue": "#21509f",
    'grey-lighten-4': "#f8f3f2",
    'grey-darken-3': "#6e6e6e",
    'grey-darken-1': "#a8a8a8",
    white: "#ffffff",
  },
};

export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      info: mdiInformationOutline,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: lightTheme,
      // dark: darkTheme,
    },
  },
});
