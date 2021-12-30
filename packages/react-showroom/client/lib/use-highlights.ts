import { isEqualArray, dedupeArray } from '@showroomjs/core';
import { useId } from '@showroomjs/ui';
import * as React from 'react';

export const useHighlights = () => {
  const [colorValue, setColorValue] = React.useState('');

  const color = colorValue || '#EF4444';
  const id = useId();
  const [elementSelectors, setElementSelectors] = React.useState<Array<string>>(
    []
  );

  React.useEffect(() => {
    if (elementSelectors.length === 0) {
      return;
    }

    const sheet = document.createElement('style');
    sheet.setAttribute('id', id);
    sheet.innerHTML = elementSelectors
      .map(
        (target) =>
          `${target}{
          ${highlightStyle(color)}
         }`
      )
      .join(' ');
    document.head.appendChild(sheet);

    return () => {
      document.head.removeChild(sheet);
    };
  }, [elementSelectors, color]);

  return React.useCallback(function highlightElements(
    newElements: Array<string>,
    newColor: string
  ) {
    setColorValue(newColor);

    const elements = dedupeArray(newElements);

    setElementSelectors((current) =>
      isEqualArray(current, elements, { ignoreOrder: true })
        ? current
        : elements
    );
  },
  []);
};

const highlightStyle = (color: string) => `
  outline: 2px dashed ${color};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
`;
