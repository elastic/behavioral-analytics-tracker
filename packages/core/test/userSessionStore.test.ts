import { UserSessionStore } from "../src/user_session_store";
import { getCookie, getCookieExpirationDate } from "./support";

describe("UserSessionStore", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("1984-01-18"));
  });

  describe("when passed userToken is different than in cookies", () => {
    beforeEach(() => {
      Object.defineProperty(window.document, "cookie", {
        writable: true,
        value:
          "EA_UID=generic-user-token; expires=Wed, 18 Jan 1984 00:00:10 GMT; path=/",
      });
    });

    test("updates token in cookies with the user's one", () => {
      new UserSessionStore({
        user: {
          token: "new-custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });

      expect(getCookie("EA_UID")).toEqual("new-custom-user-token");
    });
  });

  const userSessionStore = new UserSessionStore({
    user: {
      token: "custom-user-token",
      lifetime: 10000,
    },
    session: {},
  });

  describe("getUserUuid", () => {
    describe("when EA_UID cookie is present", () => {
      beforeAll(() => {
        Object.defineProperty(window.document, "cookie", {
          writable: true,
          value:
            "EA_UID=custom-user-token; expires=Wed, 18 Jan 1984 00:00:10 GMT; path=/",
        });
      });

      test("returns the same EA_UID", () => {
        expect(userSessionStore.getUserUuid()).toEqual("custom-user-token");
      });

      test("doesn't update expirationDate", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(10000);

        userSessionStore.getUserUuid();

        expect(getCookieExpirationDate("EA_UID")).toEqual(
          expirationDate.toUTCString()
        );
      });
    });

    describe("when EA_UID cookie is not present", () => {
      test("builds new user_uuid and saves to cookies with expirationDate", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(10000);

        userSessionStore.getUserUuid();

        expect(getCookie("EA_UID")).toEqual("custom-user-token");
        expect(getCookieExpirationDate("EA_UID")).toEqual(
          expirationDate.toUTCString()
        );
      });
    });
  });

  describe("getSessionUuid", () => {
    describe("when EA_SID cookie is present", () => {
      beforeEach(() => {
        Object.defineProperty(window.document, "cookie", {
          writable: true,
          value:
            "EA_SID=custom-user-token; expires=Wed, 17 Jan 1984 23:59:00 GMT; path=/",
        });
      });

      test("returns session uuid from cookies", () => {
        expect(userSessionStore.getSessionUuid()).toEqual("custom-user-token");
      });
    });

    describe("updateSessionExpire", () => {
      test("updates expiration date for cookie", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(30 * 60 * 1000);

        userSessionStore.updateSessionExpire();

        expect(getCookieExpirationDate("EA_SID")).toEqual(
          expirationDate.toUTCString()
        );
      });
    });
  });
});
