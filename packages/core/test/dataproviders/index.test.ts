import { DEFAULT_DATA_PROVIDERS } from "../../src/dataproviders/index";
import { processEvent } from "../../src/tracker";

describe("default dataproviders", () => {
  it("should export a default dataprovider", () => {
    expect(DEFAULT_DATA_PROVIDERS).toBeDefined();
  });

  it("should put the event in payload", () => {
    expect(
      processEvent(
        "page_view",
        {
          search: {
            query: "test",
          },
        },
        DEFAULT_DATA_PROVIDERS
      )
    ).toEqual({
      search: { query: "test" },
      page: {
        referrer: "",
        title: "",
        url: "http://localhost/",
      },
    });
  });

  it("should put the event in payload", () => {
    expect(
      processEvent(
        "search",
        {
          search: {
            query: "test",
          },
        },
        DEFAULT_DATA_PROVIDERS
      )
    ).toEqual({
      search: { query: "test" },
    });
  });
});
