import Highlighter, { HighlighterProps } from 'react-highlight-words';
import { css } from '../stitches.config';

export type TextHighlightProps = HighlighterProps;

/**
 * Wrapper of `react-highlight-words` with change of default.
 */
export const TextHighlight = ({
  highlightClassName = cls().className,
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

const cls = css({
  backgroundColor: '$primary-200',
});
