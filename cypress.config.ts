import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    excludeSpecPattern: [
      "**/1-getting-started/*",
      "**/2-advanced-examples/*",
      "**/*.dontrun.spec.*",
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
