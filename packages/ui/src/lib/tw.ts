const prefix = '_sr-';

/**
 * Prepend `'_sr-'` to class names and merge them
 */
export const tw = (
  classes: Array<string | boolean | undefined | null>,
  plainClasses?: Array<string | boolean | undefined | null>
) => {
  const used: Array<string> = [];

  classes.forEach((c) => {
    if (c && typeof c === 'string') {
      if (c.indexOf(' ') > -1) {
        used.push(tw(c.split(' ')));
      } else {
        used.push(prefix + c);
      }
    }
  });

  if (Array.isArray(plainClasses)) {
    plainClasses.forEach((c) => {
      if (c && typeof c === 'string') {
        used.push(c);
      }
    });
  }

  return used.join(' ');
};
