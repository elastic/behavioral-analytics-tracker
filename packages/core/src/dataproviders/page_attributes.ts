import { EventProperties, PageEventAttribute } from "../types";

export default (properties: EventProperties) => {
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
