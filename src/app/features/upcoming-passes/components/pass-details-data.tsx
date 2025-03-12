import { Box, Center, Divider, Flex, Spacer, Text } from "@chakra-ui/react"
import { FC } from "react"
import { coordinatesToDM } from "../utils";
import { Satellite } from "ootk-core";
import { Coordinate } from "ol/coordinate";
import { IOverflight } from "../../../shared/overflights-prediction";
import { T } from "../../../shared/components";

interface IPassDetailsData {
    sat: Satellite;
    coords: Coordinate;
    startVisibleDate: Date;
    pass: IOverflight;
}

export const PassDetailsData: FC<IPassDetailsData> = ({ sat, coords, startVisibleDate, pass }) => {
    return (
        <Box p={5}>
            <Center>
                <Text mb={5}>
                    <T dictKey="detailsFor" /> <b>{sat.name}</b> <T dictKey="onDay" /> <b>{new Date(startVisibleDate).toLocaleDateString()}</b> <T dictKey="atTime" /> <b>{startVisibleDate.toLocaleTimeString()}</b> <T dictKey="forTheLocation" /> <b>{coordinatesToDM(coords[1], coords[0])}</b>
                </Text>
            </Center>
            <Divider />
            <Flex>
                <Text>
                   <T dictKey="rises" />:
                </Text>
                <Spacer />
                <Text>{pass.visibleStartTime.toLocaleTimeString()}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>
                    <T dictKey="reachesAbove10" />:
                </Text>
                <Spacer />
                <Text>{pass.visible10ElevTime ? pass.visible10ElevTime.toLocaleTimeString() : '-'}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>
                    <T dictKey="maximumAltitude" />:
                </Text>
                <Spacer />
                <Text>{pass.visibleMaxHeightTime.toLocaleTimeString()}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>
                    <T dictKey="dropsBelow10" />:
                </Text>
                <Spacer />
                <Text>{pass.visibl10ElevEndTime ? pass.visibl10ElevEndTime.toLocaleTimeString() : '-'}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>
                    <T dictKey="sets" />:
                </Text>
                <Spacer />
                <Text>{pass.visibleEndTime.toLocaleTimeString()}</Text>
            </Flex>
            <Divider />
        </Box>
    )
}