import { TrackerEventProperties, TrackerEventType } from "../types";

export default (
  eventType: TrackerEventType,
  properties: TrackerEventProperties
) => {
  return { ...properties, event_type: eventType };
};
