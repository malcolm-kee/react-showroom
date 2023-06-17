import { SearchIcon as PlainSearchIcon } from '@heroicons/react/outline';
import { isDefined } from '@showroomjs/core';
import cx from 'classnames';
import { useCombobox } from 'downshift';
import * as React from 'react';
import { SpinIcon } from './icons';
import { spinAnimation } from './animations';
import { useStableCallback } from '../lib/use-stable-callback';
import { css, styled } from '../stitches.config';
import { Dialog } from './dialog';
import { ShortcutKey } from './shortcut-key';
import { TextHighlight } from './text-highlight';
import { TextInput } from './text-input';

export interface SearchDialogProps<T> {
  /**
   * callback when user select one of the result
   */
  onSelect: (selectedValue: T | null, searchTerm: string) => void;
  onHighlightedItemChange?: (highlightedItem: T) => void;
  options: Array<Option<T>>;
  searchHistories?: string[];
  placeholder?: string;
  className?: string;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
}

const SearchDialogImpl = function SearchDialog<T>(props: SearchDialogProps<T>) {
  return (
    <Dialog.Content
      aria-label="Search"
      showCloseBtn={false}
      css={{ maxHeight: 'none' }}
    >
      <SearchDialogInternal {...props} />
    </Dialog.Content>
  );
};

const SearchDialogInternal = function SearchDialog<T>(
  props: SearchDialogProps<T>
) {
  const [inputValue, setInputValue] = React.useState('');
  const trimmedInput = inputValue.trim();

  const onInputChange = useStableCallback(props.onInputChange);

  const { options } = props;

  React.useEffect(() => {
    onInputChange(trimmedInput);
  }, [trimmedInput]);

  const hasSearchTerm = trimmedInput !== '';

  const dismissDialog = React.useContext(DismissContext);

  const {
    isOpen: isResultsShown,
    highlightedIndex,
    getItemProps,
    getInputProps,
    getComboboxProps,
    getMenuProps,
  } = useCombobox({
    inputValue,
    isOpen: hasSearchTerm,
    selectedItem: null,
    items: hasSearchTerm ? options : [],
    itemToString: (i) => (i ? i.label : ''),
    onSelectedItemChange: (changes) => {
      if (hasSearchTerm) {
        setInputValue('');
        dismissDialog();
        props.onSelect(
          changes.selectedItem ? changes.selectedItem.value : null,
          trimmedInput
        );
      } else {
        if (changes.selectedItem) {
          setInputValue(changes.selectedItem.label);
        }
      }
    },
    onHighlightedIndexChange: (changes) => {
      if (
        isDefined(changes.highlightedIndex) &&
        changes.highlightedIndex > -1 &&
        props.onHighlightedItemChange
      ) {
        const item = options[changes.highlightedIndex];
        if (item) {
          props.onHighlightedItemChange(item.value);
        }
      }
    },
  });

  return (
    <SearchMenuRoot
      {...getComboboxProps({
        className: props.className,
      })}
    >
      <InputWrapper>
        <SearchIcon width={24} height={24} />
        <TextInput
          onValue={setInputValue}
          css={{
            paddingLeft: '$12',
            py: '$3',
          }}
          {...getInputProps({
            placeholder: props.placeholder,
          })}
        />
        {props.isLoading && (
          <LoadingWrapper>
            <SpinIcon
              aria-label="Updating..."
              css={{
                color: '$gray-500',
                animation: `${spinAnimation} 1s linear infinite`,
              }}
            />
          </LoadingWrapper>
        )}
        <Dialog.Close asChild>
          <ShortcutKey
            css={{
              position: 'absolute',
              right: '$3',
              top: '$4',
              display: 'none',
              '@md': {
                display: 'block',
              },
            }}
            as="button"
          >
            <kbd>
              <Abbr title="Escape">esc</Abbr>
            </kbd>
          </ShortcutKey>
        </Dialog.Close>
      </InputWrapper>
      {isResultsShown && options.length === 0 && (
        <NoResult>No results found.</NoResult>
      )}
      <Menu {...getMenuProps()}>
        {isResultsShown &&
          options.map((option, i) => {
            const highlighted = i === highlightedIndex;

            return (
              <Item key={i}>
                <OptionItem
                  {...getItemProps({
                    item: option,
                    index: i,
                  })}
                  highlighted={highlighted}
                >
                  {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
                  <OptionText>
                    <div>
                      <TextHighlight
                        textToHighlight={option.label}
                        searchWords={[trimmedInput]}
                        highlightClassName={
                          highlighted ? underline().className : undefined
                        }
                      />
                    </div>
                    {option.description && (
                      <Description>
                        <TextHighlight
                          textToHighlight={option.description}
                          searchWords={[trimmedInput]}
                          highlightClassName={
                            highlighted ? underline().className : undefined
                          }
                        />
                      </Description>
                    )}
                  </OptionText>
                </OptionItem>
              </Item>
            );
          })}
      </Menu>
    </SearchMenuRoot>
  );
};

const SearchMenuRoot = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  height: '100%',
});

const Menu = styled('ul', {
  flex: 1,
  margin: '0',
  padding: '0',
  listStyle: 'none',
  maxHeight: '70vh',
  overflowY: 'auto',
});

const Item = styled('li', {
  margin: 0,
  padding: 0,
  width: '100%',
});

type Dismiss = () => void;

const DismissContext = React.createContext<Dismiss>(() => {
  /* noop */
});

const SearchDialogRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dismisss = React.useCallback(() => setIsOpen(false), []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        // The `Cmd+K` shortcut both opens and closes the modal.
        event.key === 'k' &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setIsOpen((o) => !o);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <DismissContext.Provider value={dismisss}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Dialog>
    </DismissContext.Provider>
  );
};

export const SearchDialog = Object.assign(SearchDialogImpl, {
  Trigger: function SearchDialogTrigger({
    children,
    className,
    ...props
  }: { children: React.ReactNode } & React.ComponentPropsWithoutRef<'button'>) {
    return (
      <Dialog.Trigger asChild>
        <TextInput
          as="button"
          className={cx(triggerInput({}), className)}
          css={{
            color: '$gray-400',
            height: 38,
            width: 38,
            borderRadius: '$full',
            px: '$1',
            justifyContent: 'center',
            '@md': {
              width: 'auto',
              borderRadius: '$base',
              px: '$3',
              justifyContent: 'start',
            },
          }}
          {...props}
        >
          <PlainSearchIcon width={16} height={16} />
          {children}
          <ShortcutKey
            css={{
              display: 'none',
              '@md': {
                display: 'block',
              },
            }}
          >
            <Kbd>
              <Abbr title="Command">⌘</Abbr>
            </Kbd>
            <Kbd>K</Kbd>
          </ShortcutKey>
        </TextInput>
      </Dialog.Trigger>
    );
  },
  Root: SearchDialogRoot,
});

export interface Option<T> {
  label: string;
  value: T;
  description?: string;
  metadata?: string | string[];
  icon?: React.ReactNode;
}

const InputWrapper = styled('div', {
  position: 'relative',
  backgroundColor: 'White',
});

const SearchIcon = styled(PlainSearchIcon, {
  position: 'absolute',
  left: '$3',
  top: 14,
  color: '$primary-300',
  '@md': {
    top: '$3',
  },
});

const OptionIcon = styled('div', {
  flexShrink: 0,
  color: '$gray-400',
});

const OptionText = styled('div', {
  flex: 1,
  minWidth: 0,
});

const Kbd = styled('kbd', {
  fontFamily: '$sans',
});

const Description = styled('div', {
  color: '$gray-500',
  fontSize: '$sm',
  lineHeight: '$sm',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const OptionItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  px: '$3',
  py: '$2',
  color: 'Black',
  cursor: 'pointer',
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$primary-700',
        color: 'White',
        [`& ${Description}`]: {
          color: '$gray-200',
        },
        [`& ${OptionIcon}`]: {
          color: '$gray-200',
        },
      },
    },
  },
});

const NoResult = styled('div', {
  color: '$gray-600',
  py: '$6',
  textAlign: 'center',
});

const Abbr = styled('abbr', {
  textDecoration: 'none',
});

const triggerInput = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  '&:focus-visible svg': {
    color: '$primary-400',
  },
  [`&:focus-visible ${Kbd}`]: {
    color: '$primary-400',
  },
});

const LoadingWrapper = styled('div', {
  position: 'absolute',
  top: 13,
  right: '$3',
  '@md': {
    right: '$14',
  },
});

const underline = css({
  textDecoration: 'underline',
  backgroundColor: 'inherit',
  color: 'inherit',
});
