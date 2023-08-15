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

  /**
   * Visual testing with Percy
   *
   * You can find every important info here: https://docs.percy.io/docs/cypress
   * and also here https://docs.cypress.io/guides/tooling/visual-testing.
   * In nutshell it works quite similar as the basic visual testing approach, but now
   * everything is handled by an organized third party service. The snapshots are generated
   * by this service according to the DOM which is uploaded to Percy during the test and then
   * Percy compares the previous snapshot to the current one. If we don't have a snapshot in Percy with
   * the particular name (like "snapshot 1" and "snapshot 2"), there will be no comparison, only uploading
   * the snapshot and then in the second run we will compare the new and the old snapshots.
   *
   * If you want to run Percy with your tests, you need to run the Cypress test running command as this:
   *
   * npx percy exec -- npx cypress run
   *
   * ...and also set the PERCY_TOKEN environment variable.
   */
  it.only("Percy visual test 1", () => {
    navigation.navigateToFormLayouts();
    cy.percySnapshot("snapshot 1");
    cy.percySnapshot("snapshot 2");
  });
});
