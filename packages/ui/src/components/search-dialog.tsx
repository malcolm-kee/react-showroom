import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/20/solid';
import { isDefined } from '@showroomjs/core';
import { useCombobox } from 'downshift';
import * as React from 'react';
import { tw } from '../lib/tw';
import { useStableCallback } from '../lib/use-stable-callback';
import { Dialog } from './dialog';
import { SpinIcon } from './icons';
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
    <div
      {...getComboboxProps({
        className: tw(['flex flex-col h-full'], [props.className]),
      })}
    >
      <div className={tw(['relative bg-white'])}>
        <SearchIcon
          width={24}
          height={24}
          className={tw([
            'absolute left-3 top-1/2 -translate-y-1/2 text-primary-300',
          ])}
        />
        <TextInput
          onValue={setInputValue}
          className={tw(['pl-12 py-3'])}
          {...getInputProps({
            placeholder: props.placeholder,
          })}
        />
        {props.isLoading && (
          <div
            className={tw([
              'absolute top-1/2 -translate-y-1/2 right-3 md:right-14',
            ])}
          >
            <SpinIcon
              className={tw(['text-zinc-500 animate-spin'])}
              aria-label="Updating..."
            />
          </div>
        )}
        <Dialog.Close asChild>
          <ShortcutKey
            className={tw([
              'hidden md:block absolute top-1/2 -translate-y-1/2 right-3 hover:text-zinc-500',
            ])}
            render={(props) => <button type="button" {...props} />}
          >
            <Kbd>
              <abbr title="Escape" className={tw(['no-underline'])}>
                esc
              </abbr>
            </Kbd>
          </ShortcutKey>
        </Dialog.Close>
      </div>
      {isResultsShown && options.length === 0 && (
        <div className={tw(['text-sm py-6 text-center text-zinc-600'])}>
          No results found.
        </div>
      )}
      <ul
        {...getMenuProps({
          className: tw([
            'flex-1 m-0 p-0 list-none max-h-[70vh] overflow-y-auto',
          ]),
        })}
      >
        {isResultsShown &&
          options.map((option, i) => {
            const highlighted = i === highlightedIndex;

            return (
              <li className={tw(['m-0 p-0 w-full'])} key={i}>
                <div
                  {...getItemProps({
                    item: option,
                    index: i,
                    className: tw([
                      'group/option flex items-center gap-2 px-3 py-2 cursor-pointer',
                      highlighted
                        ? 'bg-primary-700 text-white'
                        : 'text-zinc-900',
                    ]),
                  })}
                  data-highlighted={highlighted}
                >
                  {option.icon && (
                    <div
                      className={tw([
                        'flex-shrink-0 text-zinc-400 group-data-[highlighted=true]/option:text-zinc-200',
                      ])}
                    >
                      {option.icon}
                    </div>
                  )}
                  <div className={tw(['flex-1 min-w-0'])}>
                    <div className={tw(['sm:text-sm'])}>
                      <TextHighlight
                        textToHighlight={option.label}
                        searchWords={[trimmedInput]}
                        highlightClassName={
                          highlighted ? underlineClass : undefined
                        }
                      />
                    </div>
                    {option.description && (
                      <div
                        className={tw([
                          'text-xs text-zinc-500 truncate group-data-[highlighted=true]/option:text-zinc-200',
                        ])}
                      >
                        <TextHighlight
                          textToHighlight={option.description}
                          searchWords={[trimmedInput]}
                          highlightClassName={
                            highlighted ? underlineClass : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

type Dismiss = () => void;

const DismissContext = React.createContext<Dismiss>(() => {
  /* noop */
});

const SearchDialogRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dismiss = React.useCallback(() => setIsOpen(false), []);

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
    <DismissContext.Provider value={dismiss}>
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
        <button
          type="button"
          className={tw(
            [
              'form-input flex justify-center items-center gap-2 w-[38px] h-[38px] text-zinc-400 rounded-full px-1',
              'md:justify-start md:w-auto md:rounded md:px-3',
            ],
            [className]
          )}
          {...props}
        >
          <SearchIcon width={16} height={16} />
          {children}
          <ShortcutKey className={tw(['hidden md:block'])}>
            <Kbd>
              <abbr title="Command" className={tw(['no-underline'])}>
                ⌘
              </abbr>
            </Kbd>
            <Kbd>K</Kbd>
          </ShortcutKey>
        </button>
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

const Kbd = (props: { children: React.ReactNode }) => (
  <kbd {...props} className={tw(['font-sans'])} />
);

const underlineClass = tw(['underline bg-inherit text-inherit']);
