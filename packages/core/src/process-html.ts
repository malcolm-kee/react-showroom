import type * as esbuild from 'esbuild';
import { compileTarget } from './compilation';
import { postCompile } from './post-compile';
import { isNumber } from './type-guard';

const processHtml = async (oriHtml: string) => {
  const [htmlparser, domUtils] = await Promise.all([
    import('htmlparser2'),
    import('domutils'),
  ]);
  const getScriptCode = () => {
    let isParsingScript = false;
    let scriptCode = '';

    // create custom parser as the default parser will
    // treat JSX as html elements
    const customParser = new htmlparser.Parser({
      onopentag(name) {
        if (name === 'script') {
          isParsingScript = true;
        }
      },
      ontext(text) {
        if (isParsingScript) {
          scriptCode += text;
        }
      },
      onclosetag(name) {
        if (name === 'script') {
          isParsingScript = false;
        }
      },
    });

    customParser.write(oriHtml);

    return scriptCode;
  };

  const dom = htmlparser.parseDocument(oriHtml, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });

  const scripts = domUtils.getElementsByTagName('script', dom);

  let useTs = false;
  let useJsx = false;

  scripts.forEach((script) => {
    if (['ts', 'tsx'].includes(script.attribs.lang)) {
      useTs = true;
    }

    if (['jsx', 'tsx'].includes(script.attribs.lang)) {
      useJsx = true;
    }
  });

  const html = stripScriptElements(oriHtml, scripts);
  const script = scripts.length > 0 ? getScriptCode() : '';

  return {
    html,
    script,
    useTs,
    useJsx,
  };
};

const toHtmlExample = (data: {
  script: string;
  html: string;
  useJsx: boolean;
}) => `
const HtmlExample = () => {
  ${
    data.useJsx
      ? `const [ui, setUi] = showroomUseState(() => {
    let initialResult = null;

    const render = ui => {
      initialResult = ui;
    };

    ${data.script}

    return initialResult;
  });`
      : ''
  }

  React.useEffect(() => {
    ${data.useJsx ? `const render = setUi;` : ''}
    ${data.script}
  }, []);

  return React.createElement(
    React.Fragment, 
    null,
    React.createElement('div', {
      dangerouslySetInnerHTML: {
        __html: \`${data.html}\`
      }
    }),
    ${data.useJsx ? 'ui' : ''}
  );
};

render(React.createElement(HtmlExample, {}));`;

const stripScriptElements = (
  oriHtml: string,
  scripts: Array<{
    startIndex: number | null;
    endIndex: number | null;
  }>
): string => {
  let result = oriHtml;
  let offset = 0;

  scripts.forEach((script) => {
    if (isNumber(script.startIndex) && isNumber(script.endIndex)) {
      const start = script.startIndex + offset;
      const end = script.endIndex + offset + 1;

      result = result.substring(0, start) + result.substring(end);

      offset -= end - start;
    }
  });

  return result;
};

export const compileHtml = async (
  oriHtml: string,
  compiler: typeof esbuild
) => {
  const { html, script, useTs, useJsx } = await processHtml(oriHtml);

  const transpiledScript = await compiler.transform(script, {
    loader: useJsx ? (useTs ? 'tsx' : 'jsx') : useTs ? 'ts' : 'js',
    target: compileTarget,
  });

  const postCompileResult = postCompile(transpiledScript.code, {
    insertRenderIfEndWithJsx: useJsx,
  });

  return {
    ...postCompileResult,
    code: toHtmlExample({
      script: postCompileResult.code,
      html,
      useJsx,
    }),
  };
};
