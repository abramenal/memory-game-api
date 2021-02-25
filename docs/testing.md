# testing

## Unit tests

I think there is only one of that type: `getRandomInt.test.ts`. If it would be possible to test service methods in isolation (meaning that we mock external calls to database, etc.) it would be nice to do that too.

## Integration tests

Simply saying, it is testing service methods + database calls. While we want to keep all business logic in code (and not database), for more complex solutions we might also need to test triggers, procedures and so on in _integration_ with business logic.

## E2E

I'm not a big fan of this approach, but we can have a small set of E2E tests to verify certain user flows. The good thing is - it gives you confidence that API is actually working, while none of the other types of tests can give you that. All the tiny pieces can work alone, but you want also to know if solution can actually start serving the traffic, and deliver expected functionality.

We might opt for different approaches here (like contract tests) depending on how complex the solution is, how much consumers do we have, how risky it is to break something, and so on.
