import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CloseButton, Flex, Heading, Spacer, Text, useStyleConfig } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";

import { T } from "../../../shared/components";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { useTle } from "../../../shared/hooks";
import { routes } from "../../../shared/routes";

interface IDrawerSatDetails {
    isOpen: boolean;
    onClose: () => void;
    noradId: string;
}

export const DrawerSatDetails: FC<IDrawerSatDetails> = ({ isOpen, onClose, noradId }) => {
    const styles = useStyleConfig('DrawerSatDetails');
    const navigate = useNavigate();
    const tle = useTle();

    const singleTle = getSatelliteTle(tle?.data || '', noradId);

    const renderDrawerContent = () => {
        if (!singleTle) return 'Not found';

        const sat = new Satellite({tle1: singleTle[1] as TleLine1, tle2: singleTle[2] as TleLine2})

        return (
            <Box __css={styles} p={2.5} pt={1}>
                <Flex alignItems="center">
                    <Heading size="md">{singleTle?.[0]}</Heading>
                    <Spacer />
                    <CloseButton onClick={onClose} ml={1} />
                </Flex>
                <Text>Norad ID: {noradId}</Text>
                <Text>
                    <T dictKey="apogee" />: {sat.apogee.toFixed(2)}
                </Text>
                <Text>
                    <T dictKey="perigee" />: {sat.perigee.toFixed(2)}
                </Text>
                <Button mt={2.5} onClick={() => navigate(routes.satellite.item.goTo(noradId))}>
                    <T dictKey="moreDetails" />
                </Button>
            </Box>
        )
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ translateX: '110%', opacity: 0.4 }}
                    animate={{ translateX: '0%' , opacity: 1 }}
                    exit={{ translateX: '110%', opacity: 0.4 }}
                    transition={{ ease: [0.1, 0.8, 0.9, 1.0]}}
                    style={{
                        position: 'fixed',
                        top: 350,
                        right: 20,
                    }}
                >
                    {renderDrawerContent()}
                </motion.div>
            )}
      </AnimatePresence>
    );
}

export default DrawerSatDetails;