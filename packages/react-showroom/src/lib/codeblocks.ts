import {
  CodeBlocks,
  compileTarget,
  postCompile,
  processHtml,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  toHtmlExample,
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

const parser = unified().use(remarkParse as any);

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
            const { html, script } = await processHtml(code);
            const transpiledScript = await esbuild.transform(script, {
              loader: 'js',
              target: compileTarget,
            });

            const postCompileResult = postCompile(transpiledScript.code);

            result[code] = {
              ...postCompileResult,
              code: toHtmlExample({
                script: postCompileResult.code,
                html,
              }),
              type: 'success',
              messageId: -1,
              initialCodeHash: createHash(code),
              lang,
            };
          } else {
            const transformResult = await esbuild.transform(code, {
              loader: lang,
              target: compileTarget,
            });

            const postTranspileResult = postCompile(transformResult.code, {
              insertRenderIfEndWithJsx: true,
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
