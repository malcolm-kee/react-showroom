import { Collapsible, styled, Table } from '@showroomjs/ui';
import * as React from 'react';
import type { ComponentDoc, Props } from 'react-docgen-typescript';
import snarkdown from 'snarkdown';
import { useTargetAudience } from '../lib/use-target-audience';
import { Div, H1, NavLink } from './base';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasTag = (tags: Record<string, unknown>, tag: string) =>
  hasOwnProperty.call(tags, tag);

export interface ComponentMetaProps {
  componentData: ComponentDoc;
  propsDefaultOpen?: boolean;
  slug: string;
}

export const ComponentMeta = ({
  componentData,
  propsDefaultOpen,
  slug,
}: ComponentMetaProps) => {
  const [propsIsOpen, setPropsIsOpen] = React.useState(propsDefaultOpen);

  const targetAudience = useTargetAudience();

  const doc = componentData;

  const tags = doc.tags as Record<string, unknown>;

  return (
    <>
      <H1>
        <NavLink
          to={`/${slug}`}
          css={{
            ...(hasTag(tags, 'deprecated')
              ? {
                  textDecorationLine: 'line-through',
                  fontWeight: 'normal',
                }
              : {}),
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {doc.displayName}
        </NavLink>
      </H1>
      {doc.description && (
        <Div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      {targetAudience === 'developer' && (
        <>
          <ComponentMetaTags tags={tags} />
          <ComponentPropsTable
            componentProps={doc.props}
            open={propsIsOpen}
            onOpenChange={setPropsIsOpen}
          />
        </>
      )}
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
            <Table.Tr>
              <Table.Th>NAME</Table.Th>
              <Table.Th>TYPE</Table.Th>
              <Table.Th>DESCRIPTION</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {Object.keys(componentProps).map((prop) => {
              const propData = componentProps[prop];

              const isDeprecated =
                propData.tags && hasTag(propData.tags, 'deprecated');

              const style = isDeprecated
                ? { textDecorationLine: 'line-through' }
                : undefined;

              return (
                <Table.Tr key={prop}>
                  <Table.Td css={style}>{propData.name}</Table.Td>
                  <Table.Td css={style}>{propData.type.raw}</Table.Td>
                  <Table.Td css={style}>{propData.description}</Table.Td>
                </Table.Tr>
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
