import { UploadIcon } from '@heroicons/react/outline';
import { useId } from '@radix-ui/react-id';
import * as React from 'react';
import { styled } from '../stitches.config';

export interface FileInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  onFilesSelected: (file: File[]) => void;
  /**
   * The file that has been selected.
   */
  file?: File | null;
}

export const FileInput = ({
  onFilesSelected,
  className,
  file,
  id,
  ...inputProps
}: FileInputProps) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const ensuredId = useId(id);

  return (
    <Root className={className}>
      <Input
        type="file"
        {...inputProps}
        id={ensuredId}
        onChange={(ev) => {
          if (ev.target.files) {
            onFilesSelected(Array.from(ev.target.files));
          }
        }}
        onFocus={() => setIsFocused(true)}
        onClick={() => setIsFocused(false)}
        onBlur={() => setIsFocused(false)}
      />
      <Label
        htmlFor={ensuredId}
        onDragEnter={(ev) => {
          ev.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(ev) => {
          ev.preventDefault();
          setIsDragOver(false);
        }}
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={(ev) => {
          ev.preventDefault();

          if (ev.dataTransfer.files) {
            onFilesSelected(Array.from(ev.dataTransfer.files));
          }

          setIsDragOver(false);
        }}
        isFocused={isFocused}
        isDragOver={isDragOver}
      >
        <LabelText>
          <Icon width={48} height={48} />
          {file ? (
            <div>
              <span>{file.name}</span> <BrandText>change file</BrandText>
            </div>
          ) : (
            <div>
              <BrandText>Upload a file</BrandText>
              <span> or drag and drop</span>
            </div>
          )}
        </LabelText>
      </Label>
    </Root>
  );
};

const Root = styled('div', {
  position: 'relative',
  padding: '$1',
});

const Input = styled('input', {
  srOnly: true,
});

const Icon = styled(UploadIcon, {
  display: 'inline-block',
  width: 48,
  height: 48,
  marginBottom: 32,
});

const Label = styled('label', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$8',
  borderRadius: '$lg',
  borderWidth: 2,
  borderStyle: 'dashed',
  color: '$gray-400',
  borderColor: '$gray-300',
  backgroundColor: 'White',
  cursor: 'pointer',
  variants: {
    isDragOver: {
      true: {
        backgroundColor: '$primary-100',
        borderColor: '$primary-500',
      },
    },
    isFocused: {
      true: {
        backgroundColor: '$gray-100',
      },
    },
  },
});

const LabelText = styled('div', {
  fontSize: '$sm',
  textAlign: 'center',
  maxWidth: '100%',
  pointerEvents: 'none',
});

const BrandText = styled('span', {
  color: '$primary-500',
});
