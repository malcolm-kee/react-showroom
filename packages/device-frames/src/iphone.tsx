import {
  ChartBarIcon,
  SpeakerXMarkIcon,
  WifiIcon,
} from '@heroicons/react/20/solid';
import * as React from 'react';

export interface IPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

const Time = () => {
  const [time, setTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('it-IT').slice(0, 5));
    };

    const timerId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return time ? <time dateTime={time}>{time}</time> : null;
};

export const IPhoneX = React.forwardRef<HTMLDivElement, IPhoneFrameProps>(
  function IPhoneX(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device iphone-x">
          <div className="notch">
            <div className="camera"></div>
            <div className="speaker"></div>
          </div>
          <div className="top-bar"></div>
          <div className="sleep"></div>
          <div className="bottom-bar"></div>
          <div className="volume"></div>
          <div className="overflow">
            <div className="shadow shadow--tr"></div>
            <div className="shadow shadow--tl"></div>
            <div className="shadow shadow--br"></div>
            <div className="shadow shadow--bl"></div>
          </div>
          <div className="inner-shadow"></div>
          <div className="screen">
            <div className="status-bar">
              <div className="status-bar-time">
                <Time />
              </div>
              <div className="status-bar-notification">
                <ChartBarIcon width={16} height={16} />
                <WifiIcon width={16} height={16} />
                <SpeakerXMarkIcon width={16} height={16} />
              </div>
            </div>
            <div className="screen-content">{props.children}</div>
          </div>
        </div>
      </div>
    );
  }
);

export const IPhone8 = React.forwardRef<HTMLDivElement, IPhoneFrameProps>(
  function IPhone8(props, ref) {
    return (
      <div className={props.className} ref={ref}>
        <div className="marvel-device iphone8 black">
          <div className="topbar" />
          <div className="sleep" />
          <div className="volume" />
          <div className="camera" />
          <div className="speaker" />
          <div className="screen">{props.children}</div>
          <div className="home" />
          <div className="bottom-bar" />
        </div>
      </div>
    );
  }
);
