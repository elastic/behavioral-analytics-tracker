import { AnalyticsEventPayload, AnalyticsEventType } from "../types";

export default (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload
) => {
  if (eventType !== "pageview" || !document.referrer) {
    return payload;
  }

  return { ...payload, referrer: document.referrer };
};
