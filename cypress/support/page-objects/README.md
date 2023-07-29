## The idea behind Page objects and why are they good

With Page objects we can organize our testing actions (like finding the DOM element with selectors, asserting, etc.) into class methods, where every class will represent a page of the application, like Form layouts page. (Or sometimes they can represent some other part of the app - like the navigation bar).

With this, our tests will be cleaner, more readable, they won't be bloated with the actual "cy" commands, but only with the class method calls. It also improves reusability.

See suite7.spec.ts for example tests.
