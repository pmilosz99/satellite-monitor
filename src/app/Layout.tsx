import { 
    Box, 
    Center, 
    chakra, 
    Divider, 
    Flex, 
    Grid, 
    GridItem, 
    Heading, 
    Link as ChakraLink, 
    Spacer, 
    Stack, 
    StackProps, 
    Text, 
    useStyleConfig, 
    Kbd, 
    ChakraComponent, 
    InputRightElement, 
    Spinner, 
    CloseButton, 
    InputGroup, 
    InputLeftElement, 
    Input, 
    LinkProps, 
    List,
    useColorMode,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    Button,
    MenuItem,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent,
    DrawerBody,
    VStack
} from "@chakra-ui/react";
import { T } from "./shared/components";
import { Outlet, To, Link as RouterLink } from "react-router-dom";
import { 
    ChangeEvent, 
    FC, 
    Fragment, 
    ReactNode, 
    RefObject, 
    useEffect, 
    useMemo, 
    useRef, 
    useState 
} from 'react';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { routes } from "./shared/routes";
import StorageIcon from '@mui/icons-material/Storage';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import { MAIN_GRADIENT, MAIN_GRADIENT_COLOR, THEME_TYPE } from "./shared/themes";
import { useJsonTle, useMap, useTranslation } from "./shared/hooks";
import { ChevronDownIcon, HamburgerIcon, MoonIcon, SearchIcon, SunIcon } from "@chakra-ui/icons";
import { useAtom, useSetAtom } from "jotai";
import { currentTheme, language } from "./shared/atoms";
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';
import { LANGUAGE_VALUES } from "./shared/dict-translation";
import { gbFlag, plFlag } from "../assets/icons";
import { LocationDisplay } from "./features/user-location/components";
import { v4 as uuidv4 } from 'uuid';

const HamburgerMenu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <Box>
          <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant='outline'
              aria-label="Open Menu"
          />
        <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody p='45px 0 30px 0'>
              <VStack spacing={0}>
                {
                  MENU_ITEMS.map((section, index) => {
                    const key = uuidv4();

                    return (
                        <Fragment key={key}>
                            <TitleSection id={`${section.title}-${key}`} Icon={section.icon} title={section.title} route={section.route} onClick={onClose} underline={index !== 0} />
                            <Divider mb={2} mt={2} />
                            {
                                section.children ? (
                                section.children.map((sectionItem, index, array) => (
                                    <Fragment key={sectionItem.route}>
                                        <MenuLink id={`${sectionItem.route}-${key}`} to={sectionItem.route} mb={index === array.length - 1 ? 3 : 0} borderBottom="solid 1px" onClick={onClose}>
                                            <T dictKey={sectionItem.title} />
                                        </MenuLink>
                                        {index === array.length - 1 ? <Divider mb={1} /> : null}
                                    </Fragment>
                                ))
                                ) : null
                            }
                        </Fragment> 
                    )
                  })
                }
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };

const MobileHeader = () => (
    <chakra.header height="100%" width="100%">
        <Flex direction="column" height="100%" width="100%">
            <Flex h='100%' w='100%'>
                <Center>
                    <Logo pl={2} pr={2} pt={1} pb={1}/>
                </Center>
                <Spacer />
                <Center>
                    <Stack direction="row" spacing='10px' paddingRight={5}>
                        <LanguageMenu />
                        <ThemeChanger />
                        <LocationDisplay />
                        <HamburgerMenu />
                    </Stack>
             </Center>
            </Flex>
            <Divider />
            <SearchBar mt={2.5} mb={2.5} ml={5} mr={5} />
        </Flex>
        <Divider />
    </chakra.header>
);

interface IMenuItems {
    icon: JSX.Element;
    displayValue: string;
    value: LANGUAGE_VALUES;
}

const AddFlag = ({ flag }: { flag: IMenuItems['icon'] }) => (
    <Box h='20px' w='20px' paddingTop={1}>
        {flag}
    </Box>
)

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

const Logo: ChakraComponent<"div", object> = ({ ...props }) => (
    <RouterLink to="/">
        <Box {...props}>
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
);

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
                                <ChakraLink key={item.noradId} as={RouterLink} to={routes.satellite.item.goTo(`${item.noradId}`)} onClick={handleClickItem}>{item.name}</ChakraLink>
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

const Header = () => (
    <chakra.header height="100%" width="100%">
        <Flex h={'100%'} w='100%'>
            <Center>
                <Logo pl={'38px'} pr={'45px'} />
            </Center>
            <Box h={'100%'} p={'10px 0 10px 0'} >
                <Divider orientation='vertical' />
            </Box>
            <Center>
                <SearchBar m="10px 10px 10px 20px" w="25vw"/>
            </Center>
            <Spacer />
            <Center>
                <Stack direction="row" spacing='10px' paddingRight={4}>
                    <LanguageMenu />
                    <ThemeChanger />
                    <LocationDisplay />
                </Stack>
            </Center>
        </Flex>
        <Divider />
    </chakra.header>
);

interface IMenuLink extends LinkProps {
    id: string;
    to: To;
    children: ReactNode;
}

const MenuLink: FC<IMenuLink> = ({ id, to, children, ...props }) => (
    <ChakraLink key={id} as={RouterLink} to={to} _hover={{ color: MAIN_GRADIENT_COLOR }} {...props}>
        {children}
    </ChakraLink>
);

interface ITitleSection extends StackProps {
    id: string;
    title: string;
    Icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
        muiName: string;
    }
    route?: To,
    onClick?: () => void;
    underline?: boolean;
}

const TitleSection: FC<ITitleSection> = ({ id, Icon, title, route, onClick, underline }) => {
    console.log(id);
    return (
        <Stack key={id} direction="row" alignItems="center">
            <Icon fontSize="small"/>
            {
                route ? (
                    <Text as='b' mr={5}>
                        <MenuLink id={id} to={route} onClick={onClick} borderBottom={underline ? 'solid 1px' : ''}>
                            <T dictKey={title} />
                        </MenuLink>
                    </Text>
                ) : (
                    <Text key={id} as='b' mr={5}>
                        <T dictKey={title} />
                    </Text>
                )
            }
        </Stack>
    )
};

interface ISectionItem {
    title: string;
    route: string;
}

interface ISection {
    title: string;
    icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
        muiName: string;
    }
    route?: To;
    children?: ISectionItem[];
    isAlignBottom?: boolean;
}

const MENU_ITEMS: ISection[] = [
    {
        title: 'database',
        icon: StorageIcon,
        children: [
            {
                title: 'starlink',
                route: routes.satellite.list.starlink,
            },
            {
                title: 'oneWeb',
                route: routes.satellite.list.oneWeb,
            },
            {
                title: 'amateurRadio',
                route: routes.satellite.list.amateurSatellites,
            },
            {
                title: 'spaceStations',
                route: routes.satellite.list.spaceStation,
            },
            {
                title: 'activeSatellites',
                route: routes.satellite.list.allSatellites,
            },
        ]
    },
    {
        title: 'map',
        icon: MapIcon,
        route: routes.map,
    },
    {
        title: 'settings',
        icon: SettingsIcon,
        route: routes.settings,
        isAlignBottom: true,
    }
]

const renderMenu = () => {
    return MENU_ITEMS.map((section, index) => (
        <Fragment key={`${section.title}-${index}`}>
            { section.isAlignBottom ? <Spacer /> : null }
            <TitleSection id={`${section.title}`} Icon={section.icon} title={section.title} route={section.route} />
            {
                section.children ? (
                    <Flex pl={7} flexDir="column">
                        {
                            section.children.map((sectionItem, index, array) => (
                                <MenuLink id={`${sectionItem.title}-${index}`} to={sectionItem.route} mb={index === array.length - 1 ? 5 : 0}>
                                    {sectionItem.title}
                                </MenuLink>
                            ))
                        }
                    </Flex>
                ) : null
            }
        </Fragment>
    ))
};

const Sidebar = () => (
    <chakra.nav height="100%" width="100%">
        <Stack direction='row' h='100%' w='100%' paddingLeft={4} paddingTop={2.5}>
            <Flex direction="column" p={0} pt={5} pb={2} h='100%' w='100%'>
                {renderMenu()}
            </Flex>
            <Spacer />
            <Divider orientation='vertical' />
        </Stack>
    </chakra.nav>
);

const Main = () => (
    <chakra.main height="100%" width="100%">
        <Outlet />
    </chakra.main>
);

const VersionInfo = () => (
    <Text fontSize="xs">
        <T dictKey="devVersion" />
    </Text>
);

const Footer = () => (
    <chakra.footer>
        <Divider />
        <Flex p={1} ml={5} mr={5}>
            <Text fontSize="xs">
                <T dictKey="developedAndMainted" />
                <ChakraLink fontSize="xs" href="https://linkedin.com/in/piotr-milosz" isExternal color={MAIN_GRADIENT_COLOR}>Piotr Miłosz</ChakraLink>
            </Text>
            <Spacer />
            <Center>
                <VersionInfo />
            </Center>
            <Text fontSize="xs" ml={2}>© {new Date().getFullYear()} satellite-monitor.com</Text>
        </Flex>
    </chakra.footer>
);

const FullWidthLayout = () => {
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
    )
}

const MobileLayout = () => {
    const HEADER_HEIGHT = '120px';
    const FOOTER_HEIGHT = '48px';

    return (
        <Grid
                templateAreas={`"header header" "main main" "footer footer"`}
                h={'100vh'}
                gridTemplateRows={`${HEADER_HEIGHT} auto ${FOOTER_HEIGHT}`}
                overflowY="auto"
            >
                <GridItem area={'header'}>{<MobileHeader />}</GridItem>
                <GridItem area={'main'} overflowX={'auto'}>{<Main />}</GridItem>
                <GridItem area={'footer'}>{<Footer />}</GridItem>
            </Grid>
    )
}

export const Layout = () => {
    const mobileBreakpoint = 768;

    if (window.innerWidth <= mobileBreakpoint) {
        return <MobileLayout />;
    } else {
        return <FullWidthLayout />;
    }
}