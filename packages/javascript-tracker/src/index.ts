import {
  Tracker,
  TrackerEventProperties,
  TrackerEventType,
  TrackerOptions,
} from "@elastic/behavioral-analytics-tracker-core";

let sharedTracker: Tracker | null = null;

function getSharedTracker(): Tracker {
  if (sharedTracker === null) {
    throw new Error("behavioral Analytics: Tracker not initialized.");
  }

  return sharedTracker;
}

export function createTracker(options: TrackerOptions) {
  sharedTracker = new Tracker(options);
  return sharedTracker;
}

export function getTracker() {
  return getSharedTracker();
}

export function trackEvent(
  eventType: TrackerEventType,
  properties: TrackerEventProperties
) {
  return getSharedTracker()?.trackEvent(eventType, properties);
}

export function trackPageView(properties?: TrackerEventProperties) {
  return getSharedTracker()?.trackPageView(properties);
}
