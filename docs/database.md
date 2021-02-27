# database

For this type of requirements I feel almost any approach would work, honestly :neckbeard:

I have considered MongoDB and PostgreSQL, and the first one would be even a bit faster to do. But I would still go with the latter as this is your tech stack.

Here is [the initial data model design](https://dbdiagram.io/d/603abfecfcdcb6230b21ce01):

![](./db.png 'DB Scheme')

At the end it slightly changed [it slightly changed](https://dbdiagram.io/d/603566aefcdcb6230b2129f8):

![](./db_final.png 'DB Scheme (final)')

## Choosing proper toolset

I was somewhere in the middle between just picking an ORM library VS writing pure SQL. ORM would work perfectly fine here as there are no use cases where it'll be insufficient. However
I wasn't quite sure which setup you're using, so decided to go with `knex` query builder. While it obviously allows to use query builder methods, it also has quite simple setup for running seeds and migrations.

Later on I actually thought it was not that good ideas, as knex requires quite some helpers/boilerplate. E.g. mocking database is a real struggle there, `mock-knex` library is really poor. Then, I wanted to run test suite specific seed file (and drop it once whole suite is done), instead of seeding all the stuff globally. I have ended up adding/dropping some libraries around it, spent quite a while on that with no luck.
Also, knex might be really good once you've set up model's spine - eventually you need things like `upsert`, `findOne` and so on.
So at the end I would say knex was not the ideal option for that strict deadline - having more time would make it way more comfortable to set it up properly and make it easy to use

## Migrations & seeds

Made only 2 of those for demo purposes, but generally the setup is ready to be extended further at scale.
Seeds are primarily used for testing because of lack of proper toolset around knex, but still might be useful when running the app on other developers' machines.
