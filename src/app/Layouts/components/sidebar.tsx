import { chakra, Divider, Flex, Spacer, Stack } from "@chakra-ui/react";
import { renderMenu } from "./menu";

export const Sidebar = () => (
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