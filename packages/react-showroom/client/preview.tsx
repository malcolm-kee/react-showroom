import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createQueryClient } from './lib/create-query-client';
import { PreviewApp } from './preview-app';

const queryClient = createQueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <PreviewApp />
  </QueryClientProvider>,
  document.getElementById('preview')
);
