import { isNumber } from './type-guard';

export const processHtml = async (oriHtml: string) => {
  const [htmlparser, domUtils] = await Promise.all([
    import('htmlparser2'),
    import('domutils'),
  ]);

  const dom = htmlparser.parseDocument(oriHtml, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });

  const scripts = domUtils.getElementsByTagName('script', dom);

  const html = stripScriptElements(oriHtml, scripts);
  const script = domUtils.textContent(scripts);

  return {
    html,
    script,
  };
};

export const toHtmlExample = (data: { script: string; html: string }) => `
const HtmlExample = () => {
  React.useEffect(() => {
    ${data.script}
  }, []);

  return React.createElement('div', {
    dangerouslySetInnerHTML: {
      __html: \`${data.html}\`
    }
  })
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
