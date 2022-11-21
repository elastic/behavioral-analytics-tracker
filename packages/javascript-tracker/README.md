## Javascript Tracker

### Installation

You can install the tracker using npm or yarn:

```bash
yarn add @elastic/behavioural-analytics-javascript-tracker
npm install @elastic/behavioural-analytics-javascript-tracker
```

## Usage

### Import tracker

Import the tracker in your application.

```javascript
import {
  createTracker,
  trackPageView,
  trackEvent,
} from "@elastic/behavioural-analytics-javascript-tracker";
```

### Initialise tracker

use `createTracker` method to initialize the tracker with your DSN. You can find your DSN in the Behavioural Analytics UI under Collection > Integrate. You will then be able to use the tracker to send events to Behavioural Analytics.

```javascript
import {
  createTracker,
  trackPageView,
  trackEvent,
} from "@elastic/behavioural-analytics-javascript-tracker";

createTracker({
  dsn: "https://my-analytics-dsn.elastic.co",
});
```

### Integration with Search UI

If you use [Search UI](github.com/elastic/search-ui), you can use the `AnalyticsPlugin` hook to automatically track search events. You can find more information about the `AnalyticsPlugin` [here](github.com/elastic/search-ui/blob/master/packages/search-analytics-plugin/README.md).

```javascript
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";
import { getTracker } from "@elastic/behavioural-analytics-javascript-tracker";

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
    trackPageView();
  }, []);

  return (
    <div>
      <h1>Search Page</h1>
    </div>
  );
};
```

### Dispatch Custom Events

You can also dispatch custom events .

```javascript
// track a page view
import { trackEvent } from '@elastic/behavioural-analytics-javascript-tracker';

const ProductDetailPage = (props) => {

  return (
    <div>
      <h1>Product detail page</h1>
      <input type="button" onClick={() => {
        trackEvent("click", {
          category: "product",
          action: "add_to_cart",
          label: "product_id",
          value: "123"
        })
      }} />
      }}>Add to Basket</input>
    </div>
  )
}

```

## Common Issues

### When I try to dispatch an event, I get the following error: `Behavioural Analytics: Tracker not initialized.`

This means that the tracker has not been initialized. You need to initialize the tracker before you can dispatch events. You can do this by calling the `createTracker` method.

## API Methods

### `createTracker`

Initializes the tracker with the given DSN.

```javascript
createTracker({
  dsn: "https://my-analytics-dsn.elastic.co",
});
```

#### Options

**_ dsn _**: The DSN of your Behavioural Analytics project. You can find your DSN in the Behavioural Analytics UI under Collection > Integrate.

### `trackPageView`

Tracks a page view event.

```javascript
trackPageView();
```

### `trackEvent`

Tracks a custom event.

```javascript
trackEvent("click", {
  category: "product",
  action: "add_to_cart",
  label: "product_id",
  value: "123",
});
```

#### Options

**_ event type _**: The type of event you want to track. This can be either `click`, `pageview` or `search`.
**_ event properties _**: The properties of the event you want to track. These properties are specific to the event type.

### `getTracker`

Returns the tracker instance. Useful when used to integrate with Search UI Analytics Plugin.

```javascript
const tracker = getTracker();
```