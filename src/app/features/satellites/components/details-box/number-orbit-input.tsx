import { FC } from "react";
import { useAtomValue } from "jotai";
import { 
    Box, 
    Flex, 
    NumberDecrementStepper, 
    NumberIncrementStepper, 
    NumberInput, 
    NumberInputField, 
    NumberInputStepper, 
    ScaleFade, 
    SimpleGrid, 
    Spacer, 
    Spinner, 
    Text, 
    Tooltip
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

import { T } from "../../../../shared/components";
import { isDrawOrbitLayerLoading } from "../../../../shared/atoms";

interface INumberOrbitInput {
    numberOfOrbits: number;
    satPeriod: number;
    onChange: (valueAsString: string, valueAsNumber: number) => void;
}

export const NumberOrbitInput: FC<INumberOrbitInput> = ({ numberOfOrbits, satPeriod, onChange }) => {
    const isLoading = useAtomValue(isDrawOrbitLayerLoading);

    return (
        <SimpleGrid columns={2}>
            <Flex alignItems="center">
                <Text>
                    <T dictKey="numberOrbit"/>:
                </Text>
                <Spacer />
                {isLoading ? <Spinner size="sm" ml={2} mr={2} mt={1}/> : null}
                {numberOfOrbits > 4 && (
                    <Tooltip label={<T dictKey="warningNumberOrbit"/>}>
                        <ScaleFade initialScale={0.1} in={true} >
                            <WarningIcon color="red.500" mr={2} />
                        </ScaleFade>
                    </Tooltip> 
                )}
            </Flex>
            <Box>
                <NumberInput defaultValue={1} min={1} max={100} onChange={onChange} isDisabled={isLoading}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
            </Box>
            <Box></Box>
            <Text fontSize={12} m={1}>{`+${(numberOfOrbits * satPeriod).toFixed(2)} min`}</Text>
        </SimpleGrid>
    )
};

export default NumberOrbitInput;