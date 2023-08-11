import { defineConfig } from "cypress";

/**
 * An another config for running the tests in CI environments.
 * Here we will not need videos and also the mocha and JUnit reports - the reports will be
 * created mostly in the Cypress dashboard.
 */
export default defineConfig({
  projectId: "syq3h8",
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
    retries: {
      runMode: 1,
    },
  },
  env: {
    apiUrl: "https://jsonplaceholder.typicode.com",
    userEmail: "andras15@gmail.com",
  },
});
