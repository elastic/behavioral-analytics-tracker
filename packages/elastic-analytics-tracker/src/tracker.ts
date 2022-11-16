import { DEFAULT_DATA_PROVIDERS } from "./dataproviders";
import {
  AnalyticsEvent,
  AnalyticsEventPayload,
  AnalyticsEventType,
  DataProvider,
} from "./types";

export const processEvent = (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload,
  dataProviders: Record<string, DataProvider>
) => {
  return Object.values(dataProviders).reduce<AnalyticsEventPayload>(
    (payload, dataProvider) => {
      return dataProvider(eventType, payload);
    },
    { event_data: payload }
  ) as AnalyticsEvent;
};

export class Tracker {
  private dataProviders: Record<string, DataProvider>;
  private endpointURL: string;

  constructor({
    endpointURL,
    dataProviders = {},
  }: {
    endpointURL: string;
    dataProviders?: Record<string, DataProvider>;
  }) {
    this.endpointURL = endpointURL;
    this.dataProviders = { ...DEFAULT_DATA_PROVIDERS, ...dataProviders };
  }

  trackEvent(
    eventType: AnalyticsEventType,
    payload: AnalyticsEventPayload = {}
  ) {
    const eventData = processEvent(eventType, payload, this.dataProviders);

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
}
