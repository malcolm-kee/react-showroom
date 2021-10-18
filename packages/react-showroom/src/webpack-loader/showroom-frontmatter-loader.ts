import fm from 'front-matter';
import type { LoaderDefinition } from 'webpack';

const showroomFrontmatterLoader: LoaderDefinition = function (source) {
  const { attributes } = fm(source);

  const h1match = h1Regex.exec(source);

  const title = h1match && h1match[1];

  return `export default ${JSON.stringify(
    Object.assign(title ? { title } : {}, attributes)
  )};`;
};

const h1Regex = /# (.*$)/im;

module.exports = showroomFrontmatterLoader;
