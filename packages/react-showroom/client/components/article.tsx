import { styled } from '@showroomjs/ui';

export const Article = styled('article', {
  paddingTop: '$6',
  borderBottom: '1px solid',
  borderBottomColor: '$gray-200',
  variants: {
    center: {
      true: {
        maxWidth: '$screenLg',
      },
    },
  },
});
