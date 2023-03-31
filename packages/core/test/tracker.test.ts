import { Tracker } from "../src/tracker";
import mock from "xhr-mock";

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
    describe("using sendBeacon", () => {
      test("send data at the right URL", () => {
        expect.assertions(2);

        mock.post(
          "http://localhost:3000/_application/analytics/collection/event/page_view",
          (req, res) => {
            expect(req.header("authorization")).toEqual("Basic key");

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

      test("applies data providers", async () => {
        expect.assertions(2);

        mock.post(
          "http://localhost:3000/_application/analytics/collection/event/page_view",
          (req, res) => {
            expect(req.header("authorization")).toEqual("Basic key");

            expect(JSON.parse(req.body())).toMatchObject({
              foo: "value",
            });

            return res.status(201).body("{}");
          }
        );

        tracker.trackPageView({});
      });
    });
  });
});
