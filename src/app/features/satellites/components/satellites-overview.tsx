import { Box } from "@chakra-ui/react";
import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef, GridSlots } from '@mui/x-data-grid'

import { useSatellites } from "../data-access/get-satellites.query";
import { FC } from "react";

const columns: GridColDef[] = [
    { field: 'OBJECT_ID', headerName: 'Object ID', width: 150 },
    { field: 'NORAD_CAT_ID', headerName: 'Norad cat id', width: 150 },
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
    group: string
}

export const SatellitesList: FC<ISatellitesList> = ({ group }) => {

    const { data, isLoading } = useSatellites({ GROUP: group })
    
    return (
        <Box paddingTop={5} paddingRight={5} paddingLeft={5} height={'100%'}>
            <DataGrid 
                rows={data || []} 
                columns={columns}
                getRowId={(row) => row.OBJECT_ID}
                density="compact"
                disableColumnMenu
                disableRowSelectionOnClick
                loading={isLoading}
                disableVirtualization
                pageSizeOptions={[25, 50, 100]}
                rowHeight={35}
                columnBufferPx={17}
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                  }}
                />
        </Box>
    )
};