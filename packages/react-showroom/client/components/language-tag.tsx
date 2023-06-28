import type { Language } from 'prism-react-renderer';
import { tw } from '@showroomjs/ui';

export const LanguageTag = (props: { language: Language }) => (
  <div
    className={tw([
      'absolute right-2 top-0 px-2 text-sm font-[monospace] uppercase bg-primary-700 text-white rounded-b',
    ])}
  >
    {props.language}
  </div>
);
