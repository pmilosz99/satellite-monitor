import { FC } from "react";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { routes } from "../../../shared/routes";
import { T } from "../../../shared/components";

interface ILocationValue {
    latitude: string | number | undefined;
    longtitude: string | number | undefined;
    altitude: string | number | undefined;
    closePopover: () => void;
}

export const LocationValue: FC<ILocationValue> = ({ longtitude, latitude, altitude, ...rest }) => {
    const navigate = useNavigate();
    const { closePopover } = rest;

    const handleLinkClick = (): void => {
        closePopover();
        navigate(`/${routes.selectLocation}`);
    };

    const isDisplayValue = !!longtitude && !!latitude;

    return (
        isDisplayValue ? (
            <Box>
                <Flex>
                    <Text fontSize='xs' paddingLeft={2}><T dictKey="latitude" /></Text>
                    <Spacer />
                    <Text fontSize='xs'>{latitude}</Text>
                </Flex>
                <Flex>
                    <Text fontSize='xs' paddingLeft={2} paddingRight={3}><T dictKey="longtitude"/></Text>
                    <Spacer />
                    <Text fontSize='xs'>{longtitude}</Text>
                </Flex>
                <Flex>
                    <Text fontSize='xs' paddingLeft={2}><T dictKey="altitude"/></Text>
                    <Spacer />
                    <Text fontSize='xs'>{altitude} m</Text>
                </Flex>
                <Text fontSize='xs'>
                    <T dictKey="selectManualy" />{' '} 
                    <Button sx={{color: '#be13a3'}}variant='link' onClick={handleLinkClick} size={'xs'}>
                        <Text as='b'><T dictKey="here" /></Text>
                    </Button>
                .</Text>
            </Box>
        ) : (
            <Text fontSize='sm'> 
                <T dictKey="requiresLocation" />{' '} 
                <Button sx={{color: '#be13a3'}} variant='link' onClick={handleLinkClick} size={'s'}>
                    <T dictKey="here" />
                </Button>
                {' '}<T dictKey="allowLocation" />
            </Text>
        )
    )
}