# Some generic notes

## start-server-and-test

Let's say we need to create an NPM script, which will first start our app, then run the Cypress test suite. So we create something like this:

~~`"cypress:run": "npm start && npx cypress run"`~~

However in this case, the command line will not wait with the execution of `npx cypress run` until our app starts. This is not ideal, so we need to have an another solution.

Here comes the `start-server-and-test` package, which will solve this issue.

`"cypress:run": "start-server-and-test start http-get://localhost:4200 cypress:run"`

This will run the given commands in order:

1. First, it start the app with the `npm start` command
2. Then it will wait for theå app to be started (this will be achieved by waiting for the `localhost:4200` to be available and we need to wait for the GET endpoint to be available, so we will wait for the URL with that `http-get` protocol).
3. Then run the Cypress test suite

## Cypress Dashboard

In Cypress Dashboard we can all our previous test runs, we can share our results with teammates and it's even more useful if we are running our tests in a CI/CD environment, because we can report the results straight to the Cypress Dashboard from the CI runs.

### Initialization

We can connect our Cypress project with our Cypress Dashboard account through `npx cypress open` command and then after selecting the browser we can go to "Runs" in the side menu and here it is.

There will be a **projectId** and a **secret key** generated for our project - the projectId will be automatically added to our cypress.config.ts file, the secret key should be provided in our test run commands with the `--key` flag. Because it's a secret key, we shouldn't commit this key to our Git repo, so it shouldn't be in the `package.json` file. So we should use the `--key` flag only for local runs, in CI environments, on the other hand, we should use the `CYPRESS_RECORD_KEY` environment variable.

You can check the record key in the Cypress Dashboard.

### --record

Whether we want to record our test run to Cypress Dashboard.

### --group

It groups together multiple tests, so they will be arranged into groups in the Cypress Dashboard.

More info: https://docs.cypress.io/guides/guides/command-line#cypress-run-group-lt-name-gt

### --ci-build-id

It's not needed in the most cases, but in case of some CI environments we may need this. This is an unique ID for a particular CI run, which is provided automatically by most of the CI runners. It is needed for the `--parallel` and `--group` flags.

### --parallel or running tests in parallel in CI

If we turn this on and our CI environment supports this (so it have multiple machines), the tests will run in parallel.
