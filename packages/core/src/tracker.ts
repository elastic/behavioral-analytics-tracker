import { DEFAULT_DATA_PROVIDERS } from "./dataproviders";
import {
  TrackerEventType,
  DataProvider,
  TrackerOptions,
  EventProperties,
  SearchEventInputProperties,
  EventInputProperties,
  SearchClickEventInputProperties,
  PageViewInputProperties,
} from "./types";
import { UserSessionStore } from "./user_session_store";

export const processEvent = (
  action: TrackerEventType,
  event: EventInputProperties,
  dataProviders: Record<string, DataProvider>
) => {
  return Object.values(dataProviders).reduce<EventProperties>(
    (props, dataProvider) => {
      return dataProvider(action, props);
    },
    { ...event }
  ) as EventProperties;
};

export class Tracker {
  private dataProviders: Record<string, DataProvider>;
  private apiURL: string;
  private userSessionStore: UserSessionStore;
  private apiKey: string;
  private debug: boolean;

  constructor(options: TrackerOptions) {
    this.apiURL = `${options.endpoint}/_application/analytics/${options.collectionName}/event`;
    this.apiKey = options.apiKey;
    this.debug = options.debug || false;
    this.userSessionStore = new UserSessionStore({
      user: {
        token:
          typeof options.user?.token === "function"
            ? options.user.token()
            : options.user?.token,
        lifetime: options.user?.lifetime,
      },
      session: {
        lifetime: options.session?.lifetime,
      },
    });
    this.dataProviders = {
      ...DEFAULT_DATA_PROVIDERS,
      ...(options.dataProviders || {}),
    };
  }

  trackEvent(action: TrackerEventType, event: EventInputProperties) {
    this.userSessionStore.updateSessionExpire();

    const userSessionAttributes = this.getUserSession();

    const eventData = processEvent(
      action,
      {
        ...event,
        ...userSessionAttributes,
      },
      this.dataProviders
    );

    const encodedPayload = JSON.stringify(eventData);
    const queryString = this.debug ? "?debug=true" : "";
    const eventTrackerURL = `${this.apiURL}/${action}${queryString}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", eventTrackerURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Apikey ${this.apiKey}`);

    xhr.send(encodedPayload);
  }

  trackPageView(properties?: PageViewInputProperties) {
    this.trackEvent("page_view", properties || {});
  }

  trackSearchClick(properties: SearchClickEventInputProperties) {
    this.trackEvent("search_click", properties);
  }

  trackSearch(properties: SearchEventInputProperties) {
    this.trackEvent("search", properties);
  }

  private getUserSession() {
    return {
      user: {
        id: this.userSessionStore.getUserUuid(),
      },
      session: {
        id: this.userSessionStore.getSessionUuid(),
      },
    };
  }
}
