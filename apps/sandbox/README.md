# Sandbox App

For integration tests. Tests are done within cypress.

## Running the tests locally

0. Deploy the browser tracker code by `yarn deploy`
1. `cd apps/sandbox`
2. `yarn start`
3. in another terminal, run `yarn e2e`

This will start the CRA app and also run cypress against the CRA app.
