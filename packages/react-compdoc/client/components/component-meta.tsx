import { ReactCompdocComponentSection } from '@compdoc/core';
import { ArrowsExpandIcon } from '@heroicons/react/outline';
import * as React from 'react';
import snarkdown from 'snarkdown';
import { slashToDash } from '../lib/slash-to-dash';
import { icons, styled } from '../stitches.config';
import { Div, NavLink, text } from './base';
import * as Collapsible from './collapsible';
import { HashTag, Title } from './title';

export const ComponentMeta = ({
  section,
  propsDefaultOpen,
  showLinkToDetails,
}: {
  section: ReactCompdocComponentSection;
  propsDefaultOpen?: boolean;
  showLinkToDetails?: boolean;
}) => {
  const [propsIsOpen, setPropsIsOpen] = React.useState(propsDefaultOpen);

  const {
    data: { component: doc },
  } = section;

  const slug = slashToDash(section.slug);

  return (
    <>
      <Div
        as="h2"
        id={slug}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '$5',
          fontWeight: 700,
        }}
        className={text({ variant: '4xl' })}
      >
        <Title href={`#${slug}`}>
          <HashTag />
          {doc.displayName}
        </Title>
        {showLinkToDetails && (
          <NavLink to={`/${section.slug}`}>
            <ArrowsExpandIcon className={icons()} width={20} height={20} />
          </NavLink>
        )}
      </Div>
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
