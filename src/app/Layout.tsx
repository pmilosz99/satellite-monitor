import { ReactNode } from "react";
import { useAtom } from "jotai";
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
    useBoolean
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link as RouterLink, Outlet, To } from "react-router-dom";
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';

import { LocationDisplay } from "./features/user-location/components";

import { language } from "./shared/atoms";
import { LANGUAGE_VALUES } from "./shared/dict-translation";
import { routes } from "./shared/routes";
import { T } from "./shared/components";

import { plFlag, gbFlag } from '../assets/icons';

const Logo = () => (
    <RouterLink to="/">
        <Box paddingLeft={9}>
            <Flex>
                <Heading color="#212529" size='md'>
                    Satellite
                </Heading>
                <Box paddingTop={'3px'} paddingLeft={'5px'}>
                    <SatelliteAltOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
            </Flex>
            <Heading bgGradient='linear(to-l, #7928CA, #FF0080)' bgClip='text' size='md' paddingLeft={6}>
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
    const [flag, setFlag] = useBoolean();
    //TODO finish component
    return (
        <IconButton 
                variant='outline'
                aria-label="theme-changer"
                onClick={setFlag.toggle}
                icon={flag ? <MoonIcon /> : <SunIcon />}
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
)

const Header = () => (
    <Flex bg='white' h={'100%'} w='100%' borderBottom='1px' borderColor={'#E9ECEF'} backgroundColor={'#F8F9FA'}>
        <Center>
            <Logo />
        </Center>
        <Box h={'100%'} p={'10px 0 10px 45px'} >
            <Divider orientation='vertical' borderColor={'#CED4DA'} />
        </Box>
        <Spacer />
        <RightComponentsContainer />
    </Flex>
);

const MenuLink = ({ to, children }: {to: To, children: ReactNode }) => (
    <ChakraLink as={RouterLink} to={to} _hover={{ color: '#be13a3' }}>{children}</ChakraLink>
)

const Sidebar = () => {
    return (
        <Stack direction='row' h='100%' w='100%' paddingLeft={4} paddingBottom={4} paddingTop={10}>
            <Container centerContent p={0}>
                <Text as='b'>
                    <T dictKey="database" />
                </Text>
                <MenuLink to={routes.starlink.list}>
                    Starlink
                </MenuLink>
                <MenuLink to={routes.oneWeb.list}>
                    OneWeb
                </MenuLink>
                <MenuLink to={routes.amateurSatellites.list}>
                    <T dictKey="amateurRadio" />
                </MenuLink>
                <MenuLink to={routes.spaceStations.list}>
                    <T dictKey="spaceStations" />
                </MenuLink>
                <MenuLink to={routes.allSatellites.list}>
                    <T dictKey="activeSatellites" />
                </MenuLink>
                <Text as='b' paddingTop={4}>
                    <T dictKey="satellitesLive" />
                </Text>
                <MenuLink to={routes.satellitesAbove}>
                    <T dictKey="satellitesAbove" />
                </MenuLink>
                <Text as='b' paddingTop={4}>
                    <T dictKey="futureFeatures" />
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
    )
};

const Footer = () => (
    <Box paddingRight={5} paddingLeft={5}>
        <Divider />
        <Flex p={1}>
            <Text fontSize="xs"><T dictKey="developedAndMainted" /></Text>
            <Spacer />
            <Text fontSize="xs">© {new Date().getFullYear()} satellite-monitor.com</Text>
        </Flex>
    </Box>
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
        >
            <GridItem area={'header'}>{<Header />}</GridItem>
            <GridItem bg="white" area={'nav'}>{<Sidebar />}</GridItem>
            <GridItem area={'main'} overflow={'auto'}>{<Outlet />}</GridItem>
            <GridItem area={'footer'}>{<Footer />}</GridItem>
        </Grid>
    );
}