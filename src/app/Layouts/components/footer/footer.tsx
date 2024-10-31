import { Center, chakra, Divider, Flex, Link, Spacer, Text } from "@chakra-ui/react";

import { T } from "../../../shared/components";
import { MAIN_GRADIENT_COLOR } from "../../../shared/themes";
import { VersionInfo } from "./version-info";

export const Footer = () => (
    <chakra.footer>
        <Divider />
        <Flex p={1} ml={5} mr={5}>
            <Text fontSize="xs">
                <T dictKey="developedAndMainted" />
                <Link fontSize="xs" href="https://linkedin.com/in/piotr-milosz" isExternal color={MAIN_GRADIENT_COLOR}>Piotr Miłosz</Link>
            </Text>
            <Spacer />
            <Center>
                <VersionInfo />
            </Center>
            <Text fontSize="xs" ml={2}>© {new Date().getFullYear()} satellite-monitor.com</Text>
        </Flex>
    </chakra.footer>
);