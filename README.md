# react-showroom

https://react-showroom.netlify.app/

Document React components by declaring props definition and writing markdown.

## Key Features

- Auto generate documentations for your component props from the component's TypeScript definition.
- Write markdown to show examples to use the component, which will become an editable playground.
- Ensure the components are SSR-friendly - the site can be pre-render on build time.

## Built With

- [esbuild](https://esbuild.github.io/)
- [react-docgen-typescript](https://www.npmjs.com/package/react-docgen-typescript)
- [Stitches](https://stitches.dev/)
- [Radix Primitives](https://www.radix-ui.com/)
- [xdm](https://github.com/wooorm/xdm)
- [webpack](https://webpack.js.org/)

## Inspired by

This project is largely inspired by [React Styleguidist](https://react-styleguidist.js.org/). To be honest this project is started as my plan to rewrite it to understand how it works.

## Philosophy

The philosophy of React Showroom is that you should be continuing your existing workflow (declaring component props/writing standard markdown) and the Showroom is just an automatic side product (hopefully a valuable one) of that workflow.

This is in contrast with [Storybook](https://storybook.js.org/) where it aims to be central part of your development workflow (and requires you to write examples/documentations in a special format).

We believe that compared to languages (TypeScript and markdown), libraries are generally short-lived and often less stable. Write your documentations in a more stable medium gives you more freedom and allows you to migrate to alternative tool in future.

## Roadmap

Following are the scopes that I want to implement before making this library as 1.0:

- NodeJS API: Allowing to require this package in your NodeJS script and invoke it.
- E2E Smoke Tests: Add some basic cypress tests to verify the examples are working fine, especially for SSR

Following are the ideas that I want to implement as enhancements (but I not sure if they are possible):

- Run jest tests in the Showroom
- Vue support
- Rollup support
- Vite support
