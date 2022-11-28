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

export type TrackerUserTokenProperties = {
  userToken?: string | (() => string);
  userTokenExpirationDate?: number;
}

export type TrackerOptions = {
  dsn: string;
  dataProviders?: Record<string, DataProvider>;
} & TrackerUserTokenProperties;

export interface UserSessionOptions {
  userToken?: string;
  userTokenExpirationInterval?: number;
}
