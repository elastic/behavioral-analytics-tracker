export function getScriptAttribute(attributeName: string) {
  const scriptElement = document.currentScript;
  return scriptElement?.getAttribute(attributeName);
}
