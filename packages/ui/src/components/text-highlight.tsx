import Highlighter, { HighlighterProps } from 'react-highlight-words';
import { tw } from '../lib/tw';

export type TextHighlightProps = HighlighterProps;

/**
 * Wrapper of `react-highlight-words` with change of default.
 */
export const TextHighlight = ({
  highlightClassName = defaultHighlightClass,
  ...props
}: TextHighlightProps) => {
  return (
    <Highlighter
      highlightClassName={highlightClassName}
      autoEscape
      {...props}
    />
  );
};

const defaultHighlightClass = tw(['bg-primary-200']);
