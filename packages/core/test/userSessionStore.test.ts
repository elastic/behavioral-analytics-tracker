import { UserSessionStore } from "../src/user_session_store";
import * as cookieUtils from "../src/util/cookies";

describe("UserSessionStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.useFakeTimers().setSystemTime(new Date('1984-01-18'));
    jest.spyOn(cookieUtils, "setCookie").mockReturnValue(undefined);
    jest.spyOn(cookieUtils, "getCookie").mockImplementation((key) => key === "EA_UID" ? "new-custom-user-token" : undefined);
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
      test("sets EA_SESSION_SAMPLED cookie to true when random number is lower than sampling rate", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.4);

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

      test("sets EA_SESSION_SAMPLED cookie to false when random number is higher than sampling rate", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.6);

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

    describe("when EA_SESSION_SAMPLED cookie is present", () => {
      test("does not update EA_SESSION_SAMPLED cookie", () => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");

        new UserSessionStore({
          user: {
            token: "new-custom-user-token",
            lifetime: 10000,
          },
          session: {},
          sampling: 1,
        });

        expect(cookieUtils.setCookie).not.toHaveBeenCalledWith("EA_SESSION_SAMPLED", expect.anything(), expect.any(Date));
      });

      test("update when EA_SESSION_SAMPLED cookie is false and sampled is 1", () => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("false");

        new UserSessionStore({
          user: {
            token: "new-custom-user-token",
            lifetime: 10000,
          },
          session: {},
          sampling: 1,
        });

        expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "true", expect.any(Date));
      });
    });
  });

  describe("when sampling rate is not passed", () => {
    test("sets EA_SESSION_SAMPLED cookie default to true", () => {
      new UserSessionStore({
        user: {
          token: "new-custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });

      expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "true", expect.any(Date));
    });
  });

  describe("getUserUuid", () => {
    let userSessionStore: UserSessionStore;

    beforeEach(() => {
      userSessionStore = new UserSessionStore({
        user: {
          token: "custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });
    });

    describe("when EA_UID cookie is present", () => {
      beforeEach(() => {
        jest.spyOn(cookieUtils, "getCookie").mockReturnValue("custom-user-token");
      });

      test("returns the same EA_UID", () => {
        expect(userSessionStore.getUserUuid()).toEqual("custom-user-token");
      });

      test("doesn't update expirationDate", () => {
        jest.clearAllMocks();

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
    let userSessionStore: UserSessionStore;

    beforeEach(() => {
      userSessionStore = new UserSessionStore({
        user: {
          token: "custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });
    });

    test("when EA_SID cookie is present returns session uuid from cookies", () => {
      jest.spyOn(cookieUtils, "getCookie").mockReturnValue("custom-user-token");
      expect(userSessionStore.getSessionUuid()).toEqual("custom-user-token");
    });

    test("updates expiration date for cookie", () => {
      const expirationDate = new Date();
      expirationDate.setMilliseconds(30 * 60 * 1000);

      userSessionStore.updateSessionExpire();

      expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SID", expect.any(String), expirationDate);
    });
  });

  describe("EA_SESSION_SAMPELD", () => {
    let userSessionStore: UserSessionStore;

    beforeEach(() => {
      userSessionStore = new UserSessionStore({
        user: {
          token: "custom-user-token",
          lifetime: 10000,
        },
        session: {},
      });
    });

    test("when EA_SESSION_SAMPELD cookie is present returns session sampling param from cookies", () => {
      jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");
      expect(userSessionStore.isSessionSampled()).toEqual(true);
    });

    test("when EA_SESSION_SAMPELD cookie is not present returns session sampling param from cookies", () => {
      jest.spyOn(cookieUtils, "getCookie").mockReturnValue('');
      expect(userSessionStore.isSessionSampled()).toEqual(false);
    });

    test("updates expiration date for cookie", () => {
      jest.spyOn(cookieUtils, "getCookie").mockReturnValue("true");
      const expirationDate = new Date();
      expirationDate.setMilliseconds(30 * 60 * 1000);

      userSessionStore.updateSessionSampledExpire();

      expect(cookieUtils.setCookie).toHaveBeenCalledWith("EA_SESSION_SAMPLED", "true", expirationDate);
    });
  });
});
