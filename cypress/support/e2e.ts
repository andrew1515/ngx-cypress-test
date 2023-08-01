// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
//
// Custom notes:
// - this is the very first file executed when Cypress is initialized (so when we run "npx cypress open")
// - so here we can import everything we want to be executed at this initialization
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

/**
 * This beforeEach hook will run before EVERY test. This hook also will run before all "beforeEach" hooks from the
 * inside of the "describe" blocks.
 */
beforeEach(() => {
  cy.log("BEFORE EVERY TEST");
});
