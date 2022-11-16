export type AnalyticsEventPayload = Record<string, unknown>;

export type AnalyticsEvent = {
  event_type: AnalyticsEventType;
  user_uuid: string;
} & AnalyticsEventPayload;
export type DataProvider = (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload
) => AnalyticsEventPayload;
export type AnalyticsEventType = "pageview" | "search";
