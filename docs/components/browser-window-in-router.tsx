import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserWindow } from 'react-showroom/client';

export const BrowserWindowInRouter = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const location = useLocation();

  return (
    <BrowserWindow
      url={`http://localhost:6969${location.pathname}`}
      {...props}
    />
  );
};
