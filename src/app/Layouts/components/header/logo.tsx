import { Box, ChakraComponent, Flex, Heading } from "@chakra-ui/react";
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';

import { MAIN_GRADIENT } from "../../../shared/themes";
import { Link as RouterLink } from "react-router-dom";

export const Logo: ChakraComponent<"div", object> = ({ ...props }) => (
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