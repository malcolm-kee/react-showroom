import type { ComponentDoc } from 'react-docgen-typescript';
import slugify from 'slugify';
import snarkdown from 'snarkdown';
import { text, Div } from './base';
import { styled } from '../stitches.config';
import * as Collapsible from './collapsible';

export const ComponentMeta = ({ doc }: { doc: ComponentDoc }) => {
  const slug = slugify(doc.displayName);
  return (
    <>
      <Div
        as="h2"
        id={slug}
        css={{ marginBottom: '$3' }}
        className={text({ variant: '5xl' })}
      >
        <a href={`#${slug}`}>{doc.displayName}</a>
      </Div>
      {doc.description && (
        <div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      {doc.props && Object.keys(doc.props).length > 0 && (
        <Collapsible.Root>
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
