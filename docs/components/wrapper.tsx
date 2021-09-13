import * as React from 'react';
import 'tailwindcss/tailwind.css';

const Wrapper = (props: { children: React.ReactNode }) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Wrapper;
