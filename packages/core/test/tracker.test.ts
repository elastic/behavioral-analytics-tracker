import { Tracker } from "../src/tracker";
import * as cookieUtils from "../src/util/cookies";

const flushPromises = () =>
  new Promise((resolve) => jest.requireActual('timers').setImmediate(resolve));


describe("Tracker", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve()
    }));
  })

  const tracker = new Tracker({
    apiKey: "key",
    endpoint: "http://localhost:3000",
    collectionName: "collection",
    dataProviders: {
      foo: (_, properties) => {
        return { ...properties, foo: "value" };
      },
    },
  });

  describe("Tracker instance", () => {
    test.each([["apiKey", {
      apiKey: "",
      endpoint: "http://localhost:3000",
      collectionName: "collection",
    }], ["endpoint", {
      apiKey: "key",
      endpoint: "",
      collectionName: "collection",
    }], ["collectionName", {
      apiKey: "key",
      endpoint: "http://localhost:3000",
      collectionName: "",
    }]])("throw error when %s is not provided", (_, options) => {
      try {
        new Tracker(options);
      } catch (e: unknown) {
        expect((e as Error).message).toEqual("Missing one  or more of required options: endpoint, collectionName, apiKey");
      }
    });
  });

  describe("trackEvent", () => {
    beforeEach(() => {
      jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('true');
    });

    test("send data at the right URL - page_view event", () => {
      tracker.trackPageView({});

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/_application/analytics/collection/event/page_view",
        expect.anything()
      );
    });

    test("send data at the right URL search event", () => {
      tracker.trackSearch({
        search: {
          query: "query",
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/_application/analytics/collection/event/search",
        expect.anything()
      );
    });

    test("send data at the right URL - search click event", () => {
      tracker.trackSearchClick({
        search: {
          query: "query",
        },
        page: {
          url: "http://my-url-to-navigate/",
        },
        document: {
          id: "123",
          index: "1",
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/_application/analytics/collection/event/search_click",
        expect.anything()
      );
    });

    test("applies data providers", () => {
      tracker.trackPageView({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({
          body: expect.stringContaining('"foo":"value"'),
          headers: {
            "Authorization": "Apikey key",
            "Content-Type": "application/json",
          },
        }));
    });

    describe("error handling", () => {
      test("when fetch is failed", async () => {
        const mockError = new Error('some error');
        // @ts-ignore
        global.fetch = jest.fn(() => Promise.reject(mockError));
        jest.spyOn(global.console, 'error').mockImplementation(() => {
        });

        tracker.trackPageView({});

        await flushPromises();

        expect(global.console.error).toHaveBeenCalledWith(mockError);
      });

      test("when request returns 4xx, 5xx status code", async () => {
        const mockErrorReason = "some field is missing";
        // @ts-ignore
        global.fetch = jest.fn(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: { caused_by: { reason: mockErrorReason } } })
        }));
        jest.spyOn(global.console, 'error').mockImplementation(() => {
        });

        tracker.trackPageView({});

        await flushPromises();

        expect(global.console.error).toHaveBeenCalledWith(new Error(mockErrorReason));
      });
    });
  });

  describe("when session is not sampled", () => {
    beforeEach(() => {
      global.navigator.sendBeacon = jest.fn().mockImplementation();
      // @ts-ignore
      window.XMLHttpRequest = jest.fn().mockImplementation();

      jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('false');
    });

    describe("using XMLHttpRequest", () => {
      test("does not send data", () => {
        tracker.trackPageView({});
        expect(XMLHttpRequest).not.toHaveBeenCalled();
      });
    });
  })
});
