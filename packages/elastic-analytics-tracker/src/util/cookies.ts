export function getCookie(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length === 2 && parts[1]) {
    return parts.pop()?.split(";").shift();
  }
}

export function setCookie(
  cookieName: string,
  cookieValue: string,
  expiresAt: Date,
  path: string = "/"
) {
  var expires = "expires=" + expiresAt.toUTCString();
  document.cookie =
    cookieName + "=" + cookieValue + "; " + expires + "; path=" + path;
}
