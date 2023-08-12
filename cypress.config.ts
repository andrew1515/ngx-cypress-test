import { defineConfig } from "cypress";
import { initPlugin } from "cypress-plugin-snapshots/plugin";

export default defineConfig({
  projectId: "syq3h8",
  viewportWidth: 1920,
  viewportHeight: 1080,
  // Specific config for e2e tests. Some settings are available both as global config
  // (for all the tests - e2e and component) - f.e. viewportWidth and viewportHeight, some
  // are e2e test specific.
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    excludeSpecPattern: [
      "**/1-getting-started/*",
      "**/2-advanced-examples/*",
      "**/*.dontrun.spec.*",
      "**/__snapshots__/*",
      "**/__image_snapshots__/*"
    ],
    setupNodeEvents(on, config) {
      // - implement node event listeners here
      // - and initialize plugins here
      initPlugin(on, config);
      return config;
    },
    // How many times we want to retry failed tests.
    // runMode - if we run Cypress tests with 'npx cypress run' (mostly headless mode)
    // openMode - if we dun Cypress tests with 'npx cypress open'
    retries: {
      runMode: 1,
      openMode: 0
    },
    env: {
      "cypress-plugin-snapshots": {
        imageConfig: {
          // Setting up threshold for the visual tests. That means, how much difference
          // between snapshots is tolerated
          threshold: 0.01
        }
      }
    }
  },
  // Added reporters config. More info here: https://docs.cypress.io/guides/tooling/reporters
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json"
  },
  env: {
    apiUrl: "https://jsonplaceholder.typicode.com",
    userEmail: "andras15@gmail.com"
  }
});

/**
 * More about envs:
 *
 * cypress.env.json
 *
 * Envs from this file will override any envs from cypress.config.ts
 *
 * Advantages: If we want to store some env variables, that aren't public, we can store them there (f.e. some passwords).
 *   Then we can move cypress.env.json to .gitignore.
 *   In CI environment (like Github Actions) the "system environment variables" solution is better, because it can be
 *   set more easily (we don't have to create a separate cyoress.env.json file, just set the env variables in the CI),
 *   but for local usage it's perfect - you can create a gitignored cypress.env.json file, where you will have your secret
 *   env variables and you don't have to manually put them before every Cypress CLI command.
 *
 * ----------
 * --env
 *
 * We can provide envs also from the command line too, like this:
 * `npx cypress open --env userEmail=andras17@gmail.com,password=123888`
 *
 * This will also override any envs from cypress.config.ts AND ALSO cypress.env.json.
 *
 * Advantages: If in most Cypress NPM commands we are using the same env variables (from the config), but we have an exception, where we need to
 *   use different ones, we can use this solution - we can easily create an NPM command with overrides through --env.
 *   Don't use it for secret env variables!
 *
 * ----------
 * Through system environment variables
 *
 * We can set system environment variables to Cypress CLI commands too.
 * F.e.: CYPRESS_userEmail=andras18@gmail.com CYPRESS_password=123999 npx cypress open
 * Everything here is case sensitive, just the CYPRESS_ prefix will be removed.
 *
 * Advantages: It is the best solution for CI environments (like Github Actions), because most CI environments
 *   support presetting secret envs in their UI (through settings on their webpage). Or if we are using Docker compose,
 *   we can also set them easily through the docker-compose.yml file.
 *
 * We can override also Cypress config settings, not only envs. So f.e.
 * CYPRESS_VIEWPORT_WIDTH=1280 CYPRESS_VIEWPORT_HEIGHT=720 npx cypress open
 * will override the viewport sizes from the config.
 * The CYPRESS_ prefix will be removed here too, but the other part will be also camelCased.
 *
 * More info here: https://docs.cypress.io/guides/guides/environment-variables#Option-3-CYPRESS_
 *
 * ----------
 * Specific configuration
 *
 * More info here: https://docs.cypress.io/guides/guides/environment-variables#Option-5-Test-Configuration
 */
