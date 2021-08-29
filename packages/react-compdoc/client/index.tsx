import * as ReactDOM from 'react-dom';
import { compileCode } from './lib/compile-code';
import Data from 'react-compdoc-components';
import { App } from './app';

console.log({ Data });

compileCode(`import fs from 'fs';
let x: number = 6;
fs.readFile('./hello.txt')`).then((result) => console.log({ result }));

ReactDOM.render(<App data={Data} />, document.getElementById('target'));
