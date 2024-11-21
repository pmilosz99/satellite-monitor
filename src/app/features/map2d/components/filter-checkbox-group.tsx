import { Divider, Flex, Radio, RadioGroup, Text, useStyleConfig } from "@chakra-ui/react"
import { FC } from "react";
import { T } from "../../../shared/components";

export type TSatelliteType  = 'STARLINK' |'ONEWEB' | 'ISS' | 'IRIDIUM' | 'NAVSTAR' | 'GALILEO' | 'GLONASS' | 'ALL';

interface IFilterRadioGroupProps {
    value: TSatelliteType;
    onChange: (e: TSatelliteType) => void;
    numberOfSatellites: number;
}

interface IOption {
    value: TSatelliteType,
    label: string,
}

const OPTIONS: IOption[] = [
    { value: 'STARLINK', label: 'Starlink' },
    { value: 'ONEWEB', label: 'One Web' },
    { value: 'ISS', label: 'ISS' },
    { value: 'IRIDIUM', label: 'Iridium' },
    { value: 'NAVSTAR', label: 'GPS' },
    { value: 'GALILEO', label: 'Galileo' },
    { value: 'GLONASS', label: 'Glonass'},
    { value: 'ALL', label: <T dictKey="all" /> as unknown as string },
];

export const FilterRadioGroup: FC<IFilterRadioGroupProps> = ({ value, onChange, numberOfSatellites }) => {
    const styles = useStyleConfig('FilterRadioGroup');
    
    const isMobile = window.innerWidth <= 768;

    const handleRadioGroupChange = (e: TSatelliteType) => onChange(e);

    return (
        <RadioGroup colorScheme='green' defaultValue={value} onChange={handleRadioGroupChange}>
            <Flex sx={styles} direction="row" wrap='wrap'>
                {OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value} mr={5}>{option.label}</Radio>
                ))}
                <Divider orientation={isMobile ? "horizontal" : "vertical"} height={isMobile ? "4px" : "25px"} />
                <Text ml={isMobile ? 1 : 4}>
                    <T dictKey="numberOfSatellites" />: {numberOfSatellites}
                </Text>
            </Flex>
        </RadioGroup >
    )
}