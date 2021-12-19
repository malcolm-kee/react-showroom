import * as React from 'react';

export interface MacbookProps {
  children: React.ReactNode;
  className?: string;
}

export const MacbookAir = React.forwardRef<HTMLDivElement, MacbookProps>(
  function MacbookAir(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="laptop-wrapper">
          <div className="marvel-device macbook-air">
            <div className="top-bar"></div>
            <div className="camera"></div>
            <div className="screen">{props.children}</div>
            <div className="bottom-bar"></div>
          </div>
        </div>
      </div>
    );
  }
);

export const MacbookPro = React.forwardRef<HTMLDivElement, MacbookProps>(
  function MacbookPro(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="laptop-wrapper">
          <div className="marvel-device macbook">
            <div className="top-bar"></div>
            <div className="camera"></div>
            <div className="screen">{props.children}</div>
            <div className="bottom-bar"></div>
          </div>
        </div>
      </div>
    );
  }
);
