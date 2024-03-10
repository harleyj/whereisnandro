import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import vuetify from "vite-plugin-vuetify";

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
