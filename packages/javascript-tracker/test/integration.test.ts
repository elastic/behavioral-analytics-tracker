import {
  createTracker,
  trackPageView,
  getTracker,
  trackSearch,
  trackSearchClick,
} from "@elastic/behavioral-analytics-javascript-tracker";
import { EventProperties } from "@elastic/behavioral-analytics-tracker-core";
// @ts-ignore
import { Blob } from "blob-polyfill";
globalThis.Blob = Blob;

describe("Integration", () => {
  beforeEach(() => {
    // @ts-ignore
    navigator.sendBeacon = jest.fn(() => {});
  });

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
      endpoint: "http://127.0.0.1:3000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    trackPageView();

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    expect(beaconCall[0]).toEqual(
      "http://127.0.0.1:3000/_application/analytics/collection/event/page_view"
    );
    const text = await (beaconCall[1] as Blob).text();
    const eventProperties = JSON.parse(text);
    expect(eventProperties).toMatchObject({
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
  });

  test("Dispatch search event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:3000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    trackSearch({
      search: {
        query: "ddd",
      },
    });

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    expect(beaconCall[0]).toEqual(
      "http://127.0.0.1:3000/_application/analytics/collection/event/search"
    );
    const text = await (beaconCall[1] as Blob).text();
    const eventProperties = JSON.parse(text);
    expect(eventProperties).toMatchObject({
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
  });

  test("Dispatch search click event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:3000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    trackSearchClick({
      search: {
        query: "ddd",
      },
      document: {
        id: "1",
        index: "products",
      },
    });

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    expect(beaconCall[0]).toEqual(
      "http://127.0.0.1:3000/_application/analytics/collection/event/search_click"
    );
    const text = await (beaconCall[1] as Blob).text();
    const eventProperties = JSON.parse(text);
    expect(eventProperties).toMatchObject({
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
  });

  test("overriding the session", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:3000",
      apiKey: "sdddd",
      collectionName: "collection",
      user: {
        token: "user-overriden-token",
      },
    });

    trackSearchClick({
      search: {
        query: "ddd",
      },
      document: {
        id: "1",
        index: "products",
      },
    });

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    const text = await (beaconCall[1] as Blob).text();
    const eventProperties: EventProperties = JSON.parse(text);
    expect(eventProperties.user?.id).toBe("user-overriden-token");
  });
});
