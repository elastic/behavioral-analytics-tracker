import {
  createTracker,
  trackPageView,
  getTracker,
  trackSearch,
  trackSearchClick,
} from "@elastic/behavioral-analytics-javascript-tracker";
import { Tracker } from "@elastic/behavioral-analytics-tracker-core";

describe("Integration", () => {
  beforeEach(() => {
    jest.spyOn(Tracker.prototype, "trackEvent").mockImplementation(() => {});
    jest.spyOn(Tracker.prototype, "trackPageView");
    jest.spyOn(Tracker.prototype, "trackSearch");
    jest.spyOn(Tracker.prototype, "trackSearchClick");
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
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    trackPageView();

    expect(Tracker.prototype.trackPageView).toHaveBeenCalled();
  });

  test("Dispatch search event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    const mockProperties = {
      search: {
        query: "ddd",
      },
    }

    trackSearch(mockProperties);

    expect(Tracker.prototype.trackSearch).toHaveBeenCalledWith(mockProperties);
  });

  test("Dispatch search click event", async () => {
    createTracker({
      endpoint: "http://127.0.0.1:4000",
      apiKey: "sdddd",
      collectionName: "collection",
    });

    const mockProperties = {
      search: {
        query: "ddd",
      },
      document: {
        id: "1",
        index: "products",
      },
    };

    trackSearchClick(mockProperties);

    expect(Tracker.prototype.trackSearchClick).toHaveBeenCalledWith(mockProperties);
  });
});
