import * as React from 'react';
import {
  ComponentItem,
  Link,
  ReactShowroomSection,
  useComponentList,
  useMenu,
} from 'react-showroom/client';

export const Menu = () => {
  const menu = useMenu();

  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      {menu.map((item, i) => (
        <MenuItem item={item} key={i} />
      ))}
    </div>
  );
};

const MenuItem = ({ item }: { item: ReactShowroomSection }) => {
  switch (item.type) {
    case 'group':
      return (
        <div>
          <h2 className="text-2xl text-gray-500 font-extrabold mb-5">
            {item.title}
          </h2>
          <ul className="space-y-3">
            {item.items.map((it, i) => (
              <li key={i}>
                <MenuItem item={it} />
              </li>
            ))}
          </ul>
        </div>
      );

    case 'component':
      return (
        <div>
          <Link to={`/${item.slug}`} className="text-4xl hover:text-pink-700">
            {item.title}
          </Link>
        </div>
      );

    case 'markdown':
      return (
        <div>
          <Link to={`/${item.slug}`} className="text-4xl hover:text-pink-700">
            {item.frontmatter.title || item.fallbackTitle}
          </Link>
        </div>
      );

    default:
      return null;
  }
};
