import moment from "moment";

import { visitorId } from "../../src/util/session";

jest.mock("../../src/util/cookies");
jest.mock("../../src/util/uuid");

import { getCookie, setCookie } from "../../src/util/cookies";
import { uuidv4 } from "../../src/util/uuid";

describe("visitorId", () => {
  describe("when the cookie is already set", () => {
    beforeEach(() => {
      (getCookie as jest.Mock).mockImplementation(() => "cookie_value");
    });

    test("returns the cookie value", () => {
      expect(visitorId()).toEqual("cookie_value");
    });

    test("set a cookie value to expire at the end of the day", () => {
      visitorId();
      const endOfDay = moment().endOf("day").toDate();
      expect(setCookie).toHaveBeenCalledWith(
        "EA_VID",
        "cookie_value",
        endOfDay
      );
    });
  });

  describe("when the cookie is not set", () => {
    beforeEach(() => {
      (uuidv4 as jest.Mock).mockImplementation(() => "generated_uuid");
    });

    test("generates a new value", () => {
      expect(visitorId()).toEqual("generated_uuid");
    });

    test("set a cookie value to expire at the end of the day", () => {
      visitorId();
      const endOfDay = moment().endOf("day").toDate();
      expect(setCookie).toHaveBeenCalledWith(
        "EA_VID",
        "generated_uuid",
        endOfDay
      );
    });
  });
});
