import { useAtom } from "jotai";
import { 
    Box, 
    Center, 
    Divider, 
    Heading, 
    NumberDecrementStepper, 
    NumberIncrementStepper, 
    NumberInput, 
    NumberInputField, 
    NumberInputStepper, 
    Stack, 
    Text, 
    useToast
} from "@chakra-ui/react";

import { InfoMinimalismGrayBox, T } from "../../../shared/components";
import { SettingsModuleItem } from "../components";
import { settingsValues } from "../../../shared/atoms";

import { SETTINGS_VALUES } from "../../../shared/types";
import { useTranslation } from "../../../shared/hooks";

export const Settings = () => {
    const [values, setValues] = useAtom(settingsValues);
    const toast = useToast();
    const [description, mapName] = useTranslation(['settingsDescIssuseRefresh', 'map']);

    const handleInputChange = (_: unknown, valueNumber: number): void => {
        setValues((prevValues) => ({
            ...prevValues, 
            [SETTINGS_VALUES.REFRESH_SAT_MS]: valueNumber 
        }))
    };

    const handleInputBlur = (): void => {
        toast({
            description: <T dictKey="settingsSaved" />,
            status: 'success',
            duration: 1500,
            position: 'top-right',
        })
    }
    
    return (
        <>
            <Center p={5}>
                <Heading>
                    <T dictKey="settingsApp" />
                </Heading>
            </Center>
            <Box pl={10} pr={10}>
                <Divider />
                <Box pt={4}>
                    <SettingsModuleItem text={`${mapName} 2D`} />
                    <Box pl={5} pt={2}>
                        <Stack direction="row" alignItems="center">
                            <Text>
                                1. <T dictKey="settingsRefreshLabel" />: 
                            </Text>            
                            <NumberInput defaultValue={values[SETTINGS_VALUES.REFRESH_SAT_MS]} min={500} step={500} onChange={handleInputChange} onBlur={handleInputBlur}>
                                <NumberInputField height="auto" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Stack>
                        <InfoMinimalismGrayBox text={description as string} p={1} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Settings;