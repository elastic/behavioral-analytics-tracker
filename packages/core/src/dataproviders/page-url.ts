import { TrackerEventProperties, TrackerEventType } from "../types";

export default (
  eventType: TrackerEventType,
  properties: TrackerEventProperties
) => {
  if (eventType !== "pageview") {
    return properties;
  }

  return { ...properties, url: window.location.href };
};
