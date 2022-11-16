import { DEFAULT_DATA_PROVIDERS } from "../../src/dataproviders/index";
import { processEvent } from "../../src/tracker";
import { visitorId } from "../../src/util/session";

jest.mock("../../src/util/session", () => ({
  visitorId: jest.fn(),
}));

describe("default dataproviders", () => {
  it("should export a default dataprovider", () => {
    expect(DEFAULT_DATA_PROVIDERS).toBeDefined();
  });

  it("should put the event in payload", () => {
    (visitorId as jest.Mock).mockReturnValue("visitor-id");
    expect(
      processEvent("pageview", { test: "test" }, DEFAULT_DATA_PROVIDERS)
    ).toEqual({
      event_data: { test: "test" },
      event_type: "pageview",
      url: "http://localhost/",
      user_uuid: "visitor-id",
    });
  });
});
