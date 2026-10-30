import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser", workers: 1, timeout: 30000,
  use: { browserName: process.env.SS_BROWSER || "chromium", baseURL: "http://127.0.0.1:5187", viewport: { width: 1280, height: 900 }, screenshot: "only-on-failure",
    launchOptions: { args: process.env.SS_BROWSER === "webkit" ? [] : ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
  webServer: process.env.SS_EXTERNAL_SERVER ? undefined : { command: "npm run dev -- --port 5187 --strictPort", url: "http://127.0.0.1:5187/dev/", reuseExistingServer: false, timeout: 15000 }
});
