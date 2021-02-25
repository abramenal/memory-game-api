# memory-game-api

## Documentation

For more documentation around selected toolset, approach, testing, etc. see [docs](./docs) folder.

## Prerequisites

Running the application for development requires the following set of tools:

- `Node.js>=14.15`
- `npm`
- `docker`

If you only need to _run_ the solution, having `docker` is enough.

## Quick start

```bash
cp .env.example .env
source .env
docker-compose up
```

Alternatively, you can set up your local development environment:

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

## Seeding the data

Optionally, you might want to pre-seed some data to start with. In order to do that, run:

```bash
npm run db:seed
```

## Testing the application

```bash
cp .env.example .env.test
```

Then change the database name to something like `POSTGRES_DB=memorygame_test` and you are ready to go:

```bash
npm run test:coverage

## or, w/o coverage
npm test
```
