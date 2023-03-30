import {
  EventProperties,
  PageEventAttribute,
  TrackerEventType,
} from "../types";

export default (_: TrackerEventType, properties: EventProperties) => {
  const referrer = document.referrer || "";

  return {
    ...properties,
    page: {
      ...(properties.page || {}),
      referrer: referrer,
      url: window.location.href,
      title: document.title,
    } as PageEventAttribute,
  };
};
