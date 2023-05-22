import { EventProperties, PageEventAttribute, TrackerEventType } from "../types";

export default (eventType: TrackerEventType, properties: EventProperties) => {
  const referrer = document.referrer || "";

  if (eventType === "page_view") {
    return {
      ...properties,
      page: {
        ...(properties.page || {}),
        referrer: referrer,
        url: window.location.href,
        title: document.title,
      } as PageEventAttribute,
    };
  }
  return properties;
};
