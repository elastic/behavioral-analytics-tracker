/* eslint-disable jest/valid-expect-in-promise */

describe("Javascript tracker with sampling", () => {
  it("should work", () => {
    cy.intercept(
      "https://my-browser-analytics-dsn.elastic.co/_application/analytics/test/event/*",
      { body: {} }
    ).as("TrackerEvent");

    cy.visit("http://localhost:3000/javascript-tracker-with-sampling");

    cy.wait(200);

    cy.get('@TrackerEvent').should('not.have.been.called');

    cy.get(".click-event").click();
    cy.get('@TrackerEvent').should('not.have.been.called');

    cy.get(".search-event").click();
    cy.get('@TrackerEvent').should('not.have.been.called');

    cy.getCookie("EA_SID").should("exist");
    cy.getCookie("EA_UID").should("exist");
    cy.getCookie("EA_SESSION_SAMPLED").should('have.property', 'value', 'false');
  });
});
