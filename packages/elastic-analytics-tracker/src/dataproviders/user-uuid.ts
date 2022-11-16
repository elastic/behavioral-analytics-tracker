import { AnalyticsEventPayload, AnalyticsEventType } from "../types";
import { visitorId } from "../util/session";

export default (
  eventType: AnalyticsEventType,
  payload: AnalyticsEventPayload
) => {
  return { ...payload, user_uuid: visitorId() };
};
