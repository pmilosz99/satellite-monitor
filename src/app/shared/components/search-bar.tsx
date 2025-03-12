import {
    Box,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    CloseButton,
    Spinner,
    useStyleConfig,
    List,
    Stack,
    BoxProps,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  import {
    useState,
    useRef,
    useEffect,
    ChangeEvent,
    useMemo,
    RefObject,
  } from "react";
  
  interface SearchBarMenuProps<T> {
    isOpen: boolean;
    inputGroupRef: RefObject<HTMLDivElement>;
    items: T[];
    renderItem: (item: T, onClick: () => void) => React.ReactNode;
    onClose: () => void;
  }
  
  const SearchBarMenu = <T,>({
    isOpen,
    inputGroupRef,
    items,
    renderItem,
    onClose,
  }: SearchBarMenuProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const styles = useStyleConfig("SearchBarMenu");
  
    useEffect(() => {
      const onClickOutsideListener = ({ target }: MouseEvent): void => {
        if (
          !containerRef.current ||
          !inputGroupRef.current ||
          containerRef.current.contains(target as Node) ||
          inputGroupRef.current.contains(target as Node)
        )
          return;
        onClose();
      };
  
      const onClickEsc = ({ key }: KeyboardEvent): void => {
        if (key !== "Escape") return;
        onClose();
      };
  
      document.addEventListener("mousedown", onClickOutsideListener);
      document.addEventListener("keydown", onClickEsc);
  
      return () => {
        document.removeEventListener("mousedown", onClickOutsideListener);
        document.removeEventListener("keydown", onClickEsc);
      };
    }, [onClose, inputGroupRef]);
  
    return (
      <Box
        ref={containerRef}
        __css={styles}
        mt={2}
        zIndex="999"
        borderRadius="6px"
        maxH="50vh"
        w={`${inputGroupRef.current?.clientWidth}px`}
        sx={{ position: "absolute", overflowY: "auto" }}
      >
        <List>
          {isOpen && (
            <Stack p={3}>
              {items.map((item, index) => {
                const handleClick = () => {
                  onClose();
                };
                return (
                  <Box key={index} onClick={handleClick}>
                    {renderItem(item, () => handleClick())}
                  </Box>
                );
              })}
            </Stack>
          )}
        </List>
      </Box>
    );
  };
  
  interface SearchBarProps<T> extends BoxProps {
    data: T[];
    filterFunction?: (item: T, searchValue: string) => boolean;
    renderItem: (item: T, onClick: () => void) => React.ReactNode;
    onItemSelect?: (item: T) => void;
    placeholder?: string;
    isLoading?: boolean;
  }
  
  export const SearchBar = <T,>({
    data,
    filterFunction,
    renderItem,
    onItemSelect,
    placeholder = "Search...",
    isLoading,
    ...props
  }: SearchBarProps<T>) => {
    const [inputValue, setInputValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputGroupRef = useRef<HTMLDivElement>(null);
  
    // Domyślna funkcja filtrowania przy założeniu, że element posiada pole "name"
    const defaultFilterFunction = (item: T, searchValue: string) => {
      const itemString = JSON.stringify(item).toLowerCase();
      return itemString.includes(searchValue.toLowerCase());
    };
  
    const filterFn = filterFunction || defaultFilterFunction;
  
    const filteredResults = useMemo(() => {
      if (!inputValue) return [];
      return data.filter((item) => filterFn(item, inputValue)).slice(0, 18);
    }, [data, inputValue, filterFn]);
  
    const handleChangeInput = ({
      target: { value },
    }: ChangeEvent<HTMLInputElement>): void => {
      setInputValue(value);
      setIsMenuOpen(!!value);
    };
  
    const closeMenu = (): void => {
      setIsMenuOpen(false);
    };
  
    const handleItemClick = (item: T) => {
      setInputValue("");
      setIsMenuOpen(false);
      onItemSelect?.(item);
    };
  
    const onClickCloseButton = (): void => {
      if (!inputRef.current) return;
      setInputValue("");
      setIsMenuOpen(false);
      inputRef.current.focus();
    };
  
    const renderRightElement = () => {
      if (isLoading)
        return (
          <InputRightElement pt="1px">
            <Spinner size="sm" />
          </InputRightElement>
        );
  
      if (inputValue)
        return (
          <InputRightElement>
            <CloseButton onClick={onClickCloseButton} />
          </InputRightElement>
        );
  
      return null;
    };
  
    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (!inputRef.current) return;
        if (event.ctrlKey && event.key.toLowerCase() === "k") {
          event.preventDefault();
          inputRef.current.focus();
        }
      };
  
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }, []);
  
    return (
      <Box {...props}>
        <InputGroup ref={inputGroupRef}>
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input
            ref={inputRef}
            variant="filled"
            placeholder={placeholder}
            onChange={handleChangeInput}
            value={inputValue}
          />
          {renderRightElement()}
        </InputGroup>
        <SearchBarMenu
          inputGroupRef={inputGroupRef}
          isOpen={isMenuOpen && filteredResults.length > 0}
          onClose={closeMenu}
          items={filteredResults}
          renderItem={(item) => (
            // Wywołujemy handleItemClick by przekazać element do rodzica
            <Box onClick={() => handleItemClick(item)}>
              {renderItem(item, () => handleItemClick(item))}
            </Box>
          )}
        />
      </Box>
    );
  };
  