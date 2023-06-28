import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import * as Announce from '@radix-ui/react-announce';
import { tw } from '../lib/tw';

export interface AlertProps {
  variant: 'error' | 'success' | 'info' | 'warning';
  children: React.ReactNode;
}

export function Alert(props: AlertProps) {
  const Icon = iconMap[props.variant];
  return (
    <Announce.Root
      role="alert"
      className={tw([
        'flex gap-3 p-4 rounded-md',
        {
          success: 'bg-green-50 text-green-700',
          error: 'bg-red-50 text-red-700',
          info: 'bg-blue-50 text-blue-700',
          warning: 'bg-yellow-50 text-yellow-700',
        }[props.variant],
      ])}
    >
      <div className={tw(['flex-shrink-0'])}>
        <Icon className={tw(['w-5 h-5 text-current opacity-70'])} />
      </div>
      <div className={tw(['text-sm whitespace-pre-wrap'])}>
        {props.children}
      </div>
    </Announce.Root>
  );
}

const iconMap = {
  error: XCircleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};
