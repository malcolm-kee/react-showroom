import { ComponentDoc } from 'react-docgen-typescript';
import snarkdown from 'snarkdown';

export const ComponentMeta = ({ doc }: { doc: ComponentDoc }) => (
  <>
    <h2>{doc.displayName}</h2>
    {doc.description && (
      <div
        dangerouslySetInnerHTML={{
          __html: snarkdown(doc.description),
        }}
      />
    )}
  </>
);
