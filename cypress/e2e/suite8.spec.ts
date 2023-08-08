import { navigation } from "../support/page-objects/navigationPage";
import { formLayouts } from "../support/page-objects/formLayoutsPage";

// For more detailed informations about interceptions, see: https://docs.cypress.io/api/commands/intercept

describe(
  "intercepts and making HTTP requests from Cypress",
  // We can set a specific retry config here too. This will override the settings from cypress.config.ts (and
  // also other places - see cypress.config.ts comments, "Specific configuration" part).
  { retries: 2 },
  () => {
    beforeEach(() => {
      cy.login();
      cy.openHomePage();
    });

    it("intercepting request from the app and getting the response from it", () => {
      /**
       * Registering the request to be intercepted from the app.
       */
      cy.intercept("POST", `${Cypress.env("apiUrl")}/users`).as(
        "createNewUser"
      );

      cy.intercept("GET", `${Cypress.env("apiUrl")}/users`).as("getUsers");

      navigation.navigateToFormLayouts();
      formLayouts.submitInlineForm("Andrew 1", "test1@gmail.com");

      /**
       * We are actively waiting to the particular request to be executed.
       * After then, we will get back all the informations about the request and the response.
       * Now we can check, whether the response is that what we expected (in our case the response
       * should return the credentials of the newly created user).
       *
       * This is useful when:
       * 1) We want to execute some test assertions after the HTTP request is completed in the app, f.e.
       *    when some parts of the app will render only after the particular HTTP request.
       * 2) If we want to also test the correctness of the response. We can check directly the response or check the UI, whether the
       *    correct data are rendered.
       * 3) If we want to test whether the response is rendered correctly. In this case we don't bother about the data correctness,
       *    we just want to test, whether the data from the response are rendered correctly in the app.
       */
      cy.wait("@createNewUser").then((interception) => {
        // This is the case 2). We are checking directly the response, because we aren't rendering the new user in the UI. But mostly
        // that's the case.
        expect(interception.response.statusCode).to.equal(201);
        expect(interception.response.body.name).to.equal("Andrew 1");
        expect(interception.response.body.email).to.equal("test1@gmail.com");
      });

      cy.wait("@getUsers").then((interception) => {
        // This is the case 3)
        const firstUser = interception.response.body[0];
        const secondUser = interception.response.body[1];

        cy.get(".users-list").then((usersList) => {
          cy.wrap(usersList)
            .find("li.user-item")
            .eq(0)
            .should(
              "contain",
              `Name: ${firstUser.name} | Email: ${firstUser.email}`
            );
          cy.wrap(usersList)
            .find("li.user-item")
            .eq(1)
            .should(
              "contain",
              `Name: ${secondUser.name} | Email: ${secondUser.email}`
            );
        });
      });
    });

    it("intercepting request from the app with mock data", () => {
      /**
       * Intercepting the request in the app, stopping the sending of the request to the server
       * and providing a mocked response to it from the "users.json".
       *
       * This is useful when we don't care about the server functionality, we just want to know that
       * our data are correctly rendered in the app. So if this test fails, we will know, that something
       * is with the UI. So it's similar as the case 3) in the previous test, but now without making the actual API call,
       * rather using a mock.
       */
      cy.intercept("GET", `${Cypress.env("apiUrl")}/users`, {
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

    it("intercepting with wildcard url and route matcher object", () => {
      /**
       * We can use the glob pattern to match URLs. In this case we will match everything that
       * starts with the given URL. (However, we can't have another sub-paths after the /users/, for that
       * we would need to use the "**" pattern - see https://www.malikbrowne.com/blog/a-beginners-guide-glob-patterns/)
       *
       * About the router matcher object more here: https://docs.cypress.io/api/commands/intercept#Icon-nameangle-right--routeMatcher-RouteMatcher
       */
      cy.intercept(
        {
          method: "GET",
          // If we wouldn't bother about the hostname, we could just use "pathname: '/users/*'"
          url: `${Cypress.env("apiUrl")}/users/*`,
        },
        {
          name: "Andrew Mock",
          email: "mock@mock.com",
        }
      );

      /**
       * Alternative could be using req.reply()
       * req.reply is useful when we want the mocked response value choose according to some additional logic
       */
      // cy.intercept(
      //   {
      //     method: "GET",
      //     url: `${Cypress.env('apiUrl')}/users/*`,
      //   },
      //   (req) => {
      //     req.reply({
      //       name: "Andrew Mock",
      //       email: "mock@mock.com",
      //     });
      //   }
      // );

      navigation.navigateToFormLayouts();

      cy.get(".current-user")
        .find("p")
        .should("contain", "Current user: Andrew Mock | mock@mock.com");
    });

    it("modifying request/response payload", { retries: 3 }, () => {
      cy.intercept("POST", `${Cypress.env("apiUrl")}/users`, (req) => {
        // Modifying the request body
        req.body.name = "Modified request Andrew 2";

        // "continue" sends the request to the server and returns the response from the server.
        // After that we can work with that response, f.e. modify it.
        // I really can't think of any use-cases for this, because if I would need an exact hardcoded
        // response in my tests, I would use a fully mocked response without touching the server.
        // But good to know there is such an option.
        req.continue((res) => {
          expect(res.body.name).to.equal("Modified request Andrew 2");
          res.body.name = "Modified response Andrew 2";
        });
      }).as("createNewUser");

      navigation.navigateToFormLayouts();
      formLayouts.submitInlineForm("Andrew 2", "test2@gmail.com");

      cy.wait("@createNewUser").then((interception) => {
        // Again, we aren't rendering the new user in the UI, so we are checking the response directly.
        expect(interception.response.statusCode).to.equal(201);
        expect(interception.response.body.name).to.equal(
          "Modified response Andrew 2"
        );
        expect(interception.response.body.email).to.equal("test2@gmail.com");
      });
    });

    /**
     * Making HTTP requests directly from Cypress (so not from the app) is useful for:
     * - Pre-creating testing data. F.e. we want to test, whether the user deleting function is working in our app.
     *   But we don't want to click through the whole user creation process in our test, we want to just test
     *   the deletion. So in this case it's a better idea to pre-create some user through API request and then test only
     *   the deletion in Cypress.
     *
     * Note: this test will not work here, because POST https://jsonplaceholder.typicode.com/users won't actually
     * create the user (it's a faker API), so the "Andrew 3" user will be not rendered in the users list. But in ideal real-life situation
     * this should work.
     */
    it.skip("making HTTP requests", () => {
      cy.request({
        url: `${Cypress.env("apiUrl")}/users`,
        method: "POST",
        body: {
          name: "Andrew 3",
          email: "test3@gmail.com",
        },
      })
        .its("body")
        .then((body) => {
          cy.intercept(
            "DELETE",
            `${Cypress.env("apiUrl")}/users/${body.id}`
          ).as("deleteUser");

          navigation.navigateToFormLayouts();

          cy.contains("li.user-item", "test3@gmail.com")
            .find(".delete-user")
            .click();

          cy.wait("@deleteUser").then((interception) => {
            // Again, in practice, we are mostly checking the UI (whether the user is removed from the UI) and
            // not the response status code itself
            expect(interception.response.statusCode).to.equal(200);
          });
        });
    });
  }
);
