import { Tracker } from "../src/tracker";
import mock from "xhr-mock";
import * as cookieUtils from "../src/util/cookies";

describe("Tracker", () => {
  beforeEach(() => mock.setup());

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
    beforeEach(() => {
      jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('true');
    });

    test("send data at the right URL - page_view event", () => {
      expect.assertions(2);

      mock.post(
        "http://localhost:3000/_application/analytics/collection/event/page_view",
        (req, res) => {
          expect(req.header("authorization")).toEqual("Apikey key");

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

      tracker.trackPageView({});
    });

    test("send data at the right URL - search event", () => {
      expect.assertions(3);

      mock.post(
        "http://localhost:3000/_application/analytics/collection/event/search",
        (req, res) => {
          expect(req.header("authorization")).toEqual("Apikey key");

          const response = JSON.parse(req.body());

          expect(response).toMatchObject({
            search: {
              query: "query",
            },
            session: {
              id: expect.any(String),
            },
            user: {
              id: expect.any(String),
            },
          });

          expect(response).not.toHaveProperty("page");
          return res.status(201).body("{}");
        }
      );

      tracker.trackSearch({
        search: {
          query: "query",
        },
      });
    });

    test("send data at the right URL - search click event", () => {
      expect.assertions(5);

      mock.post(
        "http://localhost:3000/_application/analytics/collection/event/search_click",
        (req, res) => {
          expect(req.header("authorization")).toEqual("Apikey key");

          const response = JSON.parse(req.body());

          expect(response).toMatchObject({
            search: {
              query: "query",
            },
            session: {
              id: expect.any(String),
            },
            user: {
              id: expect.any(String),
            },
          });

          expect(response).toHaveProperty("page");
          expect(response.page).toHaveProperty(
            "url",
            "http://my-url-to-navigate/"
          );
          expect(response.document).toMatchInlineSnapshot(`
            {
              "id": "123",
              "index": "1",
            }
          `);
          return res.status(201).body("{}");
        }
      );

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
    });

    test("applies data providers", async () => {
      expect.assertions(2);

      mock.post(
        "http://localhost:3000/_application/analytics/collection/event/page_view",
        (req, res) => {
          expect(req.header("authorization")).toEqual("Apikey key");

          expect(JSON.parse(req.body())).toMatchObject({
            foo: "value",
          });

          return res.status(201).body("{}");
        }
      );

      tracker.trackPageView({});
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
