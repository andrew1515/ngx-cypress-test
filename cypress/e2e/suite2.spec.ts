import { navigation } from "../support/page-objects/navigationPage";

describe("Querying DOM elements", () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it("Query by selectors", () => {
    navigation.navigateToFormLayouts();

    // find by Tag name
    cy.get("input");

    // find by ID
    cy.get("#inputEmail1");

    // find by Class name
    cy.get(".input-full-width");

    // by Attribute name
    cy.get("[placeholder]");

    // by Attribute name and value
    cy.get('[placeholder="Email"]');

    // by class value
    // The difference between class value and class name is, that in case of
    // class value we need to provide the entire class list of the DOM element, in case of
    // class name we need to provide only one of the classes from the class list.
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    // by Tag name and Attribute value
    cy.get('input[placeholder="Email"]');

    // by two different attributes
    cy.get('[placeholder="Email"][fullwidth]');

    // by tag name, attribute with name, ID and class name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    // the most recommended way by Cypress
    // The recommended way is to create data attributes for elements, according to which we will be able
    // to easily get them in Cypress. The main benefits are:
    // - Shorter DOM query in the 'get' method
    // - These data attributes will be dedicated to usage in the Cypress tests. The class, ID, etc. of an element can be changed anytime
    //   when f.e. someone wants to add or remove some class because of CSS styles. So using classes or IDs in Cypress tests is not a good idea,
    //   because at f.e. a class change also the Cypress tests should be checked, whether the class is used in some tests. However, if we use
    //   those dedicated attributes, this won't happen.
    cy.get('[data-cy="inputEmail1"]');
  });

  it("More advanced querying", () => {
    navigation.navigateToFormLayouts();

    /**
     * cy.get
     *
     * With cy.get we can query the DOM elements with the JQuery query syntax. If the query matches
     * multiple elements, all the elements will be returned.
     *
     * IMPORTANT: Chaining .get() commands isn't getting the descendant elements of the previous .get() commands.
     *   So cy.get('.my-div').get('img') WON'T get the <img> from the .my-div element, it will search for the <img>
     *   from scratch, in the whole document, not only in the .my-div. If you want to search only in the .my-div, you
     *   should use the .find() method (see below) or the .contains() method (see below) if it suits for you.
     *
     * cy.contains
     *
     * - With one parameter
     *   In this case Cypress will search for the element, which contains the given text (real visible text, not the names of the elements).
     * - With two paremeters
     *   In this case the first parameter is a selector (written with JQuery query syntax) and second parameter is the
     *   text. So we can learn this:
     *
     *   cy.contains('[status="warning"]', "Sign in");
     *
     *   as: Get me the element, which has the status attribute set to "warning" and contains the text "Sign in".
     *
     * - cy.contains also always return only ONE element - mostly the first found (on the contrary with cy.get,
     *   which returns all the matched elements).
     * - cy.contains also searches for ALL elements which contain the given text, even if the particular element contains
     *   more text then the text provided in the test.
     *
     *   F.e. cy.contains('world!') will match the <div> with the text "Hello world!".
     */

    cy.get('[data-cy="signInButton"]');
    cy.contains('[status="warning"]', "Sign in");

    /**
     * A more complex example:
     *
     * parents
     * - It gets the parent elements of the queried element, with the given selector.
     * - There is also a "parent()" command - the difference is, that parent() returns only the direct parent
     *   of the element (so one level above), while parents() returns all the levels.
     *
     * children
     * - It returns all the direct children of the element. If a selector provided, it returns only the children
     *   which match the selector.
     *
     * find
     * - Find descendants of the element matching the given query. It returns not only the direct children as the children()
     *   command, but it searches through all the nested descendants.
     *
     * Assertions:
     *
     * should
     * - First parameter is the assertion action, second parameter is the value. If the assertion
     *   fails, the chain is stopped, so the .find("nb-checkbox") and the click() function calls will
     *   not run. Also, the whole test will fail if an assertion fails.
     */
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();
  });
});
