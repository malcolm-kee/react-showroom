import type { Heading } from 'mdast';
import mdAstToString from 'mdast-util-to-string';
import type { Node } from 'unist';
import Slugger from 'github-slugger';

const slugger = new Slugger();

const visit = require('unist-util-visit');

export function getHeadings(tree: Node, minLevel: number) {
  slugger.reset();

  const result: Array<{
    text: string;
    slug: string;
  }> = [];

  collectHeadings(tree, result, minLevel);

  return result;
}

function collectHeadings(
  node: Node,
  result: Array<{
    text: string;
    slug: string;
  }>,
  minLevel: number
) {
  visit(node, 'heading', (node: Heading) => {
    if (node.depth >= minLevel) {
      const text = mdAstToString(node);

      result.push({
        text,
        slug: slugger.slug(text),
      });
    }
  });
}
