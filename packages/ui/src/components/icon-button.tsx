import { styled } from '../stitches.config';

export const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 35,
  width: 35,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$gray-400',
  backgroundColor: 'white',
  boxShadow: `0 2px 10px $gray-400`,
  '&:hover': { backgroundColor: '$gray-100' },
  outlineRing: '',
});
