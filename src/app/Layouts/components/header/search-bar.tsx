import { ChangeEvent, FC, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useJsonTle, useMap, useTranslation } from "../../../shared/hooks";
import { Box, ChakraComponent, CloseButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Link, List, Spinner, Stack, useStyleConfig } from "@chakra-ui/react";
import { routes } from "../../../shared/routes";
import { Link as RouterLink } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

interface ISearchBarMenu{
    isOpen: boolean;
    inputGroupRef: RefObject<HTMLDivElement>;
    items: Record<string, string | number>[];
    onClose: () => void;
    onClick: () => void;
}

const KeyboardKeySearchBarOpen = () => (
    <span>
        <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
    </span>
);

const SearchBarMenu: FC<ISearchBarMenu> = ({ isOpen, onClose, onClick, inputGroupRef, items }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const map = useMap();

    const styles = useStyleConfig('SearchBarMenu');

    const handleClickItem = (): void => {
        onClick();
        onClose();
        map?.getView().setZoom(0);
    };

    const handleAddListeners = (): (() => void) => {
        const onClickOutsideListener = ({ target }: MouseEvent): void => {
            if (!containerRef.current || !inputGroupRef.current) return;
        
            if (!containerRef.current.contains(target as Node) && !inputGroupRef.current.contains(target as Node)) {
                onClose();
            }
        };

        const onClickEsc = ({ key }: KeyboardEvent): void => {
            if (key !== 'Escape') return;

            onClose();
        };

        document.addEventListener("mousedown", onClickOutsideListener);
        document.addEventListener('keydown', onClickEsc);

        
        return () => {
          document.removeEventListener("mousedown", onClickOutsideListener);
          document.removeEventListener("keydown", onClickEsc);
        };
    };

    useEffect(handleAddListeners, [onClose, inputGroupRef]);

    return (
        <Box ref={containerRef} __css={styles} mt={2} zIndex="999" borderRadius="6px" maxH="50vh" w={`${inputGroupRef.current?.clientWidth}px`} sx={{position: 'absolute', overflowY: 'auto'}}>
                <List>
                    {isOpen && (
                        <Stack p={3}>
                            {items.map((item) => (
                                <Link key={item.noradId} as={RouterLink} to={routes.satellite.item.goTo(`${item.noradId}`)} onClick={handleClickItem}>{item.name}</Link>
                            ))}
                    </Stack>
                    )}
                </List>
        </Box>
    )
}

export const SearchBar: ChakraComponent<"div", object> = ({ ...props }) => {
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputGroupRef = useRef<HTMLDivElement>(null);
    const tleJSON = useJsonTle();

    const placeholder = useTranslation('searchSatellite') as string;

    const filterSatellites = () => {
        if (!tleJSON) return;
        
        const matchedItems = tleJSON.data.filter(({ name }) => {
            const nameValue = name.toLowerCase();
            const searchValue = inputValue.toLowerCase();
    
            return nameValue.includes(searchValue);
        });    

        return matchedItems?.splice(0, 18);
    };

    const handleChangeInput = ({target: { value }}: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(value);
        setIsMenuOpen(!!value);
    };

    const closeMenu = (): void => {
        setIsMenuOpen(false);
    };

    const onClickMenu = (): void => {
        setInputValue('');
    };

    const onClickCloseButton = (): void => {
        if (!inputRef.current) return;

        setInputValue('');
        setIsMenuOpen(false);
        inputRef.current.focus();
    };

    const addKeydownListeners = (): (() => void) => {
        let keyPressedCache = '';

        const onClickOpenSearchBar = (event: KeyboardEvent) => {
            if (!inputRef.current) return;
            
            if (keyPressedCache === 'Control' && event.key === 'k') {
                event.preventDefault();
                inputRef.current.focus();
            }
            keyPressedCache = event.key;
        };

        const onClickEsc = ({ key }: KeyboardEvent) => {
            if (!inputRef.current || isMenuOpen) return;

            if (key === 'Escape') {
                inputRef.current.blur();
            }
        };

        document.addEventListener('keydown', onClickOpenSearchBar);
        document.addEventListener('keydown', onClickEsc);

        return () => {
            document.removeEventListener('keydown', onClickOpenSearchBar);
            document.removeEventListener('keydown', onClickEsc);   
        }
    };

    const renderRightElement = () => {
        if (tleJSON?.isLoading) return (
            <InputRightElement pt="1px">
                <Spinner size='sm' />
            </InputRightElement>
        )

        if (inputValue) return (
            <InputRightElement>
                <CloseButton onClick={onClickCloseButton} />
            </InputRightElement>
        )
        
        return (
            <InputRightElement width="7rem" pb='2px'>
                <KeyboardKeySearchBarOpen />
            </InputRightElement>
        )
    }

    const results = useMemo(filterSatellites, [tleJSON, inputValue]);

    useEffect(addKeydownListeners, [isMenuOpen]);

    return (
        <Box {...props}>
            <InputGroup ref={inputGroupRef}>
                <InputLeftElement>
                    <SearchIcon />
                </InputLeftElement>
                <Input ref={inputRef} variant='filled' placeholder={placeholder} onChange={handleChangeInput} value={inputValue}/>
                {renderRightElement()}
            </InputGroup>
            <SearchBarMenu inputGroupRef={inputGroupRef} isOpen={isMenuOpen && !!results?.length} onClose={closeMenu} onClick={onClickMenu} items={results || []} />
        </Box>
    )
};