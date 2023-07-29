class NavigationPage {
  navigateToFormLayouts() {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
  }

  navigateToFormsDatepickers() {
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();
  }

  navigateToToastrPage() {
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();
  }

  navigateToSmartTable() {
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();
  }
}

export const navigation = new NavigationPage();
