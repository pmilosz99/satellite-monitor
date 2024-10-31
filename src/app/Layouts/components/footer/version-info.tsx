import { Text } from '@chakra-ui/react';
import { T } from "../../../shared/components";

export const VersionInfo = () => (
    <Text fontSize="xs">
        <T dictKey="devVersion" />
    </Text>
);