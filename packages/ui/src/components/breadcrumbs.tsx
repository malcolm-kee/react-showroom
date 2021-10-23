import { Link } from '@showroomjs/bundles/routing';
import { styled } from '../stitches.config';

export interface BreadcrumbsProps {
  items: Array<{
    label: string;
    url?: string;
  }>;
}

export const Breadcrumbs = (props: BreadcrumbsProps) => (
  <Root aria-label="Breadcrumb">
    <Ol role="list">
      {props.items.map((item, i) => (
        <Item key={i}>
          {i > 0 && (
            <Svg
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </Svg>
          )}
          {item.url ? (
            <Text
              as={Link}
              to={item.url}
              css={{
                '&:hover': {
                  borderBottomColor: '$gray-300',
                },
              }}
            >
              {item.label}
            </Text>
          ) : (
            <Text>{item.label}</Text>
          )}
        </Item>
      ))}
    </Ol>
  </Root>
);

const Root = styled('nav', {
  background: 'White',
  display: 'flex',
  borderBottom: '1px solid $gray-200',
});

const Ol = styled('ol', {
  display: 'flex',
  gap: '4',
  width: '100%',
  listStyleType: 'none',
  margin: 0,
  '@sm': {
    px: '$6',
  },
  '@lg': {
    px: '$8',
  },
});

const Item = styled('li', {
  display: 'flex',
  alignItems: 'center',
});

const Svg = styled('svg', {
  width: 24,
  height: '100%',
  flexShrink: 0,
  color: '$gray-200',
});

const Text = styled('span', {
  marginLeft: '$4',
  paddingLeft: '$2',
  paddingRight: '$2',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-500',
  textDecoration: 'none',
  borderBlock: '1px solid transparent',
  '&:hover': {
    color: '$gray-700',
  },
});
