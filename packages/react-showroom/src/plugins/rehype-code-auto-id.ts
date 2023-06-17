const visit = require('unist-util-visit');

import type { Element, Root, Text } from 'hast';
import { createHash } from '../lib/create-hash';

const defaultPrefix = 'code';
let count = 1;

/**
 * This plugin generate a unique id for all `<code>` tag so we can use
 * it as a unique key to identify them for focus mode.
 */
export function rehypeCodeAutoId({ prefix = defaultPrefix } = {}) {
  return transformer;

  function transformer(tree: Root) {
    visit(tree, 'element', function onElement(node: Element) {
      if (node.tagName === 'code') {
        node.properties = node.properties || {};
        node.properties.id = node.properties.id || generateId(node);
      }
    });
  }

  function generateId(node: Element) {
    const firstTextChild = node.children.find(
      (child) => child.type === 'text'
    ) as Text | undefined;

    return firstTextChild
      ? createHash(firstTextChild.value)
      : `${prefix}-${count++}`;
  }
}
