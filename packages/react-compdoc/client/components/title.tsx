import { styled } from '@compdoc/ui';
import { HashtagIcon } from '@heroicons/react/outline';

export const HashTag = styled(HashtagIcon, {
  visibility: 'hidden',
  position: 'absolute',
  left: '-0.7rem',
  width: '1rem',
  height: '1rem',
  top: '50%',
  transform: 'translate(0, -50%)',
});

export const Title = styled('a', {
  display: 'inline-block',
  px: '$2',
  marginX: '-$2',
  color: '$gray-500',
  position: 'relative',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: '1px solid $primary-200',
  },
  [`&:hover ${HashTag}`]: {
    visibility: 'visible',
  },
});
