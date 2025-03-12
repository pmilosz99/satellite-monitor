import { Alert, AlertIcon, Box, Button, Center, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { Satellite, TleLine1, TleLine2 } from "ootk-core";
import { useAtomValue } from "jotai";
import { tle } from "../../../shared/atoms";
import { FC, useMemo, useState } from "react";
import { useUserLocation } from "../../../shared/hooks";
import { getOverflightsPrediction, IOverflight } from "../../../shared/overflights-prediction";
import { T } from "../../../shared/components";
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { routes } from "../../../shared/routes";
import { coordinatesToDM } from "../utils";

const getHoursMinutesSeconds = (date: Date) => {
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');

    return `${HH}:${MM}:${SS}`;
}

type TOverflightKeys = keyof IOverflight;

const passesKeys: TOverflightKeys[] = ['visibleStartTime', 'visible10ElevTime', 'visibleMaxHeightTime', 'visibl10ElevEndTime', 'visibleEndTime'];
const tableHeaderTranslationKeys = ['details', 'rises', 'reachesAbove10', 'maximumAltitude', 'dropsBelow10', 'sets'];
const ONE_DAY_SEC = 86400;

function setTimeToMidnight(date: Date): Date {
    const newDate = new Date(date);
  
    newDate.setHours(0, 0, 0, 0);
  
    return newDate;
}

function formatDate(date: Date): string {
    const months = [
      "sty", "lut", "mar", "kwi", "maj", "cze",
      "lip", "sie", "wrz", "paź", "lis", "gru"
    ];

    const day = date.getDate(); 
    const month = months[date.getMonth()];
  
    return `${day} ${month}`;
}

function appendQueryParams(path: string, queryParams: Record<string, string>) {
    if (Object.keys(queryParams).length === 0) {
      return path;
    }
  
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  
    const separator = path.includes('?') ? '&' : '?';
  
    return `${path}${separator}${queryString}`;
}

export const PassesList: FC = () => {
    const { satelliteId } = useParams();
    const tleQuery = useAtomValue(tle);
    const userLocation = useUserLocation();
    const [currentDay, setCurrentDay] = useState(new Date());

    const singleTle = useMemo(() => getSatelliteTle(tleQuery?.data || '', satelliteId || ''), [tleQuery, satelliteId]);   

    const name = singleTle[0];
    const tle1 = singleTle[1] as TleLine1;
    const tle2 = singleTle[2] as TleLine2;

    if (!tle1 || !userLocation) return;

    const sat = new Satellite({ name, tle1, tle2 });
    const midnightDate = setTimeToMidnight(currentDay)
    const passes = getOverflightsPrediction(sat, ONE_DAY_SEC, userLocation, midnightDate);

    const isPreviousButtonVisible = currentDay > new Date();

    const filterData = (currentDay: Date) => {
        const filteredData = passes.filter((pass) => {
            const visibleStartTime = pass.visibleStartTime;
            const date = new Date(visibleStartTime);
            return date.getDate() === currentDay.getDate();
        });

        return filteredData;
    }

    const filteredPasses = filterData(currentDay);

    const renderContent = () => {
        if (!userLocation) return (
            <Alert status='warning'>
                <AlertIcon />
                    <T dictKey="alertLocationMessOverflights" />
                </Alert>
        )

        if (!passes?.length) return (
            <Alert status='info'>
                <AlertIcon />
                <T dictKey="alertMessNoPasses" />
            </Alert>
        )

        return renderTable();
    };

    const renderTable = () => (
        <TableContainer>
            <Table size='sm'>
                <Thead>
                    {renderHeader(tableHeaderTranslationKeys)}
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
                    <Th key={uuidv4()}>
                        {<T dictKey={key} />}
                    </Th>
                ))
            }
        </Tr>
    )

    const renderRows = () => {
        if (!filteredPasses?.length) return; 

        return (
            filteredPasses.map((pass) => (
                <Tr key={uuidv4()}>
                    <Td key={uuidv4()}>
                        <Link to={appendQueryParams(
                            routes.passes.satellite.details.goTo(satelliteId as string), 
                            { 
                                startVisibleDate: pass.visibleStartTime.toISOString(),
                                coords: userLocation.coordinates[0] + ',' + userLocation.coordinates[1]
                            })}>
                            <SearchIcon />
                        </Link>
                    </Td>
                    {renderCells(pass)}
                </Tr>
            ))
        )
    };

    const renderCells = (pass: IOverflight) => (
        passesKeys.map((key) => {
            return (
                <Td key={uuidv4()}>
                    {pass[key] ? getHoursMinutesSeconds(pass[key]) : '-'}
                </Td>
            )            
        })
    );

    const handleNextDay = () => {
        const nextDay = new Date(currentDay);
        nextDay.setDate(nextDay.getDate() + 1);
        setCurrentDay(nextDay);
    };

    const handlePreviousDay = () => {
        const previousDay = new Date(currentDay);
        previousDay.setDate(previousDay.getDate() - 1);
        setCurrentDay(previousDay);
    }

    return (
        <Box p={5}>
            <Text><T dictKey="passesFor" /> <b>{`${name}`}</b> <T dictKey="forTheLocation" />: <b>{coordinatesToDM(userLocation.coordinates[1], userLocation.coordinates[0])}</b></Text>
            <Box h="100%">
                <Center>
                    {isPreviousButtonVisible ? <Button variant="outline" onClick={handlePreviousDay}><T dictKey="previous"/></Button> : null}
                    <Heading as='h4' size='md' m={4}>
                        <T dictKey="day" />: {formatDate(currentDay)}
                    </Heading>
                    <Button variant="outline" onClick={handleNextDay}><T dictKey="next"/></Button>
                </Center>
                {renderContent()}
            </Box>
        </Box>
    );
}