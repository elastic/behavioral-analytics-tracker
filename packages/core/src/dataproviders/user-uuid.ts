import { TrackerEventProperties, TrackerEventType } from "../types";
import { visitorId } from "../util/session";

export default (
  eventType: TrackerEventType,
  properties: TrackerEventProperties
) => {
  return { ...properties, user_uuid: visitorId() };
};
