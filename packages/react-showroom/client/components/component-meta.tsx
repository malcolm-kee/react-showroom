import { ComponentDocItem } from '@showroomjs/core/react';
import { Collapsible, styled } from '@showroomjs/ui';
import * as React from 'react';
import type { Props } from 'react-docgen-typescript';
import snarkdown from 'snarkdown';
import { Div, H1 } from './base';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasTag = (tags: Record<string, unknown>, tag: string) =>
  hasOwnProperty.call(tags, tag);

export interface ComponentMetaProps {
  componentData: ComponentDocItem['component'];
  propsDefaultOpen?: boolean;
}

export const ComponentMeta = ({
  componentData,
  propsDefaultOpen,
}: ComponentMetaProps) => {
  const [propsIsOpen, setPropsIsOpen] = React.useState(propsDefaultOpen);

  const doc = componentData;

  const tags = doc.tags as Record<string, unknown>;

  return (
    <>
      <H1
        css={
          hasTag(tags, 'deprecated')
            ? {
                textDecorationLine: 'line-through',
                fontWeight: 'normal',
              }
            : {}
        }
      >
        {doc.displayName}
      </H1>
      {doc.description && (
        <Div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      <ComponentMetaTags tags={tags} />
      <ComponentPropsTable
        componentProps={doc.props}
        open={propsIsOpen}
        onOpenChange={setPropsIsOpen}
      />
    </>
  );
};

const ComponentPropsTable = (props: {
  open: boolean | undefined;
  onOpenChange: (val: boolean) => void;
  componentProps: Props;
}) => {
  const componentProps = props.componentProps;

  if (Object.keys(componentProps).length === 0) {
    return null;
  }

  return (
    <Collapsible.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      css={{
        marginY: '$4',
      }}
    >
      <Div css={{ padding: '$1' }}>
        <Collapsible.Button
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '$1',
          }}
        >
          <Collapsible.ToggleIcon
            hide={props.open}
            aria-label={props.open ? 'Hide' : 'View'}
            width="16"
            height="16"
          />
          Props
        </Collapsible.Button>
      </Div>
      <Collapsible.Content>
        <Table>
          <thead>
            <tr>
              <Th>NAME</Th>
              <Th>TYPE</Th>
              <Th>DESCRIPTION</Th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(componentProps).map((prop) => {
              const propData = componentProps[prop];

              return (
                <tr key={prop}>
                  <Td>{propData.name}</Td>
                  <Td>{propData.type.raw}</Td>
                  <Td>{propData.description}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const ComponentMetaTags = ({ tags }: { tags: Record<string, unknown> }) => {
  const tagKeys = Object.keys(tags);

  return (
    <>
      {tagKeys.map((tag) => (
        <p key={tag}>
          <TagKey capitalize={tag === 'deprecated'}>{tag}</TagKey>
          {tags[tag] && typeof tags[tag] === 'string' && `: ${tags[tag]}`}
        </p>
      ))}
    </>
  );
};

const TagKey = styled('b', {
  variants: {
    capitalize: {
      true: {
        textTransform: 'capitalize',
      },
    },
  },
});

const Table = styled('table', {
  borderRadius: '$base',
  overflow: 'hidden',
  width: '100%',
});

const Td = styled('td', {
  px: '$3',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  textAlign: 'left',
});

const Th = styled('th', {
  px: '$3',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-600',
  backgroundColor: '$gray-100',
  textAlign: 'left',
});
