## Behavioral Analytics Tracker Mono Repo

This repository contains the source code for the Behavioral Analytics Tracker.

## Packages

### JavaScript Tracker

The JavaScript tracker is a library that allows you to track events from your web application. It is available as a [npm package](https://www.npmjs.com/package/@elastic/behavioral-analytics-javascript-tracker).

You can find more information about the JavaScript tracker in the [README](packages/javascript-tracker/README.md).

### Browser Tracker

The Browser tracker is a library that allows you to embed the Behavioral Analytics tracker in your web application. It is as a script that you can include in your web application.

You can find more information about the Browser tracker in the [README](packages/browser-tracker/README.md).

## Versioning & Publishing

All packages are versioned and published using changesets. For convenience, the following commands are available on the root:

- `yarn add-change`: Create a new changeset. Run every time you make a change to the packages. You will be prompted to select the packages that have changed and the type of change. A changeset file will be created in the `.changeset` folder. You can have multiple changesets in the same PR.
- `yarn version-packages`: Bump the version of the packages based on the changesets. Run before publishing.
- `yarn publish-packages`: Publish the packages to npm. Run after versioning.

## Development

All packages have unit tests. To run the tests, run the following command on the root of the repository:

```bash
yarn test
```

This will run the tests for all packages.

### Integration tests

We have cypress tests for the repository and a small test app. Follow the instructions in the [README](apps/sandbox/README.md) to run the tests. You must run the `yarn deploy` script in the `packages/browser-tracker` directory to copy the distribution to the test app.

## Updating the distribution

The `browser-tracker` is distributed as a script that is part of the ent-search distribution. When the `browser-tracker` is updated, the distribution needs to be updated as well. To do so, run the following command:

```bash
make deploy ent_search_dir=<path-to-ent-search>
```
