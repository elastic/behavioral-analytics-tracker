import {
  createTracker,
  trackPageView,
  getTracker,
  trackSearch,
  trackSearchClick,
} from "@elastic/behavioral-analytics-javascript-tracker";
import mock from "xhr-mock";

describe("Integration", () => {
  beforeEach(() => mock.setup());

  test("exports", () => {
    expect(createTracker).toBeDefined();
    expect(trackPageView).toBeDefined();
    expect(trackSearch).toBeDefined();
    expect(trackSearchClick).toBeDefined();
  });

  test("Throws error when not initialised", () => {
    expect(() => {
      trackPageView();
    }).toThrowError("Behavioral Analytics: Tracker not initialized.");
  });

  test("get tracker", () => {
    expect(() => {
      getTracker();
    }).toThrow();

    createTracker({
      endpoint: "http://127.0.0.1:3000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    expect(getTracker()).toBeDefined();
  });

  test("Dispatch track page view", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    expect.assertions(2);

    mock.post(
      "http://127.0.0.1:4000/_application/analytics/collection/event/page_view",
      (req, res) => {
        expect(req.header("authorization")).toEqual("Basic sdddd");

        expect(JSON.parse(req.body())).toMatchObject({
          page: {
            referrer: "",
            title: "",
            url: "http://localhost/",
          },
          session: {
            id: expect.any(String),
          },
          user: {
            id: expect.any(String),
          },
        });

        return res.status(201).body("{}");
      }
    );

    trackPageView();
  });

  test("Dispatch search event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    expect.assertions(2);

    mock.post(
      "http://127.0.0.1:4000/_application/analytics/collection/event/search",
      (req, res) => {
        expect(req.header("authorization")).toEqual("Basic sdddd");

        expect(JSON.parse(req.body())).toMatchObject({
          page: {
            referrer: "",
            title: "",
            url: "http://localhost/",
          },
          search: {
            query: "ddd",
          },
          session: {
            id: expect.any(String),
          },
          user: {
            id: expect.any(String),
          },
        });

        return res.status(201).body("{}");
      }
    );

    trackSearch({
      search: {
        query: "ddd",
      },
    });
  });

  test("Dispatch search click event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    expect.assertions(2);

    mock.post(
      "http://127.0.0.1:4000/_application/analytics/collection/event/search_click",
      (req, res) => {
        expect(req.header("authorization")).toEqual("Basic sdddd");

        expect(JSON.parse(req.body())).toMatchObject({
          page: {
            referrer: "",
            title: "",
            url: "http://localhost/",
          },
          search: {
            query: "ddd",
          },
          document: {
            id: "1",
            index: "products",
          },
          session: {
            id: expect.any(String),
          },
          user: {
            id: expect.any(String),
          },
        });

        return res.status(201).body("{}");
      }
    );

    trackSearchClick({
      search: {
        query: "ddd",
      },
      document: {
        id: "1",
        index: "products",
      },
    });
  });

  test("overriding the session", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
      user: {
        token: "user-overriden-token",
      },
    });

    expect.assertions(1);

    mock.post(
      "http://127.0.0.1:4000/_application/analytics/collection/event/search_click",
      (req, res) => {
        expect(JSON.parse(req.body())).toMatchObject({
          page: {
            referrer: "",
            title: "",
            url: "http://localhost/",
          },
          search: {
            query: "ddd",
          },
          document: {
            id: "1",
            index: "products",
          },
          session: {
            id: expect.any(String),
          },
          user: {
            id: "user-overriden-token",
          },
        });

        return res.status(201).body("{}");
      }
    );

    trackSearchClick({
      search: {
        query: "ddd",
      },
      document: {
        id: "1",
        index: "products",
      },
    });
  });
});
