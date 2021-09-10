const visit = require('unist-util-visit');

var defaultPrefix = 'code';
let count = 1;

/**
 * This plugin generate a unique id for all `<code>` tag so we can use
 * it as a unique key to identify them for focus mode.
 */
export function rehypeCodeAutoId(options) {
  var settings = options || {};
  var prefix = settings.prefix || defaultPrefix;
  return transformer;

  function transformer(tree) {
    visit(tree, 'element', function onElement(node) {
      if (node.tagName === 'code') {
        node.properties.id = node.properties.id || `${prefix}-${count++}`;
      }
    });
  }
}
