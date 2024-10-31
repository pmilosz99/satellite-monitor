import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { language } from "../../../shared/atoms";
import { LANGUAGE_VALUES } from "../../../shared/dict-translation";
import { gbFlag, plFlag } from "../../../../assets/icons";

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

export const LanguageMenu = () => {
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