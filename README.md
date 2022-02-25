# Calatrava

Calatrava is a wrapper around Architect that adds boilerplate and packages to allow developers to spin up AWS Lambda powered APIs quickly and easily.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org) app
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `@calatrava/middleware`: Route middleware to reduce repetition from common tasks such as token handling or request validation
- `@calatrava/cli`: The main package that handles encapsulating functionality from several of the packages in this repo.
- `@calatrava/boilerplate`: A template used to initialize a new project.
- `@calatrava/scaffold`: Utilities for creating request validation and openapi.yaml schema
- `@calatrava/arc-utils`: Utilities for making the app.arc and preferences.arc files more manageable
- `@calatrava/email`: Wrappers around handling MJML templates for various email providers

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

### Build

To build all apps and packages, run the following command:

```
cd calatrava
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd calatrava
pnpm run dev
```

## License

Copyright 2022 cmgriffing

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
