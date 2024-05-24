import { Button, Flex, useStyleConfig } from "@chakra-ui/react";
import { FC } from "react";
import { T } from "../../../../shared/components";
import { useTranslation } from "../../../../shared/hooks";

interface IDetailsBoxButtons {
    isTrackSat: boolean;
    onZoom: () => void;
    onTrack: () => void;
}

export const DetailsBoxButtons: FC<IDetailsBoxButtons> = ({ isTrackSat, onZoom, onTrack }) => {
    const [ track, on, off ] = useTranslation(['trackPosition', 'on', 'off']);

    const styles = useStyleConfig('DetailsBoxButtons', { variant: isTrackSat ? 'onMode' : 'offMode' });

    const secondButtonTitle = `${track} (${isTrackSat ? on : off})`;

    return (
        <Flex>
            <Button variant='outline' w="100%" mr={1} onClick={onZoom}>
                <T dictKey="zoom" />
            </Button>
            <Button sx={styles} w="100%" ml={1} onClick={onTrack} variant="outline">
                {secondButtonTitle}
            </Button>
        </Flex>
    )
};

export default DetailsBoxButtons;
