import { ComponentDoc } from 'react-docgen-typescript';
import slugify from 'slugify';
import snarkdown from 'snarkdown';
import { text, Div } from './base';

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
    </>
  );
};
