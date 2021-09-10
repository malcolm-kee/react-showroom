import type { Language } from 'prism-react-renderer';
import { Div } from './base';

export const LanguageTag = (props: { language: Language }) => (
  <Div
    css={{
      position: 'absolute',
      right: '$2',
      top: '$0',
      backgroundColor: '$primary-700',
      color: 'White',
      px: '$2',
      textTransform: 'uppercase',
      fontSize: '$sm',
      lineHeight: '$sm',
      roundedB: '$base',
      fontFamily: 'monospace',
    }}
  >
    {props.language}
  </Div>
);
