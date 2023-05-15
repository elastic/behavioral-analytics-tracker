# Browser Tracker

This package provides a tracker for the browser. Instructions for integrating the browser tracker into your site can be found in the Behavioural Analytics Collection view, under the integrate tab.

## Usage

Once you have integrated the tracker into your site, you can access the instance of tracker under the `window.elasticAnalytics` object.

You must call the `createTracker` method before you can use the tracker.

```js
window.elasticAnalytics.createTracker({
  endpoint: "https://my-analytics-dsn.elastic.co",
  collectionName: "website",
  apiKey: "<api-key>",
});
```

## Token Fingerprints

When `createTracker` is called, the tracker will store two fingerprints in the browser cookie:

- User Token - a unique identifier for the user. Stored under `EA_UID` cookie. Default Time length is 24 hours from the first time the user visits the site.
- Session Token - a unique identifier for the session. Stored under `EA_SID` cookie. Time length is 30 minutes from the last time the user visits the site.

These fingerprints are used to identify the user across sessions.

### Changing the User Token and time length

You can change the User Token and time length by passing in the `token` and `lifetime` parameters to the `createTracker` method.

```js
window.elasticAnalytics.createTracker({
  user: {
    token: () => "my-user-token",
    lifetime: 24 * 60 * 60 * 1000, // 24 hours
  },
  session: {
    lifetime: 30 * 60 * 1000, // 30 minutes
  },
});
```

### Introducing sampling

You don't always want all sessions to be sent to your Elastic cluster. You can introduce session-based sampling by adding `sampling` parameter to the `createTracker` method.

If sampling is set to 1 (default), all sessions will send events. If sampling is set to 0, no sessions will send events.

```js
window.elasticAnalytics.createTracker({
  // ... tracker settings
  sampling: 0.3, // 30% of sessions will send events to the server
});
```

## Methods

### `createTracker`

Creates a tracker instance. This method must be called before you can use the tracker.

```javascript
createTracker(((options: TrackerOptions) = {}));
```

#### Example

```javascript
window.elasticAnalytics.createTracker({
  endpoint: "https://my-analytics-dsn.elastic.co",
  collectionName: "website",
  apiKey: "<api-key>",
  user: {
    token: () => "my-user-token",
    lifetime: 24 * 60 * 60 * 1000, // 24 hours
  },
  session: {
    lifetime: 30 * 60 * 1000, // 30 minutes
  },
});
```

#### Parameters

| Name    | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| options | TrackerOptions | The options for the tracker. |

### Dispatch Search Events

These events are used to track the user's search behavior. You can dispatch these events by calling the `trackSearch` method.

Below is an example of how you can dispatch a search event when a user searches for a query, for a hypothetical search API.

```typescript
import { trackSearch } from "@elastic/behavioral-analytics-javascript-tracker";

const getSearchResults = async (query: string) => {
  const results = await api.getSearchResults(query);
  trackSearch({
    search: {
      query: query,
      results: {
        // optional
        items: [],
        total_results: results.totalResults,
      },
    },
  });
};
```

A full list of properties that can be passed to the `trackSearch` method below:

```javascript
window.elasticAnalytics.trackSearch({
  search: {
    query: "laptop",
    filters: [
      // optional
      { field: "brand", value: ["apple"] },
    ],
    page: {
      //optional
      current: 1,
      size: 10,
    },
    results: {
      // optional
      items: [
        {
          document: {
            id: "123",
            index: "products",
          },
          page: {
            url: "http://my-website.com/products/123",
          },
        },
      ],
      total_results: 100,
    },
    sort: {
      name: "relevance",
    },
    search_application: "website",
  },
});
```

### Dispatch Search Click Events

These events are used to track the user's search click behavior. Think of these events to track what the user is clicking on after they have performed a search. You can dispatch these events by calling the `trackSearchClick` method.

Below is an example of how you can dispatch a search click event when a user clicks on a search result, for a hypothetical search API.

```typescript
window.elasticAnalytics.trackSearchClick({
  // document that they clicked on
  document: { id: "123", index: "products" },
  // the query and results that they used to find this document
  search: {
    query: "laptop",
    filters: [
      { field: "brand", value: ["apple"] },
      { field: "price", value: ["1000-2000"] },
    ],
    page: {
      current: 1,
      size: 10,
    },
    results: {
      items: [
        {
          document: {
            id: "123",
            index: "products",
          },
          page: {
            url: "http://my-website.com/products/123",
          },
        },
      ],
      total_results: 100,
    },
    sort: {
      name: "relevance",
    },
    search_application: "website",
  },
});
```

## Types

### TrackerEventType

Enum value for the type of event to track. Can be one of "search", "click", "pageview" values.

### TrackerOptions

Options for the tracker.

| Name                    | Type                   | Description                                         |
| ----------------------- | ---------------------- | --------------------------------------------------- |
| userToken               | () => string \| string | A string or a function that returns the user token. |
| userTokenExpirationDate | number                 | The expiration date of the user token.              |
