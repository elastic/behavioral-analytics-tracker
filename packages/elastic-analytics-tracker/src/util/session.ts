import { getCookie, setCookie } from './cookies';
import { uuidv4 } from './uuid';


export function visitorId() {
  const visitorId = getCookie('EA_VID') || uuidv4();

  const expiresAt = new Date();
  expiresAt.setHours(23, 59, 59, 999);
  setCookie('EA_VID', visitorId, expiresAt);

  return visitorId;
};
