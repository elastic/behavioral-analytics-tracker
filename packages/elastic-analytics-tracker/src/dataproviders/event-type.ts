import { AnalyticsEventPayload, AnalyticsEventType } from "../types";

export default (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload
) => {
  return { ...payload, event_type: eventType };
};
