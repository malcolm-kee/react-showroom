import * as ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

const queryClient = createQueryClient();

const render =
  process.env.PRERENDER === 'true' ? ReactDOM.hydrate : ReactDOM.render;

render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('target')
);
