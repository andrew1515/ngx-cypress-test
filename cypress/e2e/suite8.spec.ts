import { navigation } from "../support/page-objects/navigationPage";
import { formLayouts } from "../support/page-objects/formLayoutsPage";

describe("intercepts", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("intercepting request from the app and getting the response from it", () => {
    /**
     * Registering the request to be intercepted from the app.
     */
    cy.intercept("POST", "https://jsonplaceholder.typicode.com/users").as(
      "createNewUser"
    );

    navigation.navigateToFormLayouts();
    formLayouts.submitInlineForm("Andrew", "andras15@gmail.com");

    /**
     * We are actively waiting to the particular request to be executed.
     * After then, we will get back all the informations about the request and the response.
     * Now we can check, whether the response is that what we expected (in our case the response
     * should return the credentials of the newly created user).
     */
    cy.wait("@createNewUser").then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body.name).to.equal("Andrew");
      expect(interception.response.body.email).to.equal("andras15@gmail.com");
    });
  });
});
