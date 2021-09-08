import { ReactCompdocComponentSection } from '@compdoc/core';
import { Collapsible, styled } from '@compdoc/ui';
import * as React from 'react';
import snarkdown from 'snarkdown';
import { Div, H1 } from './base';

export const ComponentMeta = ({
  section,
  propsDefaultOpen,
}: {
  section: ReactCompdocComponentSection;
  propsDefaultOpen?: boolean;
}) => {
  const [propsIsOpen, setPropsIsOpen] = React.useState(propsDefaultOpen);

  const {
    data: { component: doc },
  } = section;

  return (
    <>
      <H1>{doc.displayName}</H1>
      {doc.description && (
        <Div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      {doc.props && Object.keys(doc.props).length > 0 && (
        <Collapsible.Root
          open={propsIsOpen}
          onOpenChange={setPropsIsOpen}
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
                hide={propsIsOpen}
                aria-label={propsIsOpen ? 'Hide' : 'View'}
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
                {Object.keys(doc.props).map((prop) => {
                  const propData = doc.props[prop];

                  return (
                    <tr key={prop}>
                      <Td>{propData.name}</Td>
                      <Td>{propData.type.name}</Td>
                      <Td>{propData.description}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  );
};

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
