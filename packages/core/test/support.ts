import { randomFillSync } from "crypto";
// @ts-ignore
global.crypto = {
  // @ts-ignore
  getRandomValues: function (buffer) {
    return randomFillSync(buffer as unknown as DataView);
  },
};

export function getCookie(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length === 2 && parts[1]) {
    return parts.pop()?.split(";").shift();
  }
}
export function getCookieExpirationDate(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length === 2 && parts[1]) {
    return parts.pop()?.split(";")[1].replace(" expires=", "");
  }
}
