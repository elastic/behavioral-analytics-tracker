import { TrackerEventProperties, TrackerEventType } from "../types";

export default (
  eventType: TrackerEventType,
  properties: TrackerEventProperties
) => {
  if (eventType !== "pageview" || !document.referrer) {
    return properties;
  }

  return { ...properties, referrer: document.referrer };
};
