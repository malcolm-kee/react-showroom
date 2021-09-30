import * as React from 'react';
import { ComponentItem, Link, useComponentList } from 'react-showroom/client';

export const ComponentList = () => {
  const componentList = useComponentList();

  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      {componentList.map((item) => (
        <ItemDisplay item={item} key={item.slug} />
      ))}
    </div>
  );
};

const ItemDisplay = ({ item }: { item: ComponentItem }) => {
  switch (item.type) {
    case 'group':
      return (
        <div>
          <h2 className="text-2xl text-gray-500 font-extrabold mb-5">
            {item.title}
          </h2>
          <ul className="space-y-3">
            {item.items.map((it) => (
              <li key={it.slug}>
                <ItemDisplay item={it} />
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

    default:
      return null;
  }
};
