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
    if (!options.endpoint || !options.collectionName || !options.apiKey) {
      throw new Error("Missing one  or more of required options: endpoint, collectionName, apiKey");
    }

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
      sampling: options.sampling,
    });
    this.dataProviders = {
      ...DEFAULT_DATA_PROVIDERS,
      ...(options.dataProviders || {}),
    };
  }

  trackEvent(action: TrackerEventType, event: EventInputProperties) {
    this.userSessionStore.updateSessionExpire();
    this.userSessionStore.updateSessionSampledExpire();

    if (!this.userSessionStore.isSessionSampled()) {
      return;
    }

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

    fetch(this.getEventTrackerURL(action), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${this.apiKey}`
      },
      body: encodedPayload
    }).then((response) => {
      if (!response.ok) {
        return response.json();
      }
    }).then(body => {
      const error = body?.error?.caused_by?.reason || body?.error?.reason;

      if (!!error) {
        throw new Error(error);
      }
    }).catch(error => {
      error.name = 'TrackEventError';
      console.error(error);
    });
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

  private getEventTrackerURL(action: TrackerEventType) {
    const queryString = this.debug ? "?debug=true" : "";

    return `${this.apiURL}/${action}${queryString}`;
  }
}
