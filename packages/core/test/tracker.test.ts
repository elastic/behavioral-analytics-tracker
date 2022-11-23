import { Tracker } from "../src/tracker";

describe("Tracker", () => {
  const tracker = new Tracker({
    dsn: "http://localhost/collection",
    dataProviders: {
      eventType: (eventType: any, payload: any) => {
        return { ...payload, eventType };
      },
      foo: (_: any, payload: any) => {
        return { ...payload, foo: "value" };
      },
    },
  });

  describe("trackEvent", () => {
    describe("using sendBeacon", () => {
      beforeAll(() => (navigator.sendBeacon = jest.fn().mockImplementation()));

      test("send data at the right URL", () => {
        tracker.trackEvent("pageview");
        const [eventURL] = (navigator.sendBeacon as jest.Mock).mock.lastCall;
        expect(eventURL).toEqual("http://localhost/collection/events");
      });

      test("applies data providers", () => {
        tracker.trackEvent("pageview");
        const [_, encodedPayload] = (navigator.sendBeacon as jest.Mock).mock
          .lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          eventType: "pageview",
          foo: "value",
          url: "http://localhost/",
        });
      });

      test("merge user provided data with the data providers", () => {
        tracker.trackEvent("pageview", { userData: "user data value" });
        const [_, encodedPayload] = (navigator.sendBeacon as jest.Mock).mock
          .lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          eventType: "pageview",
          foo: "value",
          event_data: {
            userData: "user data value",
          },
          url: "http://localhost/",
        });
      });

      test("merge user provided data with session data", () => {
        tracker.trackEvent("pageview");
        const [_, encodedPayload] = (navigator.sendBeacon as jest.Mock).mock
          .lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          user_uuid: expect.any(String),
          session_uuid: expect.any(String),
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
        tracker.trackEvent("pageview");
        expect(openXHRMock).toHaveBeenCalledWith(
          "POST",
          "http://localhost/collection/events",
          true
        );
      });

      test("send data as text/plain", () => {
        tracker.trackEvent("pageview");
        expect(setRequestHeaderMock).toHaveBeenCalledWith(
          "Content-Type",
          "text/plain"
        );
      });

      test("applies data providers", () => {
        tracker.trackEvent("pageview");
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          eventType: "pageview",
          foo: "value",
          url: "http://localhost/",
        });
      });

      test("merge user provided data with the data providers", () => {
        tracker.trackEvent("pageview", { userData: "user data value" });
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          eventType: "pageview",
          foo: "value",
          event_data: {
            userData: "user data value",
          },
          url: "http://localhost/",
        });
      });

      test("merge user provided data with session data", () => {
        tracker.trackEvent("pageview");
        const [encodedPayload] = sendXHRMock.mock.lastCall;

        expect(JSON.parse(encodedPayload)).toMatchObject({
          user_uuid: expect.any(String),
          session_uuid: expect.any(String),
        });
      });
    });
  });
});
