import { Tracker } from "@elastic/behavioral-analytics-tracker-core";

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

// @ts-ignore
Object.defineProperty(window, "addEventListener", {
  configurable: true,
  value: jest.fn(),
});

// @ts-ignore
Object.defineProperty(document, "currentScript", {
  configurable: true,
  value: {
    getAttribute: jest.fn(() => "https://example.com"),
  },
});

let tracker = require("../src/index").default;

describe("Tracker", () => {
  it("stores events until the tracker is created", () => {
    expect(tracker).toBeDefined();
    expect(Tracker).not.toHaveBeenCalled();
    tracker.trackEvent("search", { query: "test" });
    tracker.trackPageView({ category: "test" });

    const t = tracker.createTracker();
    expect(Tracker).toBeCalledTimes(1);
    expect(Tracker).toHaveBeenCalledWith({
      dsn: "https://example.com",
    });
    expect(t.trackEvent).toBeCalledWith("search", { query: "test" });
    expect(t.trackEvent).toBeCalledWith("pageview", { category: "test" });
  });
});
