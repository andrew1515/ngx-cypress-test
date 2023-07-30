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
     *
     * This is useful when:
     * - We want to execute some test assertions after the HTTP request is completed in the app, f.e.
     *   when some parts of the app will render only after the particular HTTP request
     * - If we want to also test the correctness of the response. I think this one is not used too often, I think
     *   in case of frontend tests, we are rather testing the concrete UI elements, which are holding the response data.
     */
    cy.wait("@createNewUser").then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body.name).to.equal("Andrew");
      expect(interception.response.body.email).to.equal("andras15@gmail.com");
    });
  });

  it.only("intercepting request from the app with mock data", () => {
    /**
     * Intercepting the request in the app, stopping the sending of the request to the server
     * and providing a mocked response to it from the "users.json".
     *
     * This is useful when we don't care about the server functionality, we just want to know that
     * our data are correctly rendered in the app. So if this test fails, we will know, that something
     * is with the UI.
     */
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/users", {
      fixture: "users.json",
    });

    navigation.navigateToFormLayouts();

    /**
     * We can read the data from the fixture, so if we are using our fixture data in the assertions,
     * we can be sure we are working with the same data what we provided as mock data in the request interception.
     */
    cy.fixture("users.json").then((usersFixture) => {
      const firstUser = usersFixture[0];
      const secondUser = usersFixture[1];

      cy.get(".users-list").then((usersList) => {
        cy.wrap(usersList)
          .find("li")
          .eq(0)
          .should(
            "contain",
            `Name: ${firstUser.name} | Email: ${firstUser.email}`
          );
        cy.wrap(usersList)
          .find("li")
          .eq(1)
          .should(
            "contain",
            `Name: ${secondUser.name} | Email: ${secondUser.email}`
          );
      });
    });
  });

  it("intercepting with wildcard url", () => {
    /**
     * We can use the glob pattern to match URLs. In this case we will match everything that
     * starts with the given URL. (However, we can't have another sub-paths after the /users/, for that
     * we would need to use the "**" pattern - see https://www.malikbrowne.com/blog/a-beginners-guide-glob-patterns/)
     */
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/users/*", {
      name: "Andrew Mock",
      email: "mock@mock.com",
    });

    navigation.navigateToFormLayouts();

    cy.get(".current-user")
      .find("p")
      .should("contain", "Current user: Andrew Mock | mock@mock.com");
  });
});
