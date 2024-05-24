import { FC, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { GridColDef } from '@mui/x-data-grid';

import { useSatellites } from "../data-access/get-satellites.query";

import { CutomDataGrid } from "../../../shared/components/custom-data-grid";
import { CustomLink } from "../../../shared/components/custom-link";
import { routes } from "../../../shared/routes";
import { T } from "../../../shared/components";

const columns: GridColDef[] = [
    { field: 'NORAD_CAT_ID', headerName: 'Norad ID', width: 150, renderCell: (row) =>  <CustomLink to={routes.satellite.item.goTo(row.value)}>{row.value}</CustomLink>},
    { field: 'OBJECT_ID', headerName: 'Object ID', width: 150 },
    { field: 'OBJECT_NAME', headerName: 'Name', width: 150 },
    { field: 'EPOCH', headerName: 'Epoch', width: 250 },
    { field: 'MEAN_MOTION', headerName: 'Mean motion', width: 150 },
    { field: 'ECCENTRICITY', headerName: 'Eccentricity', width: 150 },
    { field: 'INCLINATION', headerName: 'Inclination', width: 150 },
    { field: 'RA_OF_ASC_NODE', headerName: 'Ra of asc node', width: 150 },
    { field: 'ARG_OF_PERICENTER', headerName: 'Arg of pericenter', width: 150 },
    { field: 'MEAN_ANOMALY', headerName: 'Mean anomaly', width: 150 },
    { field: 'EPHEMERIS_TYPE', headerName: 'Ephemeris type', width: 150 },
    { field: 'CLASSIFICATION_TYPE', headerName: 'Classification type', width: 150 },
    { field: 'ELEMENT_SET_NO', headerName: 'Element set no', width: 150 },
    { field: 'REV_AT_EPOCH', headerName: 'Rev at epoch', width: 150 },
    { field: 'BSTAR', headerName: 'Bstar', width: 150 },
    { field: 'MEAN_MOTION_DOT', headerName: 'Mean motion dot', width: 150 },
    { field: 'MEAN_MOTION_DDOT', headerName: 'Mean motion ddot', width: 150 },
];

interface ISatellitesList {
    group: string;
}

export const SatelliteList: FC<ISatellitesList> = ({ group }) => {
    const toast = useToast();

    const { data, isLoading, isError } = useSatellites({ GROUP: group, FORMAT: 'json' });
    
    const handleFetchTleQueryError = () => {
        if (isError) {
            toast({
                title: <T dictKey="fetchErrorData" />,
                description: <T dictKey="fetchErrorDesc" />,
                status: "error",
                position: 'top-right',
                duration: 10000,
                isClosable: true,
              })
        }
    };

    useEffect(handleFetchTleQueryError, [isError, toast]);

    return (
        <Box pt={5} pr={5} pl={5} height={'100%'}>
            <CutomDataGrid 
                rows={data as [] || []} 
                columns={columns}
                getRowId={(row) => row?.NORAD_CAT_ID}
                isLoading={isLoading}
                />
        </Box>
    )
};