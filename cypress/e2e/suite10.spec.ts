/**
 * More info on stubs, spies and clocks here: https://docs.cypress.io/guides/guides/stubs-spies-and-clocks
 *
 * Stubs are basically overrides of the functions/methods in our app. They are useful
 * especially for:
 * - computation heavy third-party functions/methods
 * - methods, which can't work without granting some permissions (f.e. enabling notifications,
 *   accessing location). If the tests are running in a CI, these permissions can't be granted,
 *   because there will be no user interaction
 *
 * There are multiple types of stubs:
 * - Empty stubs
 *   The original function is replaced with an empty function call. Ideal for
 *   third-party functions which are making requests to some APIs, where we don't need to know
 *   the response from the API - like f.e. Google Analytics tracking. If we don't want to execute
 *   the tracking logic, but we want to test whether the function is called, the empty stubs are the
 *   most appropriate
 *
 * - Stubs with faked function calls (callsFake)
 *   The original function is replaced with a different function call, defined in our tests
 *
 * - Stubs with faked return value (resolves, returns)
 *   The original stub will be replaced with an empty one, which just returns a given value,
 *   which can be a regular value (primitive, object), or a Promise (if we use the "resolves" method).
 *   It is useful for example in situations, when some ".then()" callback is chained to the function, so
 *   if we would just use en empty stub, the ".then()" block would never been called.
 *
 * Note: It is a good practice to define stubs in beforeEach hook if we want to use them
 * across multiple tests, because tests are isolated, so if we define a stub in one "it" block,
 * we can't use it in other "it" blocks.
 */

/**
 * Spies are very similar to stubs, but with spies we don't replace the given function, just listen to him.
 * For example let's have a situation, when we want to test, whether the window.localStorage.getItem() function
 * gets called. We don't want to override the logic of the getItem() function, just need to verify, whether it
 * gets called or no.
 */

/**
 * Clocks
 *
 * With clocks we can jump forward in time with certain seconds. It is useful when we f.e. want to test,
 * whether a snackbar shows then hides after X seconds. If X is some longer time (like 10 seconds), our
 * tests would become unneccessarily slow just because we are waiting to the snackbar to close. So in that
 * case we can manipulate the clock to jump those 10 seconds forward in time.
 */

describe("Stubs and spies", () => {
  beforeEach(() => {
    /**
     * Indicating Cypress we want to manipulate the clock in our tests. It should been called before a
     * particular test with time manipulation (cy.tick() call) runs, so we need to place it inside the
     * beforeEach() hook.
     */
    cy.clock();

    cy.visit("/").then(win => {
      // Empty stub
      cy.stub(win.navigator.geolocation, "getCurrentPosition").as(
        "getUserPosition"
      );

      /**
       * Stub with faked function call
       * The "getCurrentPosition" function's original implementation looks something like this:
       *
       * function getCurrentPosition(cb) {
       *   // logic of getting the current location
       *   cb(location);
       * }
       *
       * And we use this function in our app:
       *
       * navigator.geolocation.getCurrentPosition(function (location) {
       *   console.log(location);
       * })
       *
       * Getting the current location would require user permissions to enable the access to his location and
       * as we discussed above, this is not always possible. But if we would use just an empty stub, the
       * callback with "console.log" would be never called, however, we need this to be called. So we
       * can define a fake "getCurrentPosition" function, which will just pass some fake coords to the callback
       * instead of asking for a permission in the browser and getting the real ones.
       * With setTimeout we also simulated some delay, as getting the coords with the original function would
       * take some time.
       */
      cy.stub(win.navigator.geolocation, "getCurrentPosition")
        .as("getUserPosition2")
        .callsFake(cb => {
          setTimeout(() => {
            cb({
              coords: {
                latitude: 12.3,
                longitude: 45.6
              }
            });
          }, 500);
        });

      /**
       * Stub with faked return value (returning a Promise).
       *
       * Let's have a code in our app, where we are using the "writeText" method:
       *
       * navigator.clipboard.writeText(text).then(() => {
       *   console.log('Text copied to clipboard');
       * });
       *
       * If we would define an empty stub, the "then" block with the "console.log" would never benn called.
       * With "resolves", we are returning an empty Promise from the stub.
       */
      cy.stub(win.navigator.clipboard, "writeText")
        .as("saveToClipboard")
        .resolves();

      /**
       * Defining spies. In that case nothing will be overridden, with cy.get("@storePosition")
       * and cy.get("@getPosition") we just will be able to listen whether the function is called
       * for example.
       */
      cy.spy(win.localStorage, "setItem").as("storePosition");
      cy.spy(win.localStorage, "getItem").as("getPosition");
    });
  });

  it("stubs test", () => {
    cy.get("@getUserPosition").should("have.been.called");
    cy.get("@getUserPosition2").should("have.been.called");
    cy.get("@saveToClipboard").should("have.been.called");
  });

  it("spies test", () => {
    cy.get("@storePosition").should("have.been.called");
    cy.get("@getPosition").should("have.been.called");
  });

  it("clock test", () => {
    // Opening a snackbar which will close after 6 seconds.
    cy.get('[data-cy="info-snackbar"]').should("be.visible");

    // So instead of waiting 6 seconds (f.e. with calling the cy.wait() method), we jump 6 seconds
    // forward in time, where the snackbar will be close already.
    cy.tick(6000);

    cy.get('[data-cy="info-snackbar"]').should("not.be.visible");
  });
});
