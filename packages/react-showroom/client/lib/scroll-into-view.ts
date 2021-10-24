export const getScrollFn = () =>
  import(
    /* webpackChunkName: "scrollIntoView" */ 'scroll-into-view-if-needed'
  ).then((scroll) => scroll.default);
