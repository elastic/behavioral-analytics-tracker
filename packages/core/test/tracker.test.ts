import { Tracker } from "../src/tracker";
// @ts-ignore
import { Blob } from "blob-polyfill";
import { EventProperties } from "../src";
globalThis.Blob = Blob;

describe("Tracker", () => {
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

  describe("trackEvent", () => {
    describe("using sendBeacon", () => {
      beforeAll(() => (navigator.sendBeacon = jest.fn().mockImplementation()));

      test("send data at the right URL", () => {
        tracker.trackPageView({});
        const [eventURL] = (navigator.sendBeacon as jest.Mock).mock.lastCall;
        expect(eventURL).toEqual(
          "http://localhost:3000/_application/analytics/collection/event/page_view"
        );
      });

      test("applies data providers", async () => {
        tracker.trackEvent("page_view", {});
        const [_, blob] = (navigator.sendBeacon as jest.Mock).mock.lastCall;

        const encodedPayload = await blob.text();
        expect(JSON.parse(encodedPayload)).toMatchObject({
          foo: "value",
        });
      });

      test("merge user provided data with session data", async () => {
        tracker.trackEvent("page_view", {});
        const [_, blob] = (navigator.sendBeacon as jest.Mock).mock.lastCall;
        const encodedPayload = await blob.text();

        expect(JSON.parse(encodedPayload)).toMatchObject({
          user: {
            id: expect.any(String),
          },
          session: {
            id: expect.any(String),
          },
        });
      });
    });

    describe("using XMLHttpRequest", () => {
      const openXHRMock = jest.fn().mockImplementation();
      const setRequestHeaderMock = jest.fn().mockImplementation();
      const sendXHRMock = jest.fn().mockImplementation();

      beforeEach(() => {
        Object.defineProperty(global.navigator, "sendBeacon", {
          value: undefined,
        });
        // @ts-ignore
        window.XMLHttpRequest = jest.fn().mockImplementation(() => {
          return {
            open: openXHRMock,
            setRequestHeader: setRequestHeaderMock,
            send: sendXHRMock,
          };
        });
      });

      test("send data at the right URL using a POST", () => {
        tracker.trackEvent("page_view", {});
        expect(openXHRMock).toHaveBeenCalledWith(
          "POST",
          "http://localhost:3000/_application/analytics/collection/event/page_view",
          true
        );
      });

      test("send data as text/plain", () => {
        tracker.trackEvent("page_view", {});
        expect(setRequestHeaderMock).toHaveBeenCalledWith(
          "Content-Type",
          "application/json"
        );
        expect(setRequestHeaderMock).toHaveBeenCalledWith(
          "Authorization",
          "Basic key"
        );
      });

      test("applies data providers", () => {
        tracker.trackEvent("page_view", {});
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          foo: "value",
        });
      });

      test("merge user provided data with the data providers", () => {
        tracker.trackEvent("page_view", {
          search: { query: "user data value" },
        });
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          foo: "value",
          search: {
            query: "user data value",
          },
        });
      });

      test("merge user provided data with session data", () => {
        tracker.trackEvent("page_view", {});
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          user: {
            id: expect.any(String),
          },
          session: {
            id: expect.any(String),
          },
        });
      });
    });
  });
});
