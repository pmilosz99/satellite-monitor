import { FC } from "react";
import { Flex, Spacer, Text } from "@chakra-ui/react";

import { T } from "../../../../shared/components";

import { ISatPosition } from "../../../../shared/utils/getSatellitePosition";

interface IDetailsBoxData {
    positionSat: ISatPosition;
    period: number;
}

export const DetailsBoxData: FC<IDetailsBoxData> = ({ positionSat, period }) => (
    <>
        <Flex>
            <Text>
                <T dictKey="longtitude" />:
            </Text>
            <Spacer />
            <Text>{positionSat.longitude.toFixed(4)}</Text>
        </Flex>
        <Flex>
            <Text>
                <T dictKey="latitude" />:
            </Text>
            <Spacer />
            <Text>{positionSat.latitude.toFixed(4)}</Text>
        </Flex>
        <Flex>
            <Text>
                <T dictKey="height" />:
            </Text>
            <Spacer />
            <Text>{positionSat.height.toFixed(4)}</Text>
        </Flex>
        <Flex>
            <Text>
                <T dictKey="orbitTime" />:
            </Text>
            <Spacer />
            <Text>{period.toFixed(2)} min.</Text>
        </Flex>
    </>
);

export default DetailsBoxData;
