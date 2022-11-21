import {
  createTracker,
  trackPageView,
  trackEvent,
  getTracker,
} from "@elastic/behavioural-analytics-javascript-tracker";

describe("Integration", () => {
  beforeEach(() => {
    // @ts-ignore
    navigator.sendBeacon = jest.fn(() => {});
  });

  test("exports", () => {
    expect(createTracker).toBeDefined();
    expect(trackPageView).toBeDefined();
    expect(trackEvent).toBeDefined();
  });

  test("Throws error when not initialised", () => {
    expect(() => {
      trackEvent("click", { test: "testCustom" });
    }).toThrowError("Behavioural Analytics: Tracker not initialized.");
  });

  test("get tracker", () => {
    expect(() => {
      getTracker();
    }).toThrow();

    createTracker({
      dsn: "http://localhost:9200",
    });

    expect(getTracker()).toBeDefined();
  });

  test("Dispatch track page view", () => {
    createTracker({
      dsn: "http://localhost:9200",
    });

    trackPageView({ test: "test" });

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    expect(beaconCall[0]).toEqual("http://localhost:9200/events");
    const eventProperties = JSON.parse(beaconCall[1]);
    expect(eventProperties).toMatchObject({
      event_data: {
        test: "test",
      },
      event_type: "pageview",
      url: "http://localhost/",
    });

    expect(eventProperties.user_uuid).toBeDefined();
  });

  test("Dispatch track event", () => {
    createTracker({
      dsn: "http://localhost:9200",
    });

    trackEvent("click", { test: "testCustom" });

    const beaconCall = (navigator.sendBeacon as jest.Mock).mock.calls[0];
    expect(beaconCall[0]).toEqual("http://localhost:9200/events");
    const eventProperties = JSON.parse(beaconCall[1]);
    expect(eventProperties).toMatchObject({
      event_data: {
        test: "testCustom",
      },
      event_type: "click",
    });

    expect(eventProperties.user_uuid).toBeDefined();
  });
});
