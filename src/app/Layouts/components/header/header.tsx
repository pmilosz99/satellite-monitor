import { Box, Center, chakra, Divider, Flex, Spacer, Stack } from "@chakra-ui/react";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { LanguageMenu } from "./language-menu";
import { ThemeChanger } from "./theme-changer";
import { LocationDisplay } from "../../../features/user-location/components";

export const Header = () => (
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