import { navigation } from "../support/page-objects/navigationPage";

describe("invoke command", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  /**
   * The "invoke" command is for calling a method with one or more parameters on the wrapped previous element of the chain.
   * So let's have an example:
   *
   * .find(".custom-checkbox").invoke("attr", "class")
   *
   * The "find" method returns a Cypress chainable, wrapping a JQuery element (Cypress.Chainable<JQuery<HTMLElement>>).
   * With "invoke" we call the .attr("class") function on that JQuery element and returning the return value wrapped in a Cypress chainable
   * (so because the class value is always a string, it will be Cypress.Chainable<string>). Then we can call f.e. .should()
   * assertions on it and so on.
   */

  it("invoke command test - invoking text content", () => {
    navigation.navigateToFormLayouts();

    /**
     * In this case the "invoke" command is useful because we don't have to call the .text() method separately, the "invoke" command calls
     * it for us. It's a more clean syntax.
     */
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });
  });

  it("invoke command test - invoking class attribute", () => {
    navigation.navigateToFormLayouts();

    /**
     * Here it is even more useful. If there wouldn't be the "invoke" command, we should have a .then() block and make the assertion there.
     * Like this:
     */
    // cy.contains("nb-card", "Basic form")
    // .find("nb-checkbox")
    // .click()
    // .find(".custom-checkbox")
    // .then((customCheckbox) => {
    // expect(customCheckbox).attr("class").to.contain("checked");
    // });

    /**
     * But with "invoke" we can extract the class value, so we don't have to extract it manually in the "then" block.
     */
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      .should("contain", "checked");
  });

  it("invoke command test - alternative to invoking class attribute without invoke", () => {
    navigation.navigateToFormLayouts();

    /**
     * There is an alternative to this, however, without the "invoke" command:
     */
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .should("have.class", "checked");
  });

  it("invoke command test - alternative to invoking style property", () => {
    navigation.navigateToFormLayouts();

    /**
     * We can do something similar also with CSS styles as with classes before:
     */
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .should("have.css", "background-color", "rgb(51, 102, 255)");
  });

  /**
   * The "invoke" command is useful also in cases, when we need to access some property of the DOM element.
   * As we said, with "invoke" command we can call methods on a JQuery element. There is a .prop() method of the JQuery elements,
   * with which we can access properties of the given DOM element, like "value", "scrollHeight", etc.
   */
  it("invoke command test - invoking the 'value' property", () => {
    navigation.navigateToFormsDatepickers();

    // Wrapping everything into "then" block, because we will use the input element multiple times.
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();

        // This checks only that if we select the day 17 in the calendar, the input value will contain the number 17.
        // But it doesn't check the full date. For that we would need to make additional improvements - we
        // can't hardcode the date, because the test wouldn't work on the next day then. We would need to get the
        // current date with the Date object and then select a day that is f.e. 5 days after the current date and then
        // assert that date. More info in the "Web Datepickers" lesson of the "Cypress: Web Automation Testing from Zero to Hero"
        // course.
        cy.get("nb-calendar-day-picker").contains("17").click();
        cy.wrap(input).invoke("prop", "value").should("contain", "17");
      });
  });
});
