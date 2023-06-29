import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { tw } from '@showroomjs/ui';
import { H1 } from '../components/base';
import { Seo } from '../components/seo';

export const OfflinePage = () => {
  return (
    <div className={tw(['flex-1 flex flex-col max-w-full'])}>
      <Seo title="Offline" />
      <div className={tw(['flex flex-1 overflow-hidden'])}>
        <main className={tw(['flex-1 overflow-y-auto pt-[10vh]'])}>
          <div className={tw(['max-w-xl mx-auto p-6'])}>
            <H1 className={tw(['flex justify-center items-center gap-4'])}>
              <ExclamationCircleIcon
                width={56}
                height={56}
                aria-hidden
                className={tw([
                  'w-10 h-10 inline-block text-zinc-400 sm:w-14 sm:h-14',
                ])}
              />
              Offline
            </H1>
            <p className={tw(['text-center sm:text-xl'])}>
              Please try again later.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
