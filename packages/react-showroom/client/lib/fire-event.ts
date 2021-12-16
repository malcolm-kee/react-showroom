import { fireEvent } from '@testing-library/dom';
import { DomEvent } from './frame-message';

export const fireValidDomEvent = (ev: DomEvent) => {
  const eType = ev.elementType;

  const allEls = document.querySelectorAll(eType);
  const target = allEls[ev.elementIndex];

  if (allEls.length === ev.elementTypeTotal && target) {
    if (ev.eventType === 'click') {
      // click label will cause focus change to other frame, so skip it
      if (eType !== 'label') {
        fireEvent.click(target);
      }
    }
    if (ev.eventType === 'change') {
      fireEvent.change(target, {
        target: { value: ev.value, checked: ev.checked },
      });
    }
  }
};
