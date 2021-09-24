// Workaround due to this issue: https://github.com/vitejs/vite/issues/4786
// Once the issue is solved we can just use client-entry directly

import 'vite/modulepreload-polyfill';
import './client-entry';
