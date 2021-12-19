import * as React from 'react';

export interface GalaxyNoteProps {
  children: React.ReactNode;
  className?: string;
}

export const GalaxyNote8 = React.forwardRef<HTMLDivElement, GalaxyNoteProps>(
  function GalaxyNote8(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device note8">
          <div className="inner"></div>
          <div className="overflow">
            <div className="shadow"></div>
          </div>
          <div className="speaker"></div>
          <div className="sensors"></div>
          <div className="more-sensors"></div>
          <div className="sleep"></div>
          <div className="volume"></div>
          <div className="camera"></div>
          <div className="screen">{props.children}</div>
        </div>
      </div>
    );
  }
);

export const GalaxyNote10 = React.forwardRef<HTMLDivElement, GalaxyNoteProps>(
  function GalaxyNote10(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device note10">
          <div className="inner"></div>
          <div className="overflow">
            <div className="shadow"></div>
          </div>
          <div className="speaker"></div>
          <div className="sensors"></div>
          <div className="more-sensors"></div>
          <div className="sleep"></div>
          <div className="volume"></div>
          <div className="camera"></div>
          <div className="screen">{props.children}</div>
        </div>
      </div>
    );
  }
);
