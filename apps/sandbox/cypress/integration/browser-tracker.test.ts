/* eslint-disable jest/valid-expect-in-promise */

describe("browser tracker", () => {
  it("should work", () => {
    cy.intercept(
      "https://my-browser-analytics-dsn.elastic.co/_application/analytics/test/event/*",
      {
        body: {},
      }
    ).as("TrackerEvent");

    cy.visit("http://localhost:3000/browser-tracker");

    cy.wait(200);

    let userId = "";
    let sessionId = "";
    cy.getCookie("EA_UID").then(({ value }) => (userId = value));
    cy.getCookie("EA_SID").then(({ value }) => (sessionId = value));

    cy.wait("@TrackerEvent").then((interception) => {
      expect(interception.request.body).to.deep.contains({
        user: { id: userId },
        session: { id: sessionId },
        page: {
          referrer: "",
          url: "http://localhost:3000/browser-tracker",
          title: "React App",
        },
      });
      expect(interception.request.url).to.contain("/event/page_view");
    });

    cy.get(".click-event").click();

    cy.wait("@TrackerEvent").then((interception) => {
      expect(interception.request.body).to.deep.contains({
        document: { id: "123", index: "products" },
        search: {
          query: "",
          filters: [],
          page: { current: 1, size: 10 },
          results: { items: [], total_results: 10 },
          sort: {
            name: "relevance",
          },
          search_application: "website",
        },
        user: { id: userId },
        session: { id: sessionId },
        page: {
          referrer: "",
          url: "http://localhost:3000/browser-tracker",
          title: "React App",
        },
      });
      expect(interception.request.url).to.contain("/event/search_click");
    });

    cy.get(".search-event").click();

    cy.wait("@TrackerEvent").then((interception) => {
      console.log(interception.request.body);
      expect(interception.request.body).to.deep.contains({
        search: {
          query: "laptop",
          filters: [
            { field: "brand", value: ["apple"] },
            { field: "price", value: ["1000-2000"] },
          ],
          page: { current: 1, size: 10 },
          results: {
            items: [
              {
                document: { id: "123", index: "products" },
                page: { url: "http://localhost:3000/javascript-tracker" },
              },
            ],
            total_results: 100,
          },
          sort: {
            name: "relevance",
          },
          search_application: "website",
        },
        user: { id: userId },
        session: { id: sessionId },
        page: {
          referrer: "",
          url: "http://localhost:3000/browser-tracker",
          title: "React App",
        },
      });
      expect(interception.request.url).to.contain("/event/search");
    });

    cy.getCookie("EA_SID").should("exist");
    cy.getCookie("EA_UID").should("exist");
  });
});
