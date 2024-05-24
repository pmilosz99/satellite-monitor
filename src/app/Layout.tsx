import { ChangeEvent, FC, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { 
    Box,
    Button,
    Center, 
    Container, 
    Divider, 
    Flex, 
    Grid, 
    GridItem, 
    Heading, 
    IconButton, 
    Link as ChakraLink,
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Spacer, 
    Stack,
    Text,
    useColorMode,
    chakra,
    Tag,
    Input,
    InputLeftElement,
    InputGroup,
    List,
    CloseButton,
    Kbd,
    InputRightElement,
    useStyleConfig,
    Spinner,
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons'
import { Link as RouterLink, Outlet, To } from "react-router-dom";
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';

import { T } from "./shared/components";
import { LocationDisplay } from "./features/user-location/components";

import { useMap, useTranslation } from "./shared/hooks";

import { currentTheme, language, tle } from "./shared/atoms";
import { LANGUAGE_VALUES } from "./shared/dict-translation";
import { routes } from "./shared/routes";
import { getJsonTle } from "./shared/utils/getJsonTle";

import { MAIN_GRADIENT, MAIN_GRADIENT_COLOR, THEME_TYPE } from "./shared/themes";
import { plFlag, gbFlag } from '../assets/icons';

const Logo = () => (
    <RouterLink to="/">
        <Box pl={'38px'}>
            <Flex>
                <Heading size='md'>
                    Satellite
                </Heading>
                <Box paddingTop={'3px'} paddingLeft={'5px'}>
                    <SatelliteAltOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
            </Flex>
            <Heading bgGradient={MAIN_GRADIENT} bgClip='text' size='md' paddingLeft={6}>
                Monitor
            </Heading>
        </Box>
    </RouterLink>
)

const AddFlag = ({ flag }: { flag: IMenuItems['icon'] }) => (
    <Box h='20px' w='20px' paddingTop={1}>
        {flag}
    </Box>
)

interface IMenuItems {
    icon: JSX.Element;
    displayValue: string;
    value: LANGUAGE_VALUES;
}

const menuItems: IMenuItems[] = [
    {
        icon: <AddFlag flag={gbFlag} />,
        displayValue: 'EN',
        value: LANGUAGE_VALUES.EN,
    },
    {
        icon: <AddFlag flag={plFlag} />,
        displayValue: 'PL',
        value: LANGUAGE_VALUES.PL,
    },
];

const LanguageMenu = () => {
    const [lng, setLanguage] = useAtom(language);

    const menuItem = menuItems.find((item) => item.value === lng);

    return (
        <Menu>
            <MenuButton as={Button} leftIcon={menuItem?.icon} rightIcon={<ChevronDownIcon />} variant='outline'>
                {menuItem?.displayValue}
            </MenuButton>
            <MenuList zIndex={999}>
                {menuItems.map((item) => (
                    <MenuItem key={item.value} icon={item.icon} onClick={() => setLanguage(item.value)}>
                        {item.displayValue}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    )
};

const ThemeChanger = () => {
    const {colorMode, toggleColorMode } = useColorMode();
    const setTheme = useSetAtom(currentTheme);
    
    const handleClik = () => {
        toggleColorMode();
        setTheme(colorMode === THEME_TYPE.DARK ? THEME_TYPE.LIGHT : THEME_TYPE.DARK);
        /**
         * We have to use both solutions (useColorMode and atom value) 
         * because useColorMode dont working 
         * (is undefined in App component)
         */
    }

    return (
        <IconButton 
                variant='outline'
                aria-label="theme-changer"
                onClick={handleClik}
                icon={colorMode === THEME_TYPE.DARK ? <SunIcon /> : <MoonIcon />}
            />
    )
}

const RightComponentsContainer = () => (
    <Center>
        <Stack direction="row" spacing='10px' paddingRight={4}>
            <LanguageMenu />
            <ThemeChanger />
            <LocationDisplay />
        </Stack>
    </Center>
);

const KeyboardKeySearchBarOpen = () => (
    <span>
        <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
    </span>
);


interface ISearchBarMenu {
    isOpen: boolean;
    inputGroupRef: RefObject<HTMLDivElement>;
    items: Record<string, string | number>[];
    onClose: () => void;
    onClick: () => void;
}

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
        <Box ref={containerRef} __css={styles} mt={2} zIndex="999" borderRadius="6px" maxH="50vh" w="20vw" sx={{position: 'absolute', overflowY: 'auto'}}>
                <List>
                    {isOpen && (
                        <Stack p={3}>
                            {items.map((item) => (
                                <ChakraLink key={item.noradId} as={RouterLink} to={routes.satellite.item.goTo(`${item.noradId}`)} onClick={handleClickItem}>{item.name}</ChakraLink>
                            ))}
                    </Stack>
                    )}
                </List>
        </Box>
    )
}

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputGroupRef = useRef<HTMLDivElement>(null);

    const placeholder = useTranslation('searchSatellite') as string;

    const tleQuery = useAtomValue(tle);

    const json = getJsonTle(tleQuery?.data || '');

    const filterSatellites = () => {
        const matchedItems = json?.filter(({ name }) => {
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
        if (tleQuery?.isLoading) return (
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

    const results = useMemo(filterSatellites, [json, inputValue]);

    useEffect(addKeydownListeners, [isMenuOpen]);

    return (
        <Box m="0 10px 0 10px" w="20vw">
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

const DevVersion = () => (
    <Tag variant="subtle" ml={5} mr={5} color={MAIN_GRADIENT_COLOR}>
        <T dictKey="devVersion" />
    </Tag>
);

const Header = () => (
    <chakra.header height="100%" width="100%">
        <Flex h={'100%'} w='100%'>
            <Center>
                <Logo />
            </Center>
            <Box h={'100%'} p={'10px 0 10px 45px'} >
                <Divider orientation='vertical' />
            </Box>
            <Center>
                <DevVersion />
            </Center>
            <Center>
                <SearchBar />
            </Center>
            <Spacer />
            <RightComponentsContainer />
        </Flex>
        <Divider />
    </chakra.header>

);

const MenuLink = ({ to, children }: {to: To, children: ReactNode }) => (
    <ChakraLink as={RouterLink} to={to} _hover={{ color: MAIN_GRADIENT_COLOR }}>{children}</ChakraLink>
)

const Sidebar = () => {
    return (
        <chakra.nav height="100%" width="100%">
            <Stack direction='row' h='100%' w='100%' paddingLeft={4} paddingBottom={2.5} paddingTop={2.5}>
                <Container centerContent p={0} pt={4}>
                    <Text as='b'>
                        <T dictKey="database" />
                    </Text>
                    <MenuLink to={routes.satellite.list.starlink}>
                        Starlink
                    </MenuLink>
                    <MenuLink to={routes.satellite.list.oneWeb}>
                        OneWeb
                    </MenuLink>
                    <MenuLink to={routes.satellite.list.amateurSatellites}>
                        <T dictKey="amateurRadio" />
                    </MenuLink>
                    <MenuLink to={routes.satellite.list.spaceStation}>
                        <T dictKey="spaceStations" />
                    </MenuLink>
                    <MenuLink to={routes.satellite.list.allSatellites}>
                        <T dictKey="activeSatellites" />
                    </MenuLink>
                    <Text as='b' paddingTop={4}>
                        <T dictKey="futureFeatures" />
                    </Text>
                    <Text color='#b0b0b1'>
                        <T dictKey="satellitesAbove" />
                    </Text>
                    <Text color='#b0b0b1'>
                        <T dictKey="map" />
                    </Text>
                    <Text color='#b0b0b1'>
                        <T dictKey="map3d" /> 
                    </Text>
                </Container>
                <Spacer />
                <Divider orientation='vertical' />
            </Stack>
        </chakra.nav>
    )
};

const Footer = () => (
    <chakra.footer paddingRight={5} paddingLeft={5}>
        <Divider />
        <Flex p={1}>
            <Text fontSize="xs">
                <T dictKey="developedAndMainted" />
                <ChakraLink fontSize="xs" href="https://linkedin.com/in/piotr-milosz" isExternal color={MAIN_GRADIENT_COLOR}>Piotr Miłosz</ChakraLink>
            </Text>
            <Spacer />
            <Text fontSize="xs">© {new Date().getFullYear()} satellite-monitor.com</Text>
        </Flex>
    </chakra.footer>
);

const Main = () => (
    <chakra.main height="100%" width="100%">
        <Outlet />
    </chakra.main>
);

export const Layout = () => {
    const HEADER_HEIGHT = '60px';
    const FOOTER_HEIGHT = '30px';
    const NAV_WIDTH = '185px';

    return (
        <Grid
            templateAreas={`"header header" "nav main" "nav footer"`}
            h={'100vh'}
            gridTemplateRows={`${HEADER_HEIGHT} auto ${FOOTER_HEIGHT}`}
            gridTemplateColumns={`${NAV_WIDTH} auto`}
            overflowY="auto"
        >
            <GridItem area={'header'}>{<Header />}</GridItem>
            <GridItem area={'nav'}>{<Sidebar />}</GridItem>
            <GridItem area={'main'} overflowX={'auto'}>{<Main />}</GridItem>
            <GridItem area={'footer'}>{<Footer />}</GridItem>
        </Grid>
    );
}