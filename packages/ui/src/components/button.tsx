import { styled } from '../stitches.config';

export const Button = styled('button', {
  px: '$2',
  py: '$1',
  minWidth: 60,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid transparent',
  borderRadius: '$base',
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary-500',
        color: 'White',
      },
      outline: {
        color: '$primary-500',
        backgroundColor: 'White',
        borderColor: '$primary-500',
      },
    },
  },
});
