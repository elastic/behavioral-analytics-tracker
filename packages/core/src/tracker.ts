import { DEFAULT_DATA_PROVIDERS } from "./dataproviders";
import {
  TrackerEvent,
  TrackerEventProperties,
  TrackerEventType,
  DataProvider,
  TrackerOptions,
} from "./types";

export const processEvent = (
  eventType: TrackerEventType,
  properties: TrackerEventProperties,
  dataProviders: Record<string, DataProvider>
) => {
  return Object.values(dataProviders).reduce<TrackerEventProperties>(
    (props, dataProvider) => {
      return dataProvider(eventType, props);
    },
    { event_data: properties }
  ) as TrackerEvent;
};

export class Tracker {
  private dataProviders: Record<string, DataProvider>;
  private endpointURL: string;

  constructor(options: TrackerOptions) {
    this.endpointURL = options.dsn;
    this.dataProviders = {
      ...DEFAULT_DATA_PROVIDERS,
      ...(options.dataProviders || {}),
    };
  }

  trackEvent(
    eventType: TrackerEventType,
    properties: TrackerEventProperties = {}
  ) {
    const eventData = processEvent(eventType, properties, this.dataProviders);

    const encodedPayload = JSON.stringify(eventData);
    const eventTrackerURL = `${this.endpointURL}/events`;

    if (navigator.sendBeacon != null) {
      navigator.sendBeacon(eventTrackerURL, encodedPayload);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", eventTrackerURL, true);
      xhr.setRequestHeader("Content-Type", "text/plain");

      xhr.send(encodedPayload);
    }
  }

  trackPageView(properties?: TrackerEventProperties) {
    this.trackEvent("pageview", properties);
  }
}
