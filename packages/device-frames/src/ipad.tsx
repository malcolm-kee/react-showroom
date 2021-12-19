import * as React from 'react';

export interface IPadProps {
  children: React.ReactNode;
  className?: string;
}

export const IPad = React.forwardRef<HTMLDivElement, IPadProps>(function IPad(
  props,
  ref
) {
  return (
    <div className={props.className} ref={ref}>
      <div className="marvel-device ipad silver">
        <div className="camera"></div>
        <div className="screen">{props.children}</div>
        <div className="home"></div>
      </div>
    </div>
  );
});

export const IPadPro = React.forwardRef<HTMLDivElement, IPadProps>(
  function IPadPro(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device ipad-pro silver">
          <div className="camera"></div>
          <div className="screen">{props.children}</div>
          <div className="home"></div>
        </div>
      </div>
    );
  }
);

export const IPadMini = React.forwardRef<HTMLDivElement, IPadProps>(
  function IPadMini(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device ipad-mini silver">
          <div className="camera"></div>
          <div className="screen">{props.children}</div>
          <div className="home"></div>
        </div>
      </div>
    );
  }
);
