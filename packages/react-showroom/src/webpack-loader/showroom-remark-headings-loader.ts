import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import unified from 'unified';
import vFile from 'vfile';
import type { LoaderDefinition } from 'webpack';
import { getHeadings } from '../lib/get-headings';

const parser = unified().use(remarkParse).use(remarkFrontmatter);

const showroomRemarkHeadingsLoader: LoaderDefinition = function (
  mdSource: string
) {
  const tree = parser.parse(vFile(mdSource));

  const headings = getHeadings(tree, 2);

  return `export default [${headings
    .map((h) => `{ text: '${h.text}', slug: '${h.slug}' }`)
    .join(',')}]`;
};

module.exports = showroomRemarkHeadingsLoader;
