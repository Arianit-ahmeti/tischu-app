import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright_tests",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "http://localhost:8081", // Standard Expo Web URL
    screenshot: "only-on-failure",
    video: process.env.CI ? "off" : "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: {
    command: "npx expo start --web",
    port: 8081,
    timeout: 120000,
  },
});
