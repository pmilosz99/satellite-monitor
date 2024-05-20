import { Box, BoxProps, Center, Heading } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface ISatelliteParamBox extends BoxProps{
    title: string;
    children: ReactNode;
}

export const SatelliteParamBox: FC<ISatelliteParamBox> = ({ title, children, ...rest }) => (
    <Box p={9}>
        <Center>
            <Heading size="lg" p={2}>
                {title}
            </Heading>
        </Center>
        <Box borderWidth="1px" borderRadius="6px" {...rest}>{children}</Box>
    </Box>
);
