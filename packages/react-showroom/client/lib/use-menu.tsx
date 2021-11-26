import { ReactShowroomSection } from '@showroomjs/core/react';
import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const MenuContext = createNameContext<Array<ReactShowroomSection>>('Menu', []);

export const MenuContextProvider = (props: {
  sections: Array<ReactShowroomSection>;
  children: React.ReactNode;
}) => {
  const result = React.useMemo(
    () => filterHiddenItems(props.sections),
    [props.sections]
  );

  return (
    <MenuContext.Provider value={result}>{props.children}</MenuContext.Provider>
  );
};

export const useMenu = () => React.useContext(MenuContext);

const filterHiddenItems = (sections: Array<ReactShowroomSection>) => {
  const result: Array<ReactShowroomSection> = [];

  sections.forEach((section) => {
    if ('slug' in section && section.slug === '') {
      return;
    }

    if (section.type === 'link') {
      result.push(section);
    } else {
      if (!section.hideFromSidebar) {
        if (section.type === 'group') {
          const filteredItems = filterHiddenItems(section.items);

          if (filteredItems.length > 0) {
            result.push({
              ...section,
              items: filteredItems,
            });
          }
        } else {
          result.push(section);
        }
      }
    }
  });

  return result;
};
