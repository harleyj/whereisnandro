import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { visualizer } from "rollup-plugin-visualizer";
import UnheadVite from "@unhead/addons/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import purgecss from '@fullhuman/postcss-purgecss'
// use purgecss
const postcssParentSelector = require("./src/js/plugins/postcss-parent-selector.js");

const isProduction = process.env.NODE_ENV === 'production';
export default defineConfig({
  define: {
    "process.env.ES_BUILD": process.env.ES_BUILD,
  },
  plugins: [
    laravel({
      input: ["./src/js/app.js"],
      refresh: true,
      hotFile: './hot',
    }),
    vue(),
    vuetify({
      autoImport: true,
      styles: { sass: true, configFile: "./src/sass/_variables.scss" },
    }),
    isProduction ? cssInjectedByJsPlugin() : '',
  ],
  css: {
    devSourcemap: true,
    postcss: {
      plugins: isProduction ? [
        postcssParentSelector({
          selector: "#nandroplanner",
          ignoredSelectors: [
            ':root',
            /^\.theme--*/,
            /^\.application--*/,
            /^\.mdi-*/,
            /^\.material-icons*/,
            /^\.material-icons-outlined*/,
            // Whitelist v-overlay
            /^\.v-overlay*/,
          ],
          replaceRootWithSelector: true
        })
      ] : [],
    }
  },
  build: {
    // minify: 'terser',
    outDir: '',
    emptyOutDir: false,
    manifest: false,
    rollupOptions: {
      // Don't hash
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        name: 'nandroplanner',
      },
      plugins: [
        // visualizer({
        //   open: true,
        // }),
      ],
    },
  },
  server: {
    hmr: {
      host: 'localhost',
    },
    open: "http://nandro.dv/",
    // origin: 'http://127.0.0.1:8080/',
    // cors: true,
    host: "localhost", // This fixed weird CORS issues
  },
});
