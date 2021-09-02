import type { ComponentDoc } from 'react-docgen-typescript';
import snarkdown from 'snarkdown';
import { getComponentSlug } from '../lib/get-component-slug';
import { styled } from '../stitches.config';
import { A, Div, text } from './base';
import * as Collapsible from './collapsible';

export const ComponentMeta = ({
  doc,
  propsDefaultOpen,
}: {
  doc: ComponentDoc;
  propsDefaultOpen?: boolean;
}) => {
  const slug = getComponentSlug(doc);
  return (
    <>
      <Div
        as="h2"
        id={slug}
        css={{ marginBottom: '$5', fontWeight: 700 }}
        className={text({ variant: '5xl' })}
      >
        <A
          href={`#${slug}`}
          css={{
            display: 'inline-block',
            px: '$2',
            marginX: '-$2',
            color: '$gray-500',
          }}
        >
          {doc.displayName}
        </A>
      </Div>
      {doc.description && (
        <Div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      {doc.props && Object.keys(doc.props).length > 0 && (
        <Collapsible.Root defaultOpen={propsDefaultOpen}>
          <Div css={{ padding: '$1' }}>
            <Collapsible.Button>View Props</Collapsible.Button>
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
