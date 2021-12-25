import { fireEvent } from '@testing-library/dom';
import { DomEvent } from './frame-message';

export const fireValidDomEvent = (ev: DomEvent) => {
  const eType = ev.tag;

  const allEls = document.querySelectorAll(eType);
  const target = allEls[ev.index];

  if (allEls.length === ev.tagTotal && target) {
    if (ev.eventType === 'click') {
      // click label will cause focus change to other frame, so skip it
      if (eType !== 'label') {
        fireEvent.click(target, ev.init);
      }
      return;
    }

    if (
      ev.eventType === 'keyDown' ||
      ev.eventType === 'keyUp' ||
      ev.eventType === 'change'
    ) {
      fireEvent[ev.eventType](target, ev.init);
      return;
    }
  }
};
