import { navigation } from "../support/page-objects/navigationPage";
import { formLayouts } from "../support/page-objects/formLayoutsPage";

describe("example with page objects", () => {
  /**
   * Things to run before every test in the suite.
   */
  beforeEach(() => {
    cy.openHomePage();
  });

  it("the example test", () => {
    /**
     * Our test is much cleaner with using Page objects. Imagine to have here
     * the code of the navigateToFormLayouts and submitInlineForm methods - the test
     * would be very hard to read. But now with Page object method calls, it is much better.
     */
    navigation.navigateToFormLayouts();
    formLayouts.submitInlineForm("Andrew", "andras15@gmail.com");
  });
});
