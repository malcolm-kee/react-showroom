import { isString } from '@showroomjs/core';
import type { Element, Root } from 'hast';

const visit = require('unist-util-visit');

export function rehypeMetaAsAttribute() {
  return transform;
}

function transform(tree: Root) {
  visit(tree, 'element', onelement);
}

const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;

function onelement(node: Element) {
  let match;

  if (node.tagName === 'code' && node.data && isString(node.data.meta)) {
    re.lastIndex = 0; // Reset regex.

    while ((match = re.exec(node.data.meta))) {
      node.properties = node.properties || {};
      node.properties[match[1]] = match[2] || match[3] || match[4] || true;
    }
  }
}
