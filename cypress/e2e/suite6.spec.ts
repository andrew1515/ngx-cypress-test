import { navigation } from "../support/page-objects/navigationPage";

/**
 * Example for testing tables with editable fields.
 */
describe("tables", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("table test", () => {
    navigation.navigateToSmartTable();

    /**
     * Editing data in a cell in a table row and then checking, if the data is properly saved after clicking the checkmark button
     *
     * type - typing into DOM element
     * clear - clearing the value of input or textarea
     */
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", "25");
      });

    /**
     * Adding a new row in the table with data of a new user.
     * The steps are:
     * 1) clicking on the "plus" icon
     * 2) now in the third row (so index 2) of the <thead> there will be a set of inputs for adding a new row into the table
     * 3) filling the new row with data
     * 4) clicking on the checkmark button to save the new user data
     *
     * Now we need to check, whether the new user is saved correctly.
     * So we check the first row in the table and check the 3rd (index 2) and 4th (index 3) column with the row,
     * whether they contain the correct data.
     */
    cy.get("thead").find(".nb-plus").click();
    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("Artem");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Bondar");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });

    cy.get("tbody tr")
      .first()
      .find("td")
      .then((tableColumns) => {
        cy.wrap(tableColumns).eq(2).should("contain", "Artem");
        cy.wrap(tableColumns).eq(3).should("contain", "Bondar");
      });

    /**
     * Testing the filter feature of the table.
     * So we are checking, that when we enter the age in the filter, only users with the given age will be shown.
     * We are also testing it for situations, when no users are found for the given age (200).
     *
     * wait - explicitly waiting for given amount of the time before going any further. We need this in our case, because
     * the rendering after entering something in filter is slower than Cypress and the test would fail, because it won't wait
     * to finishing the rendering (more accurately, the .eq(6) will not return anything, because the rows won't be rendered yet after
     * the filter change). HOWEVER, we shouldn't use it too often, in most cases Cypress is smart enough to decide when to wait,
     * but sometimes it isn't working.
     */
    const ages = [20, 30, 40, 200];

    ages.forEach((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age.toString());
      cy.wait(500);
      cy.get("tbody tr").each((tableRow) => {
        if (age === 200) {
          cy.wrap(tableRow).should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq(6).should("contain", age);
        }
      });
    });
  });
});
