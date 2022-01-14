/// <reference lib="WebWorker" />

import { matchSorter } from 'match-sorter';
import { options } from './search-options';

export type SearchWorkerMessage = {
  searchText: string;
  messageId: string;
};

self.onmessage = (ev) => {
  const data: SearchWorkerMessage = ev.data;

  const result = matchSorter(options, data.searchText, {
    keys: ['label', 'description', 'metadata'],
  }).slice(0, 30);

  self.postMessage({
    messageId: data.messageId,
    result,
  });
};
