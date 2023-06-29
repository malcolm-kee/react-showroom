import { ArrowsPointingOutIcon } from '@heroicons/react/20/solid';
import { iconClass, TextTooltip, tw } from '@showroomjs/ui';
import { Link } from '../lib/routing';

export const LinkToStandaloneView = (props: {
  codeHash: string | undefined;
  isDesigner: boolean;
}) => {
  return props.codeHash ? (
    <TextTooltip label="Full page">
      <Link
        to={`_standalone/${props.codeHash}/${
          props.isDesigner ? '?commentMode=true' : ''
        }`}
        data-testid="standalone-link"
        className={tw([
          'inline-flex items-center gap-1 text-sm text-zinc-500 no-underline px-1 hover:text-zinc-700 hover:bg-zinc-100',
        ])}
      >
        <ArrowsPointingOutIcon width={20} height={20} className={iconClass} />
      </Link>
    </TextTooltip>
  ) : null;
};
