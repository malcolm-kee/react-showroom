import { SearchIcon as PlainSearchIcon } from '@heroicons/react/outline';
import { useCombobox } from 'downshift';
import { matchSorter } from 'match-sorter';
import * as React from 'react';
import cx from 'classnames';
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
  options: Array<Option<T>>;
  searchHistories?: string[];
  placeholder?: string;
}

const SearchDialogImpl = function SearchDialog<T extends unknown>(
  props: SearchDialogProps<T>
) {
  return (
    <Dialog.Content aria-label="Search" showCloseBtn={false}>
      <SearchDialogInternal {...props} />
    </Dialog.Content>
  );
};

const SearchDialogInternal = function SearchDialog<T extends unknown>(
  props: SearchDialogProps<T>
) {
  const [inputValue, setInputValue] = React.useState('');
  const trimmedInput = inputValue.trim();

  const options = React.useMemo(
    () =>
      trimmedInput ? sortOptions(props.options, trimmedInput) : props.options,
    [props.options, trimmedInput]
  );

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
  });

  return (
    <div {...getComboboxProps()}>
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
          options.map((option, i) => (
            <li key={i}>
              <OptionItem
                {...getItemProps({
                  item: option,
                  index: i,
                })}
                highlighted={i === highlightedIndex}
              >
                <div>
                  <TextHighlight
                    textToHighlight={option.label}
                    searchWords={[trimmedInput]}
                  />
                </div>
                {option.description && (
                  <Description>
                    <TextHighlight
                      textToHighlight={option.description}
                      searchWords={[trimmedInput]}
                    />
                  </Description>
                )}
              </OptionItem>
            </li>
          ))}
      </Menu>
    </div>
  );
};

const Menu = styled('ul', {
  margin: '0',
  padding: '0',
  listStyle: 'none',
});

type Dismiss = () => void;

const DismissContext = React.createContext<Dismiss>(() => {});

const SearchDialogRoot = (props: { children: React.ReactNode }) => {
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
      <Dialog open={isOpen} onOpenChange={setIsOpen} {...props} />
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
            width: 'auto',
            color: '$gray-400',
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
}

const InputWrapper = styled('div', {
  position: 'relative',
});

const SearchIcon = styled(PlainSearchIcon, {
  position: 'absolute',
  left: '$3',
  top: '$3',
  color: '$primary-300',
});

const OptionItem = styled('div', {
  px: '$3',
  py: '$2',
  cursor: 'pointer',
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$gray-100',
      },
    },
  },
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

const sortOptions = <T extends unknown>(
  options: Array<Option<T>>,
  searchText: string
) =>
  matchSorter(options, searchText, {
    keys: ['label', 'description', 'metadata'],
  });
