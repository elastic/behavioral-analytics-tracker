import { UserSessionStore } from "../src/user_session_store";
import * as cookieUtils from "../src/util/cookies";

describe("UserSessionStore", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('1984-01-18'));

    jest.spyOn(cookieUtils, "setCookie").mockReturnValue();
  });

  describe("when passed userToken is different than in cookies", () => {
    beforeEach(() => {
      jest.spyOn(cookieUtils, "getCookie").mockReturnValue("generic-user-token");
    });

    test("updates token in cookies with the user's one", () => {
      new UserSessionStore({
        user: {
          token: "new-custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });
      expect(cookieUtils.setCookie).toBeCalledWith("EA_UID", "new-custom-user-token", expect.any(Date));
    });
  });

  describe("when sampling rate is passed", () => {
    describe("when EA_SESSION_SAMPLED cookie is not present", () => {
      describe("when random number is lower than sampling rate", () => {
        beforeEach(() => {
          jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
        });

        test("sets EA_SESSION_SAMPLED cookie to true", () => {
          new UserSessionStore({
            user: {
              token: "new-custom-user-token",
              lifetime: 10000,
            },
            session: {},
            sampling: 0.5,
          });
          expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "true", expect.any(Date));
        });
      });

      describe("when random number is higher than sampling rate", () => {
        beforeEach(() => {
          jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
        });

        test("sets EA_SESSION_SAMPLED cookie to false", () => {
          new UserSessionStore({
            user: {
              token: "new-custom-user-token",
              lifetime: 10000,
            },
            session: {},
            sampling: 0.5,
          });
          expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "false", expect.any(Date));
        });
      });
    });

    describe("when EA_SESSION_SAMPLED cookie is present", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");
      });

      test("does not update EA_SESSION_SAMPLED cookie", () => {
        new UserSessionStore({
          user: {
            token: "new-custom-user-token",
            lifetime: 10000,
          },
          session: {},
          sampling: 1,
        });

        expect(cookieUtils.setCookie).not.toHaveBeenCalledWith("EA_SESSION_SAMPLED", "false", expect.any(Date));
      });
    });
  });

  describe("when sampling rate is not passed", () => {
    test("sets EA_SESSION_SAMPLED cookie to false", () => {
      new UserSessionStore({
        user: {
          token: "new-custom-user-token",
          lifetime: 10000,
        },
          session: {},
      });

      expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "false", expect.any(Date));
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
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("custom-user-token");
      });

      test("returns the same EA_UID", () => {
        expect(userSessionStore.getUserUuid()).toEqual("custom-user-token");
      });

      test("doesn't update expirationDate", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(10000);

        userSessionStore.getUserUuid();
        expect(cookieUtils.setCookie).not.toHaveBeenCalled();
      });
    });

    describe("when EA_UID cookie is not present", () => {
      test("builds new user_uuid and saves to cookies with expirationDate", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(10000);

        userSessionStore.getUserUuid();

        expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_UID", "custom-user-token", expirationDate);
      });
    });
  });

  describe("getSessionUuid", () => {
    describe("when EA_SID cookie is present", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("custom-user-token");
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

        expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SID", expect.any(String), expirationDate);
      });
    });
  });

  describe("isSessionSampled", () => {
    describe("when EA_SESSION_SAMPELD cookie is present", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");
      });

      test("returns session sampling param from cookies", () => {
        expect(userSessionStore.isSessionSampled()).toEqual(true);
      });
    });

    describe("when EA_SESSION_SAMPELD cookie is not present", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue('');
      });

      test("returns session sampling param from cookies", () => {
        expect(userSessionStore.isSessionSampled()).toEqual(false);
      });
    });

    describe("updateSessionSampledExpire", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");
      });

      test("updates expiration date for cookie", () => {
        const expirationDate = new Date();
        expirationDate.setMilliseconds(30 * 60 * 1000);

        userSessionStore.updateSessionSampledExpire();

        expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "true", expirationDate);
      });
    });
  });
});
