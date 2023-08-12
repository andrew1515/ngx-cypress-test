import { navigation } from "../support/page-objects/navigationPage";

/**
 * Visual testing with 'cypress-plugin-snapshots'
 *
 * It works as following:
 * 1) When the test runs and there are no image snapshots (screenshots) created for the given assertion,
 *    they will be created
 * 2) If there are snapshots created for the given assertion, Cypress will make a snapshot of the current
 *    state and compare it to the previously created snapshot - and they should match
 */
describe("Visual testing", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("visual test 1", () => {
    navigation.navigateToFormLayouts();
    (cy.contains("nb-card", "Using the Grid") as any).toMatchImageSnapshot();
    (cy.document() as any).toMatchImageSnapshot();
  });
});
