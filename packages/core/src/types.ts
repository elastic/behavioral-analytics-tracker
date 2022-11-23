export type TrackerEventProperties = Record<string, unknown>;

export type TrackerEvent = {
  event_type: TrackerEventType;
  user_uuid: string;
} & TrackerEventProperties;
export type DataProvider = (
  eventType: TrackerEventType,
  payload: TrackerEventProperties
) => TrackerEventProperties;
export type TrackerEventType = "pageview" | "search" | "click";

export interface TrackerOptions {
  dsn: string;
  dataProviders?: Record<string, DataProvider>;
  userToken?: string | (() => string);
  userTokenExpirationDate?: number;
}

export interface UserSessionOptions {
  userToken?: string;
  userTokenExpirationInterval?: number;
}
