import { navigation } from "../support/page-objects/navigationPage";

describe("radio buttons and checkboxes", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("radio buttons", () => {
    navigation.navigateToFormLayouts();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        /**
         * first - because "find" returns all the matched children, "radioButtons" can contain
         *   multiple DOM elements. "first" picks the first one from them.
         *
         * check - checking the given radio button
         * - force: true - if our checkbox is not visible in browser or it is somehow not checkable, in default
         *   Cypress will interpret this as a failure and our test will fail. But sometimes we want to manipulate
         *   with elements not directly accessible in the UI. For example our real radio button (the <input> element)
         *   will be hidden and a <span> element will be shown instead, which will be styled as a radio button. But
         *   we can't check the <span> element, only the <input> element, so we will force check it despite it isn't visible.
         */
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should("be.checked");

        /**
         * eq - if we have multiple JQuery elements, with "eq" we can select an exact one on
         *   the given index
         */
        cy.wrap(radioButtons).eq(1).check({ force: true });

        // There can be always only one radio button checked. So if we check the first one,
        // then the second one (eq(1), so on the index 1), the first one should be unchecked.
        // Note: cy(0) is identical to first().
        cy.wrap(radioButtons).eq(0).should("not.be.checked");

        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });

  it("checkboxes", () => {
    navigation.navigateToToastrPage();

    /**
     * In the case we have multiple checkboxes returned by the query,
     * the check() method will check all of them.
     * This, however, isn't working on click() for example. For click() you should use the "multiple: true" property
     * to click through every element.
     *
     * BUT: there is a specific behavior of the check() method in case of checkboxes:
     * if we call the check() method on an already checked checkbox, the check() method
     * will not uncheck it. So the check() method checks the checkbox if it isn't checked,
     * but not the other way.
     */
    cy.get('[type="checkbox"]').check({ force: true });

    /**
     * If we want to uncheck a checkbox, we have to use the click() method.
     * (It is working also for checking the checkboxes, but for this purpose the check() method
     * is recommended.)
     *
     * Then we make the assertion, that the checkbox isn't checked (because in the previous command we checked
     * all the checkboxes, so if we now click on any checkbox, it should deselect).
     *
     * We can chain this command with the previous, but we separated them to be able to document them better.
     */
    cy.get('[type="checkbox"]')
      .eq(0)
      .click({ force: true })
      .should("not.be.checked");

    /**
     * If we want to check every checkbox and then uncheck them, we can do it as following.
     *
     * each - it is quite similar to "then", but if we have multiple elements returned by the previous
     *   method in the chain, we can iterate through them. (With "then" we just get the whole thing back and
     *   we need to handle the iteration by ourselves).
     */
    cy.get('[type="checkbox"]')
      .check({ force: true })
      .each((checkbox) => {
        // Clicking on all the checkboxes to uncheck them.
        cy.wrap(checkbox).click({ force: true });
      })
      .each((checkbox) => {
        // Checking whether every checkbox is unchecked.
        cy.wrap(checkbox).should("not.be.checked");
      });

    /**
     * Alternative with .click({ multiple: true })
     */
    cy.get('[type="checkbox"]')
      .check({ force: true })
      .click({ multiple: true, force: true })
      // If asserting multiple elements (checkboxes in this case) with "should", the assertion will run on every element.
      .should("not.be.checked");
  });
});

// .type()
// .clear()
// .wait()
