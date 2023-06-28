import { tw } from '@showroomjs/ui';
import { Article } from './article';
import { DetailsPageContainer } from './details-page-container';
import { mdxComponents } from './mdx-components';

const { h1: Heading, p: P, h2: Subheading } = mdxComponents;

export const PageFallback = (props: { title?: string }) => {
  return (
    <DetailsPageContainer title={props.title}>
      <div className="px-6">
        <Article className={tw(['xl:w-3/4'])}>
          <Heading className={tw(['animate-pulse'])}>
            {props.title || <div className={tw(['w-1/2 h-[3.75rem]'])} />}
          </Heading>
          <Text className={tw(['w-[70%]'])} />
          <CodeBlockSkeleton />
          <Text className={tw(['w-2/5'])} />
          <Subheading>
            <Div className={tw(['w-1/3 h-9'])} />
          </Subheading>
          <Text />
          <Text />
          <Text className={tw(['w-1/2'])} />
          <Subheading>
            <Div className={tw(['w-2/5 h-9'])} />
          </Subheading>
          <Text className={tw(['w-[70%]'])} />
          <CodeBlockSkeleton />
          <Text className={tw(['w-2/5'])} />
        </Article>
      </div>
    </DetailsPageContainer>
  );
};

const Div = (props: { className?: string }) => (
  <div className={tw(['bg-zinc-200 animate-pulse'], [props.className])} />
);

const Text = (props: { className?: string }) => (
  <P className={tw(['h-4 bg-zinc-200 animate-pulse'], [props.className])} />
);

const CodeBlockSkeleton = () => {
  return (
    <div className={tw(['mt-4 mb-8'])}>
      <div className={tw(['min-h-[48px] p-2 border border-zinc-300'])}>
        <div className={tw(['flex justify-center gap-4'])}>
          <Div className={tw(['w-[100px] h-8'])} />
          <Div className={tw(['w-[100px] h-8'])} />
        </div>
      </div>
    </div>
  );
};
