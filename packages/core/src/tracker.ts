import { DEFAULT_DATA_PROVIDERS } from "./dataproviders";
import {
  TrackerEvent,
  TrackerEventProperties,
  TrackerEventType,
  DataProvider,
  TrackerOptions,
} from "./types";
import { UserSessionStore } from "./userSessionStore"

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
  private userSessionStore: UserSessionStore;

  constructor(options: TrackerOptions) {
    this.endpointURL = options.dsn;
    this.userSessionStore = new UserSessionStore({
      userToken: typeof(options.userToken) === "function" ? options.userToken() : options.userToken,
      userTokenExpirationInterval: options.userTokenExpirationDate
    })
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

    const encodedPayload = JSON.stringify(
      this.enrichEventWithSession(eventData)
    );
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

  private enrichEventWithSession(eventData: TrackerEvent) {
    this.userSessionStore.updateSessionExpire();

    return {
      ...eventData,
      user_uuid: this.userSessionStore.getUserUuid(),
      session_uuid: this.userSessionStore.getSessionUuid()
    };
  }
}
