export const deepElementFromPoint = (x: number, y: number): Element | null => {
  const element = document.elementFromPoint(x, y);

  const crawlShadows = (node: Element): Element => {
    if (node && node.shadowRoot) {
      const nestedElement = node.shadowRoot.elementFromPoint(x, y);

      if (nestedElement) {
        // Nested node is same as the root one
        if (node.isEqualNode(nestedElement)) {
          return node;
        }
        // The nested node has shadow DOM too so continue crawling
        if (nestedElement.shadowRoot) {
          return crawlShadows(nestedElement);
        }
        // No more shadow DOM
        return nestedElement;
      }
    }

    return node;
  };

  const shadowElement = element && crawlShadows(element);

  return shadowElement || element;
};
