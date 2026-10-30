import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({ plugins: [vue()], server: { host: "127.0.0.1", watch: { ignored: ["**/.runtime/**", "**/.venv/**"] }, fs: { strict: true, deny: [".env", ".env.*", "**/.git/**", "**/.runtime/**", "**/.venv/**"] }, proxy: { "/comfy": { target: "http://127.0.0.1:8199", changeOrigin: false, ws: true, rewrite: path => path.replace(/^\/comfy/, "") } } } });
