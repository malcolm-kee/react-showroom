import * as TabsPrimitive from '@radix-ui/react-tabs';
import { styled } from '../stitches.config';

export const Tabs = Object.assign({}, TabsPrimitive, {
  List: styled(TabsPrimitive.List, {
    position: 'relative',
    top: 1,
  }),
  Trigger: styled(TabsPrimitive.Trigger, {
    all: 'unset',
    cursor: 'pointer',
    fontSize: '$sm',
    lineHeight: '$sm',
    px: '$2',
    py: '$1',
    backgroundColor: 'inherit',
    borderTop: '1px solid',
    borderLeft: '1px solid',
    borderRight: '1px solid',
    borderColor: 'transparent',
    borderBottom: '1px solid $gray-300',
    borderTopLeftRadius: '$base',
    borderTopRightRadius: '$base',
    outlineRing: '',
    '&[data-state="active"]': {
      backgroundColor: '$gray-200',
      color: '$primary-800',
      borderColor: '$gray-300',
      borderBottomColor: 'transparent',
    },
  }),
  Content: styled(TabsPrimitive.Content, {
    backgroundColor: '$gray-200',
    border: '1px solid $gray-300',
    borderTopRightRadius: '$base',
    borderBottomRightRadius: '$base',
    borderBottomLeftRadius: '$base',
  }),
  RawList: TabsPrimitive.List,
  RawTrigger: TabsPrimitive.Trigger,
  RawContent: TabsPrimitive.Content,
});
