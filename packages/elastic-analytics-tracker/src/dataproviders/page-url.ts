import { AnalyticsEventPayload, AnalyticsEventType } from "../types";

export default (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload
) => {
  if (eventType !== "pageview") {
    return payload;
  }

  return { ...payload, url: window.location.href };
};
