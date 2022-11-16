import { randomFillSync } from "crypto";
// @ts-ignore
global.crypto = {
  // @ts-ignore
  getRandomValues: function (buffer) {
    return randomFillSync(buffer as unknown as DataView);
  },
};
