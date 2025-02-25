import { FC, useMemo } from "react";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";
import { v4 as uuidv4 } from 'uuid';
import { 
    Alert, 
    AlertIcon, 
    Box, 
    Center, 
    Heading, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead,
    Tr 
} from "@chakra-ui/react";

import { useUserLocation } from "../../../../shared/hooks";
import { getOverflightsPrediction, IOverflight } from "../../../../shared/overflights-prediction";

const getHoursMinutesSeconds = (date: Date) => {
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');

    return `${HH}:${MM}:${SS}`;
}

interface IUpcomingOverflights {
    tle: string[];
}

type TOverflightKeys = keyof IOverflight;

const overflightKeys: TOverflightKeys[] = ['visibleStartTime', 'visible10ElevTime', 'visibleMaxHeightTime', 'visibl10ElevEndTime', 'visibleEndTime'];
const tableHeaderKeys = ['L.p', 'Wschodzi', 'Wznosi się na ponad 10°', 'Maksymalna wysokość', 'Schodzi poniżej 10°', 'Zachodzi'];
const ONE_DAY_SEC = 86000; 

export const UpcomingOverflights: FC<IUpcomingOverflights> = ({ tle }) => {
    const userLocation = useUserLocation();

    const name = tle[0];
    const tle1 = tle[1];
    const tle2 = tle[2];

    const overflights = useMemo(() => {
        if (!userLocation) return;

        const sat = new Satellite({name: name, tle1: tle1 as TleLine1, tle2: tle2 as TleLine2})
        const ov = getOverflightsPrediction(sat, ONE_DAY_SEC, userLocation);
        
        return ov;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, tle1, tle2]);

    const renderContent = () => {
        if (!userLocation) return (
            <Alert status='warning'>
              <AlertIcon />
              Aby zobaczyć najbliższe przeloty ustaw swoją lokalizację
            </Alert>
        )

        if (!overflights?.length) return (
            <Alert status='info'>
                <AlertIcon />
                Brak przelotów w ciągu 24h
            </Alert>
        )

        return renderTable();
    };

    const renderTable = () => (
        <TableContainer>
            <Table size='sm'>
                <Thead>
                    {renderHeader(tableHeaderKeys)}
                </Thead>
                <Tbody>
                    {renderRows()}
                </Tbody>
            </Table>
        </TableContainer>
    )

    const renderHeader = (keys: string[]) => (
        <Tr>
            {
                keys.map((key) => (
                    <Th key={uuidv4()}>{key}</Th>
                ))
            }
        </Tr>
    )

    const renderRows = () => {
        if (!overflights?.length) return; 

        return (
            overflights.map((overflight, index) => (
                <Tr key={uuidv4()}>
                    <Td key={uuidv4()}>{index + 1}</Td>
                    {renderCells(overflight)}
                </Tr>
            ))
        )
    }

    const renderCells = (overflight: IOverflight) => (
        overflightKeys.map((key) => {
            return (
                <Td key={uuidv4()}>
                    {overflight[key] ? getHoursMinutesSeconds(overflight[key]) : '-'}
                </Td>
            )            
        })
    );

    return (
        <Box h="100%">
            <Center>
                <Heading as='h3' size='lg'>Najbliższe przeloty (24h)</Heading>
            </Center>
            <br />
            {renderContent()}
        </Box>
    )
}