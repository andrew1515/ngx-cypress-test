import { openFormsLayouts, openToastrPage } from "../support/helpers";

describe("suite 5", () => {
  it("radio buttons", () => {
    openFormsLayouts();

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
    openToastrPage();

    /**
     * In the case we have multiple checkboxes returned by the query,
     * the check() method will check all of them.
     * This, however, isn't working on click() for example.
     *
     * BUT: there is a specific behavior of the check() method in case of checkboxes:
     * if we call the check() method on an already checked checkbox, the check() method
     * will not uncheck it. So the check() method checks the checkbox if it isn't checked,
     * but not the other way.
     */
    cy.get('[type="checkbox"').check({ force: true });

    /**
     * If we want to uncheck a checkbox, we have to use the click() method.
     * (It is working also for checking the checkboxes, but for this purpose the check() method
     * is recommended.)
     */
    cy.get('[type="checkbox"').eq(0).click({ force: true });
  });
});
