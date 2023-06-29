import { Link } from '@showroomjs/bundles/routing';
import * as React from 'react';
import { tw } from '../lib/tw';

export interface BreadcrumbsProps {
  items: Array<{
    label: string;
    url?: string;
  }>;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(props, forwardedRef) {
    return (
      <nav
        aria-label="Breadcrumb"
        ref={forwardedRef}
        className={tw(['flex bg-white border-b border-b-zinc-200'])}
      >
        <ol className={tw(['flex gap-4 w-full list-none m-0'])}>
          {props.items.map((item, i) => (
            <li className={tw(['flex items-center'])} key={i}>
              {i > 0 && (
                <svg
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  aria-hidden="true"
                  width={24}
                  className={tw(['h-full flex-shrink-0 text-zinc-200'])}
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              )}
              {item.url ? (
                <Link
                  to={item.url}
                  className={`${textClass} ${tw(['hover:text-zinc-700'])}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={textClass}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

const textClass = tw(['text-sm ml-4 px-2 text-gray-500 no-underline']);
