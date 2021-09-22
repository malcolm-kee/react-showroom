export const isPrerender = process.env.PRERENDER;

export const isSpa = !isPrerender;
