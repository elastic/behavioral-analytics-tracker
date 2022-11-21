## Behavioral Analytics Tracker Mono Repo

This repository contains the source code for the Behavioral Analytics Tracker.

## Packages

### JavaScript Tracker

The JavaScript tracker is a library that allows you to track events from your web application. It is available as a [npm package](https://www.npmjs.com/package/@elastic/behavioral-analytics-javascript-tracker). You can find more information about the JavaScript tracker in the [README](packages/javascript-tracker/README.md).

### Browser Tracker

The Browser tracker is a library that allows you to embed the Behavioral Analytics tracker in your web application. It is as a script that you can include in your web application. You can find more information about the Browser tracker in the [README](packages/browser-tracker/README.md).

## Versioning & Publishing

All packages are versioned and published using changesets. For convenience, the following commands are available on the root:

- `yarn add-change`: Create a new changeset. Run every time you make a change to the packages. You will be prompted to select the packages that have changed and the type of change. A changeset file will be created in the `.changeset` folder. You can have multiple changesets in the same PR.
- `yarn version-packages`: Bump the version of the packages based on the changesets. Run before publishing.
- `yarn publish-packages`: Publish the packages to npm. Run after versioning.
