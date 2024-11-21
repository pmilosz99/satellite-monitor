import { useState } from "react";
import { Box } from "@chakra-ui/react";

import { DrawerSatDetails, MapAllSats } from "../components";
import { FilterRadioGroup, TSatelliteType } from "../components/filter-checkbox-group";
import { useJsonTle } from "../../../shared/hooks";
import { ISatelliteData } from "../components/map-all-sats";

const MAP_PADDING = 5;

const filterSatellites = (data: ISatelliteData[], type: TSatelliteType) => {
    switch(type) {
        case 'ISS':
            return data.filter((record) => record.name.startsWith(type));
        case 'ALL':
            return data;
        default:
            return data.filter((record) => record.name.includes(type));
    }
}

export const Map2d = () => {
    const [selectedNoradId, setSelectedNoradId] = useState<string | null>(null);
    const [isDraweOpen, setIsDraweOpen] = useState(false);
    const [radioGroupValue, setRadioGroupValue] = useState<TSatelliteType>('ALL');

    const tleJson = useJsonTle();

    const filteredSatellites = filterSatellites(tleJson?.data || [], radioGroupValue);

    const openDrawer = (): void => setIsDraweOpen(true);

    const closeDrawer = (): void => setIsDraweOpen(false);

    const setNoradId = (id: string): void => setSelectedNoradId(id);

    const handleFilterRadioGroupChange = (e: TSatelliteType) => {
        closeDrawer();
        setNoradId('');
        setRadioGroupValue(e);
    };

    return (    
        <Box h="100%" pr={MAP_PADDING} pl={MAP_PADDING} pt={MAP_PADDING} pb={MAP_PADDING} data-testid="map2d-container">
            <FilterRadioGroup 
                value={radioGroupValue} 
                onChange={handleFilterRadioGroupChange} 
                numberOfSatellites={filteredSatellites.length}
            />
            <MapAllSats 
                satellites={filteredSatellites}
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