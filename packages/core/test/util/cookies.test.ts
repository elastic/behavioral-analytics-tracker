import moment from "moment";
import { getCookie, setCookie } from "../../src/util/cookies";

describe("getCookie", () => {
  const setDocumentCookies = (cookies: string) => {
    Object.defineProperty(document, "cookie", {
      value: cookies,
      configurable: true,
    });
  };

  describe("when the cookie is not set", () => {
    describe("document.cookie is empty", () => {
      it("returns undefined", () => {
        setDocumentCookies("");
        expect(getCookie("foo")).toBeUndefined();
      });
    });

    describe.each(["bar=val", "bar=val1; baz=val2"])("docuent.cookie is %s", (cookies) => {
      it("returns undefined", () => {
        setDocumentCookies(cookies);
        expect(getCookie("foo")).toBeUndefined();
      });
    });
  });

  describe("when the cookie is set", () => {
    describe.each([
      "foo=fooval",
      "foo=fooval; bar=bazval",
      "bar=bazval; foo=fooval",
      "baz=bazval; foo=fooval; bar=bazval",
    ])("docuent.cookie is %s", (cookies) => {
      it("returns undefined", () => {
        setDocumentCookies(cookies);
        expect(getCookie("foo")).toEqual("fooval");
      });
    });
  });
});

describe("setCookie", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      set: jest.fn().mockImplementation(),
      configurable: true,
    });
  });

  const documentCookieSetter = () => {
    return Object.getOwnPropertyDescriptor(document, "cookie")?.set;
  };

  test("it set the cookie", () => {
    setCookie("foo", "value", moment("1984-01-18").toDate());
    expect(documentCookieSetter()).toHaveBeenCalledWith(
      "foo=value; expires=Wed, 18 Jan 1984 00:00:00 GMT; path=/"
    );
  });
});
