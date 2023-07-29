class FormLayoutsPage {
  submitInlineForm(name: string, email: string) {
    cy.contains("nb-card", "Inline form")
      /**
       * Excluding some DOM elements from the previous result by the given selector.
       */
      .not(".my-form")
      .find("form")
      .then((form) => {
        cy.wrap(form).find('[placeholder="Jane Doe"]').type(name);
        cy.wrap(form).find('[placeholder="Email"]').type(email);
        cy.wrap(form).find('[type="checkbox"]').check({ force: true });
        /**
         * Submitting a <form> element.
         */
        cy.wrap(form).submit();
      });
  }
}

export const formLayouts = new FormLayoutsPage();
