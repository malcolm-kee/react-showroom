import { deviceDimensions, FrameDimension } from '@showroomjs/core';
import {
  GalaxyNote10,
  IPad,
  IPadMini,
  IPadPro,
  IPhone8,
  IPhoneX,
  MacbookAir,
  MacbookPro,
} from '@showroomjs/device-frames';
import '@showroomjs/device-frames/dist/index.css';
import * as React from 'react';

export interface DeviceFrameProps {
  children: React.ReactNode;
  dimension: FrameDimension;
  showFrame: boolean;
  className?: string;
}

export const DeviceFrame = ({
  dimension,
  showFrame,
  ...props
}: DeviceFrameProps) => {
  if (!showFrame) {
    return <>{props.children}</>;
  }

  const d = dimension;

  const matchedDevice = deviceDimensions.find(
    (device) => device.height === d.height && device.width === d.width
  );

  if (matchedDevice) {
    switch (matchedDevice.name) {
      case 'iPhone 6/7/8':
        return <IPhone8 {...props} />;

      case 'iPhone X':
        return <IPhoneX {...props} />;

      case 'iPad':
        return <IPad {...props} />;

      case 'iPad Mini':
        return <IPadMini {...props} />;

      case 'iPad Pro':
        return <IPadPro {...props} />;

      case 'Macbook Air':
        return <MacbookAir {...props} />;

      case 'Macbook Pro':
        return <MacbookPro {...props} />;

      case 'Galaxy Note 10':
        return <GalaxyNote10 {...props} />;
    }
  }

  return (
    <div
      style={{
        width: d.width,
        height: d.height,
      }}
    >
      {props.children}
    </div>
  );
};
