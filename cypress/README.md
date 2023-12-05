# Some generic notes

## start-server-and-test

Let's say we need to create an NPM script, which will first start our app, then run the Cypress test suite. So we create something like this:

~~`"cypress:run": "npm start && npx cypress run"`~~

However in this case, the command line will not wait with the execution of `npx cypress run` until our app starts. This is not ideal, so we need to have an another solution. (**Note:** it will wait until the execution of the `npm start` command finishes, it will just not wait for the app to be completely loaded and available on the `http://localhost:4200` address.)

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

## Implicit vs explicit assertions

**Implicit:** commands like `cy.get()` or `cy.contains()`. If these commands won't found the queried element, the whole test will fail. But we call these commands mainly because we want to get a given element, with which we want to do some other things...not just because assertion. But Cypress won't allow to run the test, if these commands won't found any elements.

**Explicit:** if we call commands like `.should()`. In this case we are explicitly asserting, whether some criteria are matching or not. So f.e. `.should('contain', 'abcde')` will assert, whether the given element (what we could get with `cy.get()` or `cy.contains()` for example) is containing the text 'abcde'. That's the only job of the `.should()` method - it isn't querying any elements or doing anything else.

## Bad vs Good assertions

**Bad:**

```js
it("BAD - should open and close the task modal", () => {
  cy.visit("/");
  cy.contains("All Tasks").click();
  cy.get(".backdrop").click({ force: true });
});
```

Why is this bad? Because we don't make any checks after clicking on backdrop, whether it's really closed. We just simply click on it and that's all.

**Good:**

```js
it("GOOD - should open and close the task modal", () => {
  cy.visit("/");
  cy.contains("All Tasks").click();
  cy.get(".backdrop").click({ force: true });

  cy.get(".backdrop").should("not.exist");
  cy.get(".modal").should("not.exist");
});
```

Now we have concrete assertions, so our test will fail if the backdrop and the modal will exist after we clicked on the backdrop.

## Isolated test runs

Cypress runs every test in isolation, so it loads the app completely from scratch for every test. That means, no app state, but even no browser (local, session) storage data are persisted between the tests, we need to do everything from scratch on every test. Cypress doesn't even navigate to the main page of the app at the start of the test, it just opens a blank page, navigating to the main page (like the '/' route) is our responsibility.

It is actually a good thing, because persisting data between tests can lead to unexpected and hard-to-track behavior and the tests wouldn't be independent from each other.

### Isolated test runs and databases

If our test runs are isolated, it would be good also to have isolated data storages. It means, it would be good to have a clean, untouched database for every test. Of course, it's not needed if our app doesn't write the DB, but in case it does, it is an essential requirement - at least for the tables which are written. So it's a good practice to create for example a Cypress task (where we can execute NodeJS code), which will clear and seed our DB before every test run. As I said, we don't have to do this for every table, just for tables which are written, because otherwise our tests would take very long just because the (unneccessary) data seeding.

So maybe you can consider to run an initial seeding in the `before` hook in the `e2e.ts` file to seed the tables which won't be changed during the test runs (or just have the initial DB prepared before Cypress starts) and then do the seeding for selected tables in `beforeEach` hooks inside the `describe` blocks, which contain tests with database writes.

## The RECOMMENDED way to use selectors

The best way is to use a dedicated `data-*` HTML attribute for Cypress selectors. Selecting by class names, IDs and so on is not safe, because these can be changed in the application (f.e. renaming a class) and our tests will stop working. If we use a dedicated attribute, these attributes will be used only in Cypress tests, so there is no reason to change them just like that.

## Simulating special key presses

If we use the `.type()` command, we can do the following:

`.type("andras15@gmail.com{enter}")`

This way we simulate typing the email address into the particular input and then pressing the Enter key at the end.

## Using `.then()` with callback vs `.should()` with callback

https://docs.cypress.io/api/commands/should#Differences

So use `.then()` when you do any side effects inside the callback - f.e. clicking on some button, adding something to local storage, etc. But use `.should()` if you just want to group your assertions together, so there is nothing else, just assertions in the callback.

### What if we need to do side effects and assertions too?

In that case it's preferred to either use `cy.wrap()` and call the `.should()` method on it or do the side effects in the `.then()` method and then chain an another `.should()` method after it which will hold the assertions.

### What's the difference?

`.should()` will rerun several times until it times out. This is, however, not true for `.then()` callbacks, they are running only once. So it's important to don't put such code into `.should()` callback, which we don't want to run twice.

**Note:** In the test code we always use `.then()` even if in most cases `.should()` would be more suitable, because the first course I took doesn't mentioned the `.should()` method with callback.

## Timeouts

In `cypress.config.ts` you can set up various timeouts like for executing a cypress command, HTTP response timeout, etc. But you can also override the configs in the `describe` and `it` blocks if you want (so for a test suite or a concrete test). For more info see `suite8.spec.ts`.

## Cypress Session

Persisting web storages (local and session storages) and cookies across multiple tests. More info:

https://www.cypress.io/blog/2021/08/04/authenticate-faster-in-tests-cy-session-command
https://docs.cypress.io/api/commands/session

## Persisting data using Cypress.env()

https://adityanaik.dev/blog/2021/04/24/cypress-how-to-handle-auth-jwt-using-env-and-commands/

## Other interesting Cypress commands

### `cy.location`

Gets the current location, which we then can assert. Example:

```js
cy.location("pathname").should("eq", "/about");
```

### `cy.go`

Navigate back or forward to the previous or next URL in the browser's history.

```js
cy.go("back");
```

### `cy.screenshot`

Take a screenshot during the test

### `before` and `after` hooks

If we have it inside a `describe` block, the code inside the `before` block will run only once before the tests start to run. If we have it in the `support/e2e.ts`, then this will run only once before the tests start to run at all.

The same goes for the `after` hook, it just will happen after the tests.

### `.should()` returning different subject

https://docs.cypress.io/api/commands/should#Yields
