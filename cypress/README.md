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

It's not needed in the most cases, but in case of some CI environments we may need this. This is an unique ID for a particular CI run, which is provided automatically by most of the CI runners. It is needed for the `--parallel` and `--group` flags and this is the ID according to Cypress can group the tests from multiple `npx cypress run` commands (f.e. in case of parallelization - see below, or when we are grouping tests from multiple test runs, f.e. in the case when we are running a test run for every browser...in this case we have separate test runs, but we want it to look like one test run with multiple sub-groups for every browser).

### --parallel or running tests in parallel in CI

If we turn this on and our CI environment supports this (so it have multiple machines), the tests will run in parallel.

#### Do we need Cypress Dashboard for parallelization?

YES! The parallelization works as following:

1. Multiple `npx cypress run --parallel` commands will be started in the same CI run (so the `--ci-build-id` will be the same for all commands...they SHOULD be the same).

- Technically we can start also two commands in parallel without some deeper configuration of the CI, I think also Github Actions should support this, like: `npx cypress run --parallel & npx cypress run --parallel`. This will run those two commands simultaneously and I think the CI will assign the commands to different threads or machines either. But it may differ in every CI environment.

2. Because the `--parallel` flag, the machines in the CI run will contact Cypress Dashboard. The Dashboard then selects, which tests will a given machine run (basically a load balancing) and sends back the list of tests for each machine.

3. All the machines then starts to run their list of tests and reports them back to Cypress Dashboard. The Dashboard then collects all the test results and merges them into one report.

More info here: https://docs.cypress.io/guides/cloud/smart-orchestration/parallelization#CI-parallelization-interactions
An open-source and free alternative for Cypress Dashboard (mainly for parallelization): https://sorry-cypress.dev/
