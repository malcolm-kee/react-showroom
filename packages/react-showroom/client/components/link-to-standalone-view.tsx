import { ArrowsExpandIcon } from '@heroicons/react/outline';
import { icons, styled, TextTooltip } from '@showroomjs/ui';
import * as React from 'react';
import { Link } from '../lib/routing';

export const LinkToStandaloneView = (props: {
  codeHash: string | undefined;
  isDesigner: boolean;
}) => {
  return props.codeHash ? (
    <TextTooltip label="Standalone">
      <StyledLink
        to={`_standalone/${props.codeHash}/${
          props.isDesigner ? '?commentMode=true' : ''
        }`}
        data-testid="standalone-link"
      >
        <ArrowsExpandIcon width={20} height={20} className={icons()} />
      </StyledLink>
    </TextTooltip>
  ) : null;
};

const StyledLink = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  px: '$1',
  gap: '$1',
  fontSize: '$sm',
  color: '$gray-500',
  outlineRing: '',
});
