import * as React from 'react';

export interface ImageViewerProps
  extends React.ComponentPropsWithoutRef<'img'> {
  file?: File | null;
}

export const ImageViewer = React.forwardRef<HTMLImageElement, ImageViewerProps>(
  function ImageViewer({ file, src, ...props }, ref) {
    const [previewUrl, setPreviewUrl] = React.useState('');

    React.useEffect(() => {
      if (file) {
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        return () => {
          URL.revokeObjectURL(preview);
        };
      }
    }, [file]);

    if (!src && !file) {
      return null;
    }

    const imgSrc = src || (file && previewUrl);

    return <img {...props} src={imgSrc} ref={ref} />;
  }
);
