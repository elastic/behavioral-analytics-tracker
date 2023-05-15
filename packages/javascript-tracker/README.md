## Javascript Tracker

### Installation

You can install the tracker using npm or yarn:

```bash
yarn add @elastic/behavioral-analytics-javascript-tracker
## OR
npm install @elastic/behavioral-analytics-javascript-tracker
```

## Usage

Import the tracker in your application.

```javascript
import {
  createTracker,
  trackPageView,
  trackSearch,
  trackSearchClick,
} from "@elastic/behavioral-analytics-javascript-tracker";
```

### Initialize tracker

use `createTracker` method to initialize the tracker with your DSN. You can find your DSN in the behavioral Analytics UI under Collection > Integrate. You will then be able to use the tracker to send events to behavioral Analytics.

```javascript
import {
  createTracker,
  trackPageView,
  trackEvent,
} from "@elastic/behavioral-analytics-javascript-tracker";

createTracker({
  endpoint: "https://my-endpoint-url",
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

You can also change the lifetime of the session token by passing in the `session.lifetime` parameter to the `createTracker` method.

```js
createTracker({
  user: {
    token: () => "my-user-token", // can be a string too
    lifetime: 24 * 60 * 60 * 1000, // 24 hours
  },
  session: {
    lifetime: 30 * 60 * 1000, // 30 minutes
  },
  }
});
```

### Introducing sampling

You don't always want all sessions to be sent to your Elastic cluster. You can introduce session-based sampling by adding `sampling` parameter to the `createTracker` method.

If sampling is set to 1 (default), all sessions will send events. If sampling is set to 0, no sessions will send events.

```js
createTracker({
  // ... tracker settings
  sampling: 0.3, // 30% of sessions will send events to the server
});
```

### Integration with Search UI (TODO)

If you use [Search UI](github.com/elastic/search-ui), you can use the `AnalyticsPlugin` hook to automatically track search events. You can find more information about the `AnalyticsPlugin` [here](github.com/elastic/search-ui/blob/master/packages/search-analytics-plugin/README.md).

```javascript
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";
import { getTracker } from "@elastic/behavioral-analytics-javascript-tracker";

const searchUIConfig = {
  ...
  plugins: [AnalyticsPlugin({
    client: getTracker()
  })],
  ...
}
```

### Dispatch Page View Events

You can then use the tracker to track page views.

```javascript
// track a page view

const SearchPage = (props) => {
  useEffect(() => {
    trackPageView({
      // optional
      document: {
        id: "search-page",
        index: "pages",
      },
    });
  }, []);

  return (
    <div>
      <h1>Search Page</h1>
    </div>
  );
};
```

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
trackSearch({
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
import { trackSearchClick } from "@elastic/behavioral-analytics-javascript-tracker";

trackSearchClick({
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

## Common Issues

### When I try to dispatch an event, I get the following error: `behavioral Analytics: Tracker not initialized.`

This means that the tracker has not been initialized. You need to initialize the tracker before you can dispatch events. You can do this by calling the `createTracker` method.

## API Methods

### `createTracker`

Initializes the tracker with the given configuration. This method must be called before you can use the tracker.

```javascript
import { createTracker } from "@elastic/behavioral-analytics-javascript-tracker";

createTracker({
  endpoint: "https://my-analytics-dsn.elastic.co",
  collectionName: "website",
  apiKey: "<api-key>",
});
```

#### Example

```javascript
createTracker({});
```

#### Parameters

| Name    | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| options | TrackerOptions | The options for the tracker. |

#### TrackerOptions

Options for the tracker.

| Name           | Type                   | Description                                                                                                      |
| -------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| user.token     | () => string \| string | A string or a function that returns the user token.                                                              |
| user.lifetime  | number                 | The expiration date of the user token.                                                                           |
| endpoint       | string                 | The endpoint for events. You can find your endpoint in the behavioral Analytics UI under Collection > Integrate. |
| collectionName | string                 | You can find your collection name in the behavioral Analytics UI under Collection > Integrate.                   |
| apiKey         | string                 | The apiKey for endpoint. You can find in the behavioral Analytics UI under Collection > Integrate.               |

### `trackPageView`

Tracks a page view event.

```javascript
trackPageView();
```

#### Example

```javascript
import { trackPageView } from "@elastic/behavioral-analytics-javascript-tracker";

trackPageView({
  document: {
    id: "123",
    index: "products",
  },
});
```

#### Parameters

| Name       | Type                    | Description                  |
| ---------- | ----------------------- | ---------------------------- |
| properties | PageViewInputProperties | The properties of the event. |

### `trackSearch`

Tracks a custom event.

```ts
trackSearch(
  properties: SearchEventInputProperties
)
```

#### Example

```javascript
import { trackSearch } from "@elastic/behavioral-analytics-javascript-tracker";

trackSearch({
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

### `trackSearchClick`

Tracks a click thats related to a search event. Example of usage is when a user clicks on a result that came from a search query.

Must have either a `document` or `page` property. Optimally both.

```ts
trackSearchClick(
  properties: SearchClickEventInputProperties
)
```

#### Example

```javascript
import { trackSearchClick } from "@elastic/behavioral-analytics-javascript-tracker";

trackSearchClick({
  document: {
    id: "123",
    index: "products",
  },
  page: {
    url: "http://my-website.com/products/123",
    title: "My Product",
  },
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

#### Parameters

| Name       | Type                            | Description                  |
| ---------- | ------------------------------- | ---------------------------- |
| properties | SearchClickEventInputProperties | The properties of the event. |

### `getTracker`

Returns the tracker instance. Useful when used to integrate with Search UI Analytics Plugin.

```javascript
import { getTracker } from "@elastic/behavioral-analytics-javascript-tracker";

const tracker = getTracker();
```
