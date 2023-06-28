import { tw } from '@showroomjs/ui';
import { usePropsEditorContext } from '../lib/use-props-editor';
import { PropsEditor } from './props-editor';

export const PropsEditorPanel = (props: { className?: string }) => {
  const editor = usePropsEditorContext();

  return (
    <div
      className={tw(
        ['px-2 py-4', !editor && 'animate-pulse'],
        [props.className]
      )}
    >
      {editor ? (
        <PropsEditor editor={editor} />
      ) : (
        <div
          className={tw([
            'grid items-center [grid-template-columns:max-content_1fr] gap-x-2 sm:gap-2 py-1',
          ])}
          aria-hidden
        >
          <LoadingLabel className={tw(['w-[90px]'])} />
          <Control />
          <LoadingLabel className={tw(['w-[105px]'])} />
          <Control className={tw(['max-w-[10rem]'])} />
          <LoadingLabel className={tw(['w-[60px]'])} />
          <Control className={tw(['h-[90px] max-w-none'])} />
          <LoadingLabel className={tw(['w-[105px]'])} />
          <Control />
        </div>
      )}
    </div>
  );
};

const LoadingLabel = (props: { className?: string }) => (
  <div className={tw(['h-6 bg-zinc-300'], [props.className])} />
);

function Control(props: { className?: string }) {
  return (
    <div className={tw(['sm:px-2 sm:py-1'])}>
      <div
        className={tw(
          ['w-full h-8 max-w-xl border border-zinc-300 rounded bg-zinc-100'],
          [props.className]
        )}
      />
    </div>
  );
}
