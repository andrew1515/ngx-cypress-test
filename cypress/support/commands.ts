/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
// - Note: from this we will have the "cy.login()" command
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare namespace Cypress {
  interface Chainable {
    openHomePage(): void;
    login(): void;
  }
}

/**
 * Custom command creation. Now we can call it as "cy.openHomePage()".
 * We also need to add every custom command into the Cypress namespace above.
 *
 * The cy.visit("/") is actually needed to run before almost every test, because Cypress at every test start opens only
 * a blank page, where the app isn't actually loaded. It is a good thing, because if needed, we can run some code
 * even before the app is loaded (f.e. a headless login).
 */
Cypress.Commands.add("openHomePage", () => {
  cy.visit("/");
});

/**
 * Headless login
 *
 * In this case, we aren't logging in "manually" in the test, filling the login form,
 * but we are logging in through API request, where we get the token and save it for future uses.
 * (In our case we don't have the API request, but the token saving process is the same).
 */
Cypress.Commands.add("login", () => {
  const jwtToken = "testToken";

  // Saving the token for future uses when we are making API requests directly from Cypress (like cy.request)
  cy.wrap(jwtToken).as("jwtToken");
  // Saving the token to the app's localStorage, so the API requests made from the app will have access to the token.
  window.localStorage.setItem("jwtToken", jwtToken);
});
