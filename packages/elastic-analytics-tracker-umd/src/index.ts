import { Tracker } from "@elastic/analytics-tracker";
import { getScriptAttribute } from "./util/script-attribute";

const endpointURL = getScriptAttribute("data-dsn");
if (!endpointURL)
  throw new Error(
    "Behavioural Analytics: Missing DSN. Please refer to the integration guide."
  );
const tracker = new Tracker({ endpointURL });

const trackPageView = () => tracker.trackEvent("pageview");

window.addEventListener("pageshow", trackPageView);

if (window.history) {
  const pushState = window.history.pushState;
  window.history.pushState = (...args) => {
    window.dispatchEvent(new Event("ewt:pushstate"));
    return pushState.apply(window.history, args);
  };
  window.addEventListener("ewt:pushstate", trackPageView);
  window.addEventListener("popstate", trackPageView);
} else {
  window.addEventListener("hashchange", trackPageView);
}

export default tracker;
