import { getCookie, setCookie } from "./util/cookies";

import { uuidv4 } from "./util/uuid";

const DEFAULT_SAMPLING = 1;
const DEFAULT_USER_EXPIRATION_INTERVAL = 24 * 60 * 60 * 1000;
const DEFAULT_SESSION_EXPIRATION_INTERVAL = 30 * 60 * 1000;
const DEFAULT_SESSION_SAMPLED_INTERVAL = DEFAULT_SESSION_EXPIRATION_INTERVAL;

const COOKIE_USER_NAME = "EA_UID";
const COOKIE_SESSION_NAME = "EA_SID";
const COOKIE_SESSION_SAMPLED_NAME = "EA_SESSION_SAMPLED";

interface UserSessionOptions {
  user: {
    token?: string;
    lifetime?: number;
  };
  session: {
    lifetime?: number;
  };
  sampling?: number;
}

export class UserSessionStore {
  private userToken: string;
  private userTokenExpirationInterval: number;
  private sessionTokenExpirationInterval: number;
  private sampling: number;

  constructor(userSessionOptions: UserSessionOptions) {
    this.userToken =
      userSessionOptions.user.token || getCookie(COOKIE_USER_NAME) || uuidv4();
    this.userTokenExpirationInterval =
      userSessionOptions.user.lifetime || DEFAULT_USER_EXPIRATION_INTERVAL;
    this.sessionTokenExpirationInterval =
      userSessionOptions.session.lifetime ||
      DEFAULT_SESSION_EXPIRATION_INTERVAL;
    this.sampling = userSessionOptions.sampling === undefined ? DEFAULT_SAMPLING : userSessionOptions.sampling;

    if (!getCookie('EA_SESSION_SAMPLED') || (!this.isSessionSampled() && this.sampling === 1)) {
      this.updateSessionSampledExpire(this.sampling === 1);
    }

    if (this.userToken !== getCookie(COOKIE_USER_NAME)) {
      this.updateUserExpire();
    }
  }

  getUserUuid() {
    let userId = getCookie(COOKIE_USER_NAME);

    if (!userId) {
      this.updateUserExpire();
      userId = getCookie(COOKIE_USER_NAME);
    }

    return userId;
  }

  isSessionSampled() {
    return getCookie(COOKIE_SESSION_SAMPLED_NAME) == 'true';
  }

  updateSessionSampledExpire(ignoreCookie: boolean = false) {
    const sampled = !ignoreCookie && getCookie(COOKIE_SESSION_SAMPLED_NAME)
      ? getCookie(COOKIE_SESSION_SAMPLED_NAME)!
      : (Math.random() <= this.sampling).toString();

    const expiresAt = new Date();
    expiresAt.setMilliseconds(DEFAULT_SESSION_SAMPLED_INTERVAL);
    setCookie(COOKIE_SESSION_SAMPLED_NAME, sampled, expiresAt);
  }

  getSessionUuid() {
    return getCookie(COOKIE_SESSION_NAME);
  }

  updateSessionExpire() {
    const sessionId = getCookie(COOKIE_SESSION_NAME) || uuidv4();

    const expiresAt = new Date();
    expiresAt.setMilliseconds(this.sessionTokenExpirationInterval);
    setCookie(COOKIE_SESSION_NAME, sessionId, expiresAt);
  }

  private updateUserExpire() {
    const expiresAtDate = new Date();
    expiresAtDate.setMilliseconds(this.userTokenExpirationInterval);

    setCookie(COOKIE_USER_NAME, this.userToken, expiresAtDate);
  }
}
