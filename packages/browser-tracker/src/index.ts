import { PageViewInputProperties, Tracker } from "@elastic/behavioral-analytics-tracker-core";
import type {
  TrackerEventType,
  EventInputProperties,
  SearchClickEventInputProperties,
  SearchEventInputProperties,
  TrackerOptions,
} from "@elastic/behavioral-analytics-tracker-core";

let tracker: Tracker | undefined;
let pendingTrackerEvents: Array<[TrackerEventType, EventInputProperties]> = [];

export interface BrowserTracker {
  createTracker: (options: TrackerOptions) => Tracker;
  trackPageView: (properties: PageViewInputProperties) => void;
  trackSearchClick: (properties: SearchClickEventInputProperties) => void;
  trackSearch: (properties: SearchEventInputProperties) => void;
}

const trackerShim: BrowserTracker = {
  createTracker: (options: TrackerOptions) => {
    tracker = new Tracker(options);
    pendingTrackerEvents.forEach(([eventType, properties]) => {
      tracker?.trackEvent(eventType, properties);
    });
    return tracker;
  },
  trackPageView: (properties: PageViewInputProperties) => {
    if (!tracker) {
      pendingTrackerEvents.push(["page_view", {}]);
      return;
    }
    tracker.trackPageView(properties);
  },
  trackSearchClick: (properties: SearchClickEventInputProperties) => {
    if (!tracker) {
      pendingTrackerEvents.push(["search_click", properties]);
      return;
    }
    tracker.trackSearchClick(properties);
  },
  trackSearch: (properties: SearchEventInputProperties) => {
    if (!tracker) {
      pendingTrackerEvents.push(["search", properties]);
      return;
    }
    tracker.trackSearch(properties);
  },
};

const trackPageView = () => {
  trackerShim.trackPageView({});
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
