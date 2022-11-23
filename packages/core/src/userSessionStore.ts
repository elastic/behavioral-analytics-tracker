import { UserSessionOptions } from "./types";
import { getCookie, setCookie } from './util/cookies';

import { uuidv4 } from "./util/uuid";

const DEFAULT_USER_EXPIRATION_INTERVAL = 24 * 60 * 60 * 1000;
const DEFAULT_SESSION_EXPIRATION_INTERVAL = 30 * 60 * 1000;

export class UserSessionStore {
  private userToken: string;
  private userTokenExpirationInterval: number;

  constructor(userSessionOptions: UserSessionOptions) {
    this.userToken = userSessionOptions.userToken || getCookie('EA_UID') || uuidv4();
    this.userTokenExpirationInterval = userSessionOptions.userTokenExpirationInterval || DEFAULT_USER_EXPIRATION_INTERVAL;

    if(this.userToken !== getCookie('EA_UID')) {
      this.updateUserExpire();
    }
  }

  getUserUuid() {
    let userId = getCookie('EA_UID');

    if (!userId) {
      this.updateUserExpire();
      userId = getCookie('EA_UID')
    }

    return userId;
  }

  getSessionUuid() {
    return getCookie('EA_SID');
  }

  updateSessionExpire() {
    const sessionId = getCookie('EA_SID') || uuidv4();

    const expiresAt = new Date();
    expiresAt.setMilliseconds(DEFAULT_SESSION_EXPIRATION_INTERVAL);
    setCookie('EA_SID', sessionId, expiresAt);
  }

  private updateUserExpire() {
    const expiresAtDate = new Date();
    expiresAtDate.setMilliseconds(this.userTokenExpirationInterval);

    setCookie('EA_UID', this.userToken, expiresAtDate);
  }
}
