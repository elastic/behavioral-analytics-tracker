import { Tracker as TrackerCore } from "@elastic/behavioral-analytics-tracker-core";

jest.mock("@elastic/behavioral-analytics-tracker-core", () => {
  return {
    Tracker: jest.fn().mockImplementation(() => {
      return {
        trackEvent: jest.fn(),
        trackPageView: jest.fn(),
      };
    }),
  };
});

import Tracker from "../src/index";

// @ts-ignore
Object.defineProperty(window, "addEventListener", {
  configurable: true,
  value: jest.fn(),
});

describe("Tracker", () => {
  it("stores events until the tracker is created", () => {
    expect(TrackerCore).toBeDefined();
    expect(TrackerCore).toBeCalledTimes(0);
    Tracker.trackPageView({});
    Tracker.trackSearch({ search: { query: "test" } });
    Tracker.trackSearchClick({
      search: { query: "test" },
      document: { id: "test", index: "test" },
    });

    const t = Tracker.createTracker({
      apiKey: "ddd",
      collectionName: "test",
      endpoint: "http://localhost:3000",
    });
    expect(TrackerCore).toBeCalledTimes(1);
    expect(TrackerCore).toHaveBeenCalledWith({
      apiKey: "ddd",
      collectionName: "test",
      endpoint: "http://localhost:3000",
    });

    expect(t.trackEvent).toBeCalledWith("search", {
      search: { query: "test" },
    });
    expect(t.trackEvent).toBeCalledWith("page_view", {});
    expect(t.trackEvent).toBeCalledWith("search_click", {
      search: { query: "test" },
      document: { id: "test", index: "test" },
    });
  });
});
