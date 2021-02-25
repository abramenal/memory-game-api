# architecture

## Overview on API approach

The entry point for the app is `index.ts` where all the necessary services and tools gets created/configured. All the underlying layers (routers, controllers, services, database) rely on abstractions - this ensures hign testability.

I have intentionally skipped `controllers` layer primarily because of the solution simplitity - there are only couple of routes, so having another abstraction layer indeed makes sense, but just needs more time to set up. This is why routers and controllers layers are merged into one. The good part of it is that it does not rely on service concrete implementations, but abstractions instead.

## Data validity

There are 2 layers that ensure data validity and consistency:

1. API layer validation, which prevents any unexpected input to be processed
2. Database constraints layer ensures data integrity and consistency

## Security

There was no point in creating a secure authentication layer for this task, so I decided just to keep track on the user's `username`. This unique user identified is used to store an entity in DB, and attach games history to it. Once the user comes back and enters same login, it will see all previous games and turns.

Since validating the game turn is "sensitive" (i.e. having this logic in FE means it is possible to fake it), we need to keep it as a part of BE's business logic layer.

The entry point for the API is `index.js` which does all the preparation

## Logging

Logging setup is minimal and is used only in couple of places, so it just gives an idea on how that should be. Having more complex business logic would require more excessive logging and monitoring, but for now I think it was just fine.
