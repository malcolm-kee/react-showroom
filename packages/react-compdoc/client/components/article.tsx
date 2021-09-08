import { styled } from '@compdoc/ui';

export const Article = styled('article', {
  py: '$6',
  marginBottom: '$12',
  borderBottom: '1px solid',
  borderBottomColor: '$gray-200',
  variants: {
    standalone: {
      true: {
        paddingBottom: '0',
        marginBottom: '$0',
      },
    },
  },
});
