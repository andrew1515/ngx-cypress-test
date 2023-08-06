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
