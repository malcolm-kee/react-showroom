import { ComponentDoc } from 'react-docgen-typescript';
import slugify from 'slugify';
import snarkdown from 'snarkdown';

export const ComponentMeta = ({ doc }: { doc: ComponentDoc }) => {
  const slug = slugify(doc.displayName);
  return (
    <>
      <h2 id={slug}>
        <a href={`#${slug}`}>{doc.displayName}</a>
      </h2>
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
