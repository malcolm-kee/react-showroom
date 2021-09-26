# react-showroom

<div style="text-align:center;">
    
![React Showroom](docs/assets/react-showroom.png)

</div>

[![npm version](https://badge.fury.io/js/react-showroom.svg)](https://badge.fury.io/js/react-showroom)

https://react-showroom.js.org/

Document React components by declaring props definition and writing markdown.

## Key Features

- Auto generate documentations for your component props from the component's TypeScript definition.
- Write markdown to show examples to use the component, which will become an editable playground.
- Ensure the components are SSR-friendly - the site can be pre-render on build time.

## Built With

- [Vite](https://vitejs.dev/)
- [esbuild](https://esbuild.github.io/)
- [react-docgen-typescript](https://www.npmjs.com/package/react-docgen-typescript)
- [Stitches](https://stitches.dev/)
- [Radix Primitives](https://www.radix-ui.com/)
- [xdm](https://github.com/wooorm/xdm)

## Inspired by

This project is largely inspired by [React Styleguidist](https://react-styleguidist.js.org/). To be honest this project is started as my plan to rewrite it to understand how it works.

## Philosophy

The philosophy of React Showroom is that you should be continuing your existing workflow (declaring component props/writing standard markdown) and the Showroom is just an automatic side product (hopefully a valuable one) of that workflow.

This is in contrast with [Storybook](https://storybook.js.org/) where it aims to be central part of your development workflow (and requires you to write examples/documentations in a special format).

We believe that compared to languages (TypeScript and markdown), libraries are generally short-lived and often less stable. Write your documentations in a more stable medium gives you more freedom and allows you to migrate to alternative tool in future.

## Roadmap

Following are the ideas that I want to implement as enhancements (but I not sure if they are possible):

- Run jest tests in the Showroom
- Vue support
