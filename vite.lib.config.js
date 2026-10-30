import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  base: "./",
  plugins: [vue()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    lib: { entry: "web_src/extension.js", formats: ["es"], fileName: () => "slap_stickers.js" },
    outDir: process.env.SS_BUILD_DIR || "web", emptyOutDir: true, assetsInlineLimit: 0,
    rollupOptions: { external: [/^\.\.\/\.\.\/scripts\//], output: { chunkFileNames: ".lazy/[name]-[hash].js", assetFileNames: "slap_stickers.[ext]" } }
  },
  worker: { format: "es", rollupOptions: { output: { entryFileNames: ".lazy/[name]-[hash].js" } } }
});
