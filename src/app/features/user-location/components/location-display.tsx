import { useEffect, useId } from "react";
import { CloseButton, Divider, IconButton, Spacer, Stack, useDisclosure } from '@chakra-ui/react'
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
import { useAtom } from "jotai";
import { coordinates } from "../../../shared/atoms";
import { T } from "../../../shared/components";

export const LocationDisplay = () => {
    const [atomCoordinates, setAtomCoordinates] = useAtom(coordinates);

    const coords = { latitude: atomCoordinates?.[0], longtitude: atomCoordinates?.[1] };

    const toast = useToast();
    const id = useId();
    const navigate = useNavigate();
    const { isOpen, onToggle, onClose } = useDisclosure();
    const { data } = useElevation([coords], !!atomCoordinates);

    const handleSuccess = (position: GeolocationPosition): void => {
        const { longitude, latitude } = position.coords;
        setAtomCoordinates([longitude, latitude]);
    };

    //TODO: create custom toast component
    const renderToastDescription = () => (
        <Box borderWidth={1} borderRadius={5} backgroundColor='white' borderColor="#e2e8f0">
            <Stack direction={'row'} p={1}>
                <ErrorIcon sx={{color: '#212529'}} />
                <Text as={'b'} color='#212529'><T dictKey="locationSharing" /></Text>
                <Spacer />
                <CloseButton size='sm' onClick={() => toast.closeAll()}/>
            </Stack>
            <Divider />
            <Text fontSize={'md'} padding={2}>
                <T dictKey="youHave" />
                <Text as='b' color="#212529"><T dictKey="turnedOff" /></Text>
                <T dictKey="automaticLocation" />{' '}
                <Button 
                    sx={{color: 'blue'}}
                    variant='link'    
                    onClick={() => {
                        navigate(`/${routes.selectLocation}`);
                        toast.closeAll();
                    }} >
                        <T dictKey="selectHere" />
                </Button>
            </Text>
        </Box>
    )

    const handleError = (error: GeolocationPositionError): void => {
        if (toast.isActive(id)) return;
        console.error(`Błąd: ${error.message}`);
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
            render: () => renderToastDescription()
        })
    };

    const getUserPosition = (): void => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    };

    useEffect(getUserPosition, [])

    const displayElevation = data?.results?.[0].elevation;
    const latitude = atomCoordinates?.[0].toFixed(4);
    const longtitude = atomCoordinates?.[1].toFixed(4);

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
                        icon={atomCoordinates ? <LocationOnOutlinedIcon /> : <LocationOffOutlinedIcon />}
                    />
                </PopoverTrigger>
                <Portal>
                    <PopoverContent w={'15vw'}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader bg={'#F8F9FA'}>
                            <Center>
                                <Box>
                                    <Text>
                                        <T dictKey="yourLocation"/>
                                    </Text>
                                </Box>
                            </Center>
                        </PopoverHeader>
                        <PopoverBody bg="white">
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
