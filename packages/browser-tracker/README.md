# Browser Tracker

This package provides a tracker for the browser. Instructions for integrating the browser tracker into your site can be found in the Behavioural Analytics Collection view, under the integrate tab.

## Usage

Once you have integrated the tracker into your site, you can access the instance of tracker under the `window.elasticAnalytics` object.

You must call the `createTracker` method before you can use the tracker.

```js
window.elasticAnalytics.createTracker();
```

## Token Fingerprints

When `createTracker` is called, the tracker will store two fingerprints in the browser cookie:

- User Token - a unique identifier for the user. Stored under `EA_UID` cookie. Default Time length is 24 hours from the first time the user visits the site.
- Session Token - a unique identifier for the session. Stored under `EA_SID` cookie. Time length is 30 minutes from the last time the user visits the site.

These fingerprints are used to identify the user across sessions.

### Changing the User Token and time length

You can change the User Token and time length by passing in the `userToken` and `userTokenTimeLength` parameters to the `createTracker` method.

```js
window.elasticAnalytics.createTracker({
  userToken: () => "my-user-token",
  userTokenExpirationDate: 24 * 60 * 60 * 1000, // 24 hours
});
```

## Methods

### createTracker

Creates a tracker instance. This method must be called before you can use the tracker.

```ts
createTracker(
  options: TrackerOptions = {}
)
```

| Name    | Type           | Description                  |
| ------- | -------------- | ---------------------------- |
| options | TrackerOptions | The options for the tracker. |

### trackEvent

Tracks an event.

```ts
trackEvent(
  eventType: TrackerEventType,
  properties: TrackerEventProperties = {}
)
```

#### Example

```javascript
trackEvent("click", {
  category: "product",
  action: "add_to_cart",
  label: "product_id",
  value: "123",
});
```

### Parameters

| Name       | Type                   | Description                  |
| ---------- | ---------------------- | ---------------------------- |
| eventType  | TrackerEventType       | The type of event to track.  |
| properties | TrackerEventProperties | The properties of the event. |

### trackPageView

Tracks a page view.

```ts
trackPageView(
  properties: TrackerEventProperties = {}
)
```

| Name       | Type                   | Description                  |
| ---------- | ---------------------- | ---------------------------- |
| properties | TrackerEventProperties | The properties of the event. |

## Types

### TrackerEventType

Enum value for the type of event to track. Can be one of "search", "click", "pageview" values.

### TrackerOptions

Options for the tracker.

| Name                    | Type                   | Description                                         |
| ----------------------- | ---------------------- | --------------------------------------------------- |
| userToken               | () => string \| string | A string or a function that returns the user token. |
| userTokenExpirationDate | number                 | The expiration date of the user token.              |
