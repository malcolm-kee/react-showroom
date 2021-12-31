import { styled } from '../stitches.config';
import { buttonBase } from './base';

export const BareButton = styled('button', {
  ...buttonBase,
  position: 'relative',
  '&:active': {
    top: 1,
  },
});
