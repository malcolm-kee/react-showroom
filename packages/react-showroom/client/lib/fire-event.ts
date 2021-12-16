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
        fireEvent.click(target);
      }
      return;
    }
    if (ev.eventType === 'change') {
      fireEvent.change(target, {
        target: { value: ev.value, checked: ev.checked },
      });

      return;
    }

    if (ev.eventType === 'keyDown' || ev.eventType === 'keyUp') {
      const { eventType, index, tag, tagTotal, ...init } = ev;

      fireEvent[ev.eventType](target, init);
      return;
    }
  }
};
