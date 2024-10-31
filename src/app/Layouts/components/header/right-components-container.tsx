import { 
    Box, 
    Button, 
    Center, 
    IconButton, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Stack, 
    useColorMode 
} from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

import { gbFlag, plFlag } from "../../../../assets/icons";
import { LANGUAGE_VALUES } from "../../../shared/dict-translation";
import { currentTheme, language } from "../../../shared/atoms";
import { THEME_TYPE } from "../../../shared/themes";
import { LocationDisplay } from "../../../features/user-location/components";
import { HamburgerMenu } from "./hamburger-menu";

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

export const RightComponentsContainer = () => (
    <Center>
        <Stack direction="row" spacing='10px' paddingRight={4}>
            <LanguageMenu />
            <ThemeChanger />
            <LocationDisplay />
            <HamburgerMenu />
        </Stack>
    </Center>
);