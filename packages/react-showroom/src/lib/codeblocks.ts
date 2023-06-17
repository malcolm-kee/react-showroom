import {
  CodeBlocks,
  compileHtml,
  compileScript,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '@showroomjs/core';
import * as esbuild from 'esbuild';
import type { Code, Parent as MdParent, Parent } from 'mdast';
import remarkParse from 'remark-parse';
import unified from 'unified';
import vFile from 'vfile';
import { createHash } from '../lib/create-hash';

const all = 'all';

export type AllLangResult<Name extends string> = {
  [Key in Name]: Record<string, Array<string>>;
};

export type SingleLangResult<Name extends string> = {
  [Key in Name]: Array<string>;
};

interface CodeBlocksOptions<Name extends string, Lang extends string> {
  name?: Name;
  lang?: Lang;
  formatter?: (v: string) => string;
  filter?: (child: Code) => boolean;
}

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
  }: CodeBlocksOptions<Name, Lang> = {}
): Lang extends 'all' ? AllLangResult<Name> : SingleLangResult<Name> => {
  if (lang === all) {
    const result = {
      [name]: {},
    } as AllLangResult<Name>;

    const { children } = tree;

    let i = -1;

    while (++i < children.length) {
      const child = children[i];

      if (child.type === 'code' && child.value && filter(child)) {
        child.lang = child.lang || '_';

        // @ts-expect-error typescript can't infer this correctly
        result[name as Name][child.lang] = result[name][child.lang] || [];
        result[name][child.lang].push(formatter(child.value));
      }
    }

    return result as Lang extends 'all'
      ? AllLangResult<Name>
      : SingleLangResult<Name>;
  }

  const { children } = tree;
  const result = {
    [name]: [] as Array<string>,
  } as SingleLangResult<Name>;
  let i = -1;

  while (++i < children.length) {
    const child = children[i];

    if (child.type === 'code' && child.value && filter(child)) {
      if (child.lang === lang) {
        result[name].push(formatter(child.value));
      }
    }
  }

  return result as Lang extends 'all'
    ? AllLangResult<Name>
    : SingleLangResult<Name>;
};

const parser = unified().use(remarkParse);

export const mdToCodeBlocks = async (
  mdSource: string,
  filter?: (child: Code) => boolean
): Promise<CodeBlocks> => {
  const tree = parser.parse(vFile(mdSource));

  const blocks = codeblocks(tree as MdParent, {
    filter,
  }).codeblocks;

  const result: CodeBlocks = {};

  for (const language of Object.keys(blocks)) {
    const lang = language as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      for (const code of blocks[language]) {
        try {
          if (lang === 'html') {
            const htmlCompileResult = await compileHtml(code, esbuild);

            result[code] = {
              ...htmlCompileResult,
              type: 'success',
              messageId: -1,
              initialCodeHash: createHash(code),
              features: [],
              lang,
            };
          } else {
            const postTranspileResult = await compileScript(code, esbuild, {
              insertRenderIfEndWithJsx: true,
              language: lang,
            });

            result[code] = {
              ...postTranspileResult,
              type: 'success',
              messageId: -1,
              initialCodeHash: createHash(code),
              lang,
            };
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  return result;
};
