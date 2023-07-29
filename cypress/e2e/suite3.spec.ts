import { navigation } from "../support/page-objects/navigationPage";

describe("then and wrap methods", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("the test", () => {
    navigation.navigateToFormLayouts();

    /**
     * This will not work!
     *
     * Because Cypress is asynchronous, we can't save the queried DOM elements in a variable like this.
     * (Also we shouldn't do this with any "cy." command).
     */
    // const firstForm = cy.contains("nb-card", "Using the Grid");
    // const secondForm = cy.contains("nb-card", "Basic form");

    // firstForm.find('[for="inputEmail1"]').should("contain", "Email");
    // firstForm.find('[for="inputPassword2"]').should("contain", "Password");
    // secondForm
    //   .find('[for="exampleInputPassword1"]')
    //   .should("contain", "Password");

    /**
     * Instead of that, we need to use the "then" function. This is some form of Promise.then and with
     * quite a similar functionality. Now the we get the DOM element in the "firstForm" parameter from the
     * "then" function's callback.
     *
     * Note, that the "firstForm" will be not a Cypress chainable, but a JQuery element, so also the "find"
     * method we call on it, will return not a Cypress chainable, but a JQuery element. On JQuery elements we
     * can't call the Cypress specific assertions like "should", so we do the assertion with comparing the texts
     * of the two elements with the "expect" assertion.
     *
     * The "then" call is useful for example if:
     * - we want to use the queried DOM element in multiple cases and don't want to write the DOM query multiple times
     * - we want to run assertions depending on multiple DOM elements
     */
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      const firstEmailLabel = firstForm.find('[for="inputEmail1"]').text();
      const firstPasswordLabel = firstForm
        .find('[for="inputPassword2"]')
        .text();

      expect(firstEmailLabel).to.equal("Email");
      expect(firstPasswordLabel).to.equal("Password");

      /**
       * We can have nested "then" calls if our tests are depending on multiple elements.
       */
      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const secondEmailLabel = secondForm
          .find('[for="exampleInputEmail1"]')
          .text();
        expect(firstEmailLabel).not.to.equal(secondEmailLabel);

        /**
         * If we want to convert a JQuery element to a Cypress chainable, we can call the
         * "wrap" function with that element.
         */
        cy.wrap(secondForm)
          .find('[for="exampleInputPassword1"]')
          .should("contain", "Password");
      });
    });
  });
});
