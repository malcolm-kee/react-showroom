export const codeblocks = <Name extends string = 'codeblocks'>(
  tree: any,
  {
    lang = 'all',
    name = 'codeblocks' as Name,
    formatter = (v) => v,
  }: {
    name?: Name;
    lang?: string;
    formatter?: (v: string) => string;
  } = {}
): {
  [Key in Name]: Record<string, Array<string>>;
} => {
  const { children } = tree;
  const data = {
    [name]: {},
  };
  let i = -1;
  let child;

  while (++i < children.length) {
    child = children[i];

    if (child.type === 'code' && child.value && child.meta !== 'static') {
      if (lang === 'all') {
        child.lang = child.lang || '_';
        // @ts-ignore
        data[name][child.lang] = data[name][child.lang] || [];
        // @ts-ignore
        data[name][child.lang].push(formatter(child.value));
      } else {
        if (child.lang === lang) {
          // @ts-ignore
          data[name].push(formatter(child.value));
        }
      }
    }
  }

  // @ts-ignore
  return data;
};
