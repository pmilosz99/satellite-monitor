import { useState } from "react";
import { Box } from "@chakra-ui/react";

import { DrawerSatDetails, MapAllSats } from "../components";

const MAP_PADDING = 5;

export const Map2d = () => {
    const [selectedNoradId, setSelectedNoradId] = useState<string | null>(null);
    const [isDraweOpen, setIsDraweOpen] = useState(false);

    const openDrawer = (): void => setIsDraweOpen(true);

    const closeDrawer = (): void => setIsDraweOpen(false);

    const setNoradId = (id: string): void => setSelectedNoradId(id);

    return (    
        <Box h="100%" pr={MAP_PADDING} pl={MAP_PADDING} pt={MAP_PADDING} pb={MAP_PADDING}>
            <MapAllSats 
                setNoradId={setNoradId} 
                setOpenDrawer={openDrawer} 
                setCloseDrawer={closeDrawer} 
                isDrawerOpen={isDraweOpen} 
            />
            <DrawerSatDetails 
                isOpen={isDraweOpen} 
                onClose={closeDrawer} 
                noradId={selectedNoradId || ''} 
            />
        </Box>
    )
};

export default Map2d;