# `@showroomjs/device-frames`

Device frames used in [`react-showroom`](https://react-showroom.js.org/).

Supported devices:

- IPhone 8
- IPhone X
- IPad
- IPad Mini
- IPad Pro
- Galaxy Note 8
- Galaxy Note 10
- Macbook Pro
- Macbook Air

## Usage

This package requires `react` and `react-dom` as peer dependencies.

```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IPad } from '@showroomjs/device-frames';

ReactDOM.render(
  <IPad>
    <p>Content</p>
  </IPad>,
  document.querySelector('#app')
);
```

You also need to load a CSS file.

If using bundler that handle CSS, just import them:

```js
import '@showroomjs/device-frames/dist/index.css';
```
