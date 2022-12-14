import { Tracker } from "@elastic/behavioral-analytics-tracker-core";
import type {
  TrackerEventType,
  TrackerEventProperties,
  TrackerUserTokenProperties,
} from "@elastic/behavioral-analytics-tracker-core";
import { getScriptAttribute } from "./util/script-attribute";

const dsn = getScriptAttribute("data-dsn");
if (!dsn)
  throw new Error(
    "Behavioral Analytics: Missing DSN. Please refer to the integration guide."
  );

let tracker: Tracker | null = null;
let pendingTrackerEvents: Array<[TrackerEventType, TrackerEventProperties]> =
  [];

const trackerShim = {
  createTracker: (options?: TrackerUserTokenProperties) => {
    tracker = new Tracker({ ...options, dsn });
    pendingTrackerEvents.forEach(([eventType, properties]) => {
      tracker?.trackEvent(eventType, properties);
    });
    return tracker;
  },
  trackEvent: (
    eventType: TrackerEventType,
    properties?: TrackerEventProperties
  ) => {
    if (!tracker) {
      pendingTrackerEvents.push([eventType, properties || {}]);
      return;
    }
    tracker.trackEvent(eventType, properties);
  },
  trackPageView: (properties?: TrackerEventProperties) => {
    if (!tracker) {
      pendingTrackerEvents.push(["pageview", properties || {}]);
      return;
    }
    tracker.trackPageView(properties);
  },
};

const trackPageView = () => {
  trackerShim.trackPageView();
};

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

export default trackerShim;
