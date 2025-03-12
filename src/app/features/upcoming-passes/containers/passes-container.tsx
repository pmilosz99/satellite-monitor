import { Box, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import { SearchBar, T } from "../../../shared/components";
import { useJsonTle, useTranslation } from "../../../shared/hooks";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "../../../shared/routes";
import { FC } from "react";

interface ISatData {
    name: string;
    noradId: number;
    line1: string;
    line2: string;
}

export const PassesContainer: FC = () => {
    const tleJSON = useJsonTle();

    const placeholder = useTranslation('enterSat') as string;

    if (!tleJSON) return;

    return (
        <Box p={5}>
            <Stack direction="row" alignItems="center">
                <Text>
                    <T dictKey="passesFor" />:
                </Text>
                <SearchBar<ISatData>
                    data={tleJSON.data as ISatData[]}
                    renderItem={(item) => (
                        <ChakraLink key={item.noradId} as={RouterLink} to={routes.passes.satellite.goTo(`${item.noradId}`)}>{item.name}</ChakraLink>
                    )}
                    placeholder={placeholder}
                />
            </Stack>
        </Box>
    )
}