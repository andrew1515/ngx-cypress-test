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
 */
Cypress.Commands.add("openHomePage", () => {
  cy.visit("/");
});

Cypress.Commands.add("login", () => {
  cy.visit("/auth/login");
  cy.get('[placeholder="Email address"]').type("andras15@gmail.com");
  cy.get('[placeholder="Password"]').type("12345678");
  cy.get("form").submit();
});
