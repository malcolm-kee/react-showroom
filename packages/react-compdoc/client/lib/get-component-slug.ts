import type { ComponentDoc } from 'react-docgen-typescript';
import slugify from 'slugify';

export const getComponentSlug = (doc: ComponentDoc) => slugify(doc.displayName);
