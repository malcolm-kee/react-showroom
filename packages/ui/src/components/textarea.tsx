import TextareaAutosize from 'react-textarea-autosize';
import { styled } from '../stitches.config';

export const Textarea = styled(TextareaAutosize, {
  width: '100%',
  resize: 'block',
  borderRadius: '$base',
  border: '1px solid $gray-300',
  outlineRing: '',
});
