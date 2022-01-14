import {
  DocumentIcon,
  ExternalLinkIcon,
  PuzzleIcon,
} from '@heroicons/react/outline';
import { HashtagIcon } from '@heroicons/react/solid';
import { isString } from '@showroomjs/core';
import type { Option } from '@showroomjs/ui';
import { styled } from '@showroomjs/ui';
import * as React from 'react';

const searchWorker = new Worker(new URL('./search-worker.js', import.meta.url));

let id = 0;

export const getSearchResult = (searchText: string) =>
  new Promise<Array<Option<string>>>((fulfill) => {
    const messageId = id++;

    searchWorker.postMessage({
      messageId,
      searchText,
    });

    function handleMessage(ev: MessageEvent) {
      const data = ev.data;
      if (messageId === data.messageId) {
        fulfill(formatOptions(data.result));
        searchWorker.removeEventListener('message', handleMessage);
      }
    }

    searchWorker.addEventListener('message', handleMessage);
  });

/**
 * map icon string to actual JSX, as React element can't be serialized via web worker
 */
const formatOptions = (options: Array<Option<string>>) =>
  options.map((option) => ({
    ...option,
    icon: (isString(option.icon) && iconMap[option.icon]) || option.icon,
  }));

const Document = styled(DocumentIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const Hashtag = styled(HashtagIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const Puzzle = styled(PuzzleIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const External = styled(ExternalLinkIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const iconMap: Record<string, React.ReactElement> = {
  component: <Puzzle width={20} height={20} />,
  section: <Hashtag width={20} height={20} />,
  markdown: <Document width={20} height={20} />,
  link: <External width={20} height={20} />,
};
