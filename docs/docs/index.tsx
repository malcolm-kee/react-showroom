import {
  BookOpenIcon,
  CloudArrowDownIcon as CloudDownloadIcon,
  CodeBracketIcon as CodeIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from '@heroicons/react/24/outline';
import * as React from 'react';
import { Link, styled } from 'react-showroom/client';

export const HomePage = () => {
  return (
    <>
      <div className="mb-10">
        <div className="py-6 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <img
              src="/react-showroom.png"
              width={316}
              height={332}
              className="block h-28 w-auto"
            />
            <h1 className="text-4xl lg:text-6xl font-bold">React Showroom</h1>
          </div>
        </div>
        <p className="text-lg lg:text-2xl mb-8 max-w-lg mx-auto text-center text-gray-500">
          Document React components by declaring props definition and writing
          markdown.
        </p>
        <div className="flex justify-center items-center gap-3 mb-6">
          <PrimaryLink
            to="/getting-started/installation"
            className="px-6 py-2 rounded-2xl text-white"
          >
            Documentation
          </PrimaryLink>
          <a
            href="https://github.com/malcolm-kee/react-showroom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-gray-700 hover:bg-gray-200"
          >
            GitHub
            <ExternalLinkIcon width={16} height={16} />
          </a>
        </div>
        <div className="text-center py-6">
          <code className="px-6 py-2 rounded-3xl bg-gray-800 text-white">
            npm install -D react-showroom
          </code>
        </div>
      </div>
      <div className="py-12 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt>
                  <IconWrapper className="flex items-center justify-center h-12 w-12 rounded-md text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </IconWrapper>
                  <p className="mt-5 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
};

const PrimaryLink = styled(Link, {
  backgroundColor: '$primary-500',
});

const IconWrapper = styled('div', {
  backgroundColor: '$primary-500',
});

const features = [
  {
    name: 'Code-first documentation',
    description:
      "Auto generate documentations for your component props from the component's TypeScript definition.",
    icon: CodeIcon,
  },
  {
    name: 'Standard language',
    description:
      'Write markdown (or MDX) to show examples to use the component, which will become an editable playground.',
    icon: BookOpenIcon,
  },
  {
    name: 'SSR-friendly',
    description:
      'Ensure the components are SSR-friendly - the examples can be pre-render on build time.',
    icon: CloudDownloadIcon,
  },
];
