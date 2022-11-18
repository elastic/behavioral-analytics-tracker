import { Tracker } from "@elastic/behavioural-analytics-tracker-core";
import { getScriptAttribute } from "./util/script-attribute";

const dsn = getScriptAttribute("data-dsn");
if (!dsn)
  throw new Error(
    "Behavioural Analytics: Missing DSN. Please refer to the integration guide."
  );
const tracker = new Tracker({ dsn });

const trackPageView = () => tracker.trackPageView();

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
