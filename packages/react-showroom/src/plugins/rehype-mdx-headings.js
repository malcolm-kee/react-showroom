const isHeading = require('hast-util-heading');
const getHeadingRank = require('hast-util-heading-rank');
const toHtml = require('hast-util-to-html');

import { valueToEstree } from 'estree-util-value-to-estree';

/**
 * Plugin to attach `headings` variable in MDX.
 */
export function rehypeMdxHeadings() {
  return transformer;
}

function transformer(ast) {
  const headings = getHeadings(ast, 2);

  ast.children.unshift({
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'headings',
                  },
                  init: valueToEstree(headings),
                },
              ],
            },
          },
        ],
      },
    },
  });
}

function getHeadings(tree, minLevel) {
  const result = [];

  collectHeadings(tree, result, minLevel);

  return result;
}

function collectHeadings(node, result, minLevel) {
  if (isHeading(node)) {
    const rank = getHeadingRank(node);
    const text = Array.isArray(node.children) && toHtml(node.children);
    if (rank >= minLevel && text) {
      result.push({
        rank,
        text,
        id: node.properties && node.properties.id,
      });
    }
  }

  if (node.children) {
    node.children.forEach((child) => collectHeadings(child, result, minLevel));
  }
}
