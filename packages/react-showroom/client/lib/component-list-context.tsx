import { isDefined, omit } from '@showroomjs/core';
import {
  ReactShowroomComponentSection,
  ReactShowroomGroupSection,
} from '@showroomjs/core/react';
import section from 'react-showroom-sections';

export type ComponentItem =
  | Omit<ReactShowroomComponentSection, 'data'>
  | ComponentGroup;

type ComponentGroup = Omit<ReactShowroomGroupSection, 'items'> & {
  items: Array<ComponentItem>;
};

const COMPONENT_SECTIONS = section
  .map(function transformToComp(section): ComponentItem | undefined {
    if (section.type === 'group') {
      const items = section.items.map(transformToComp).filter(isDefined);

      if (items.length > 0) {
        return {
          ...section,
          items,
        };
      }
    } else if (section.type === 'component') {
      return omit(section, ['data']);
    }

    return undefined;
  })
  .filter(isDefined);

export const useComponentList = (): Array<ComponentItem> => COMPONENT_SECTIONS;
