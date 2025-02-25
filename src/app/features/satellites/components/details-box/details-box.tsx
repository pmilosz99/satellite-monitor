import { FC } from "react";
import { 
    Box, 
    Center, 
    Heading, 
    Tab, 
    TabList, 
    TabPanel, 
    TabPanels, 
    Tabs, 
    Text 
} from "@chakra-ui/react";

import { UpcomingOverflights } from "./upcoming-overflights";
import DetailsBoxPosition from "./details-box-position";

interface IDetailsBox {
    title: string;
    tle: string[];
    period: number;
    numberOfOrbits: number;
    isTrackSat: boolean;
    isMobile: boolean;
    onNumberInputChange: (_: string, valueAsNumber: number) => void;
    onTrack: () => void;
}

export const DetailsBox: FC<IDetailsBox> = ({ 
    title, 
    tle, 
    period, 
    isTrackSat, 
    isMobile, 
    numberOfOrbits, 
    onNumberInputChange, 
    onTrack 
}) => {

    const renderMobileLayout = () => (
        <Tabs isFitted>
            <TabList>
                <Tab>Pozycja satelity</Tab>
                <Tab>Przeloty satelity</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <DetailsBoxPosition 
                        tle={tle} 
                        period={period}
                        numberOfOrbits={numberOfOrbits}
                        isTrackSat={isTrackSat}
                        onNumberInputChange={onNumberInputChange}
                        onTrack={onTrack}
                    />
                </TabPanel>
                <TabPanel p={0}>
                    <UpcomingOverflights tle={tle} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )

    const renderFullWidthLayout = () => (
        <>
            <DetailsBoxPosition 
                tle={tle} 
                period={period}
                numberOfOrbits={numberOfOrbits}
                isTrackSat={isTrackSat}
                onNumberInputChange={onNumberInputChange}
                onTrack={onTrack}
            />
            <br /><br />
            <UpcomingOverflights tle={tle} />
        </>
    )

    const renderContent = () => {
        if (isMobile) return renderMobileLayout();

        return renderFullWidthLayout();
    }

    return (
        <Box w={isMobile ? '100%' : '50%'} borderWidth="1px" borderRadius="6px">
            <Center>
                <Heading>
                    <Text p={isMobile ? 2 : 5}>{title}</Text>
                </Heading>
            </Center>
            <Center>
                <Box p={isMobile ? 0 : 0} w={isMobile ? '100%' : '80%'}> 
                    {renderContent()}
                </Box>
            </Center>
        </Box>
    )
};

export default DetailsBox;