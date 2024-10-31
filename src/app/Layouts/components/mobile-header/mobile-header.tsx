import { 
    Box, 
    Center, 
    chakra, 
    Divider, 
    Flex, 
    Spacer, 
    Stack 
} from "@chakra-ui/react";
import { Logo } from "../header/logo";
import { SearchBar } from "../header/search-bar";
import { LanguageMenu } from "../header/language-menu";
import { ThemeChanger } from "../header/theme-changer";
import { LocationDisplay } from "../../../features/user-location/components";
import { HamburgerMenu } from "./hamburger-menu";

export const MobileHeader = () => (
    <chakra.header height="100%" width="100%">
        <Flex direction="column" height="100%" width="100%">
            <Flex h={'100%'} w='100%'>
                <Center>
                    <Logo pl={5} pr={5} pt={1} pb={1}/>
                </Center>
                <Box h={'100%'} p={'10px 0 10px 0'} >
                    <Divider orientation='vertical' />
                </Box>
                <Spacer />
                <Center>
                    <Stack direction="row" spacing='10px' paddingRight={4}>
                        <LanguageMenu />
                        <ThemeChanger />
                        <LocationDisplay />
                        <HamburgerMenu />
                    </Stack>
             </Center>
            </Flex>
            <Divider />
            <SearchBar m="10px 15px 10px 15px"/>
        </Flex>
        <Divider />
    </chakra.header>
);