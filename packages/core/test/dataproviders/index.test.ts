import { DEFAULT_DATA_PROVIDERS } from "../../src/dataproviders/index";
import { processEvent } from "../../src/tracker";

describe("default dataproviders", () => {
  it("should export a default dataprovider", () => {
    expect(DEFAULT_DATA_PROVIDERS).toBeDefined();
  });

  it("should put the event in payload", () => {
    expect(
      processEvent("pageview", { test: "test" }, DEFAULT_DATA_PROVIDERS)
    ).toEqual({
      event_data: { test: "test" },
      event_type: "pageview",
      url: "http://localhost/",
    });
  });
});
