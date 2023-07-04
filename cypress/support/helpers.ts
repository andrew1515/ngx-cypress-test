export function openFormsLayouts() {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
}

export function openFormsDatepickers() {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Datepicker").click();
}

export function openToastrPage() {
  cy.visit("/");
  cy.contains("Modal & Overlays").click();
  cy.contains("Toastr").click();
}
