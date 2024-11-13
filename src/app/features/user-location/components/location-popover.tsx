import { useEffect, useId } from "react";
import { useAtom } from "jotai";
import { CloseButton, Divider, IconButton, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

import { 
    Box,
    Button, 
    Center, 
    Popover, 
    PopoverArrow, 
    PopoverBody, 
    PopoverCloseButton, 
    PopoverContent, 
    PopoverHeader, 
    PopoverTrigger, 
    Portal,
    Text,
    useToast, 
} from "@chakra-ui/react";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined';
import ErrorIcon from '@mui/icons-material/Error';

import { useElevation } from "../data-access/altitude";

import { LocationValue } from "./location-value";

import { routes } from "../../../shared/routes";
import { coordinates } from "../../../shared/atoms";
import { T } from "../../../shared/components";
import { CustomToast } from "../../../shared/components/custom-toast";
import { MAIN_GRADIENT_COLOR } from "../../../shared/themes";

export const LocationPopover = () => {
    const [atomCoordinates, setAtomCoordinates] = useAtom(coordinates);

    const coords = { latitude: atomCoordinates?.[0] || 0, longtitude: atomCoordinates?.[1] || 0 };

    const toast = useToast();
    const id = useId();
    const navigate = useNavigate();
    const { isOpen, onToggle, onClose } = useDisclosure();
    const { data } = useElevation([coords], !!atomCoordinates);

    const handleSuccess = (position: GeolocationPosition): void => {
        const { longitude, latitude } = position.coords;
        setAtomCoordinates([longitude, latitude]);
    };

    const renderToastContent = (): JSX.Element => (
        <>
            <Stack direction={'row'} p={1} data-testid="location-toast-error">
                <ErrorIcon />
                <Text as={'b'}>
                    <T dictKey="locationSharing" />
                </Text>
                <Spacer />
                <CloseButton size='sm' onClick={() => toast.closeAll()}/>
            </Stack>
            <Divider />
            <Text fontSize={'md'} padding={2}>
                <T dictKey="youHave" />
                <Text as='b'>
                    <T dictKey="turnedOff" />
                </Text>
                <T dictKey="automaticLocation" />{' '}
                <Button 
                    sx={{color: MAIN_GRADIENT_COLOR}}
                    variant='link' 
                    onClick={() => {
                        navigate(`/${routes.selectLocation}`);
                        toast.closeAll();
                    }} >
                        <T dictKey="here" />
                </Button>
            </Text>
        </>
    );

    const handleError = (error: GeolocationPositionError): void => {
        if (toast.isActive(id)) return;
        console.error(`Error message: ${error.message}`);
        setAtomCoordinates(null);
        toast({
            id,
            title: 'Location rejected',
            description: 's',
            status: 'warning',
            variant: 'subtle',
            position: 'top',
            duration: 100000,
            isClosable: true,
            render: () => <CustomToast>{renderToastContent()}</CustomToast>
        })
    };

    const getUserPosition = (): void => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(getUserPosition, [])

    const displayElevation = data?.results?.[0].elevation;
    const latitude = atomCoordinates?.[1]?.toFixed(4);
    const longtitude = atomCoordinates?.[0]?.toFixed(4);

    return (
            <Popover
                isOpen={isOpen}
                onClose={onClose}
            >
                <PopoverTrigger>
                    <IconButton 
                        onClick={onToggle}
                        aria-label="location-button"
                        variant='outline'
                        icon={atomCoordinates ? <LocationOnOutlinedIcon data-testid="location-on-icon"/> : <LocationOffOutlinedIcon data-testid="location-off-icon"/>}
                        data-testid="location-button"
                    />
                </PopoverTrigger>
                <Portal>
                    <PopoverContent data-testid="location-popover-content" w="280px">
                        <PopoverArrow />
                        <PopoverCloseButton mt="5px"/>
                        <PopoverHeader>
                            <Center>
                                <Box>
                                    <Text>
                                        <T dictKey="yourLocation"/>
                                    </Text>
                                </Box>
                            </Center>
                        </PopoverHeader>
                        <PopoverBody>
                            <Center>
                                <LocationValue 
                                    latitude={latitude} 
                                    longtitude={longtitude} 
                                    altitude={displayElevation} 
                                    closePopover={onToggle}
                                />
                            </Center>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
    )
};
