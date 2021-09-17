import type { Parent, Code } from 'mdast';

const all = 'all';

export type AllLangResult<Name extends string> = {
  [Key in Name]: Record<string, Array<string>>;
};

export type SingleLangResult<Name extends string> = {
  [Key in Name]: Array<string>;
};

export const codeblocks = <
  Name extends string = 'codeblocks',
  Lang extends string = 'all'
>(
  tree: Parent,
  {
    lang = all as Lang,
    name = 'codeblocks' as Name,
    formatter = (v) => v,
    filter = () => true,
  }: {
    name?: Name;
    lang?: Lang;
    formatter?: (v: string) => string;
    filter?: (child: Code) => boolean;
  } = {}
): Lang extends 'all' ? AllLangResult<Name> : SingleLangResult<Name> => {
  const { children } = tree;
  const result =
    lang === all
      ? ({
          [name]: {},
        } as AllLangResult<Name>)
      : ({
          [name]: [] as Array<string>,
        } as SingleLangResult<Name>);
  let i = -1;

  while (++i < children.length) {
    const child = children[i];

    if (child.type === 'code' && child.value && filter(child)) {
      if (lang === 'all') {
        child.lang = child.lang || '_';
        // @ts-ignore
        result[name][child.lang] = result[name][child.lang] || [];
        // @ts-ignore
        result[name][child.lang].push(formatter(child.value));
      } else {
        if (child.lang === lang) {
          // @ts-ignore
          result[name].push(formatter(child.value));
        }
      }
    }
  }

  // @ts-ignore
  return result;
};
