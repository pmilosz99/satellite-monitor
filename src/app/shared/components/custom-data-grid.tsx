import { FC } from "react";
import { useColorMode } from "@chakra-ui/react";

import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef, GridRowIdGetter, GridRowsProp, GridSlots } from "@mui/x-data-grid"

import { THEME_TYPE } from "../themes";

interface ICustomDataGrid {
    rows: GridRowsProp;
    columns: GridColDef[];
    getRowId: GridRowIdGetter;
    isLoading: boolean;
}

export const CutomDataGrid: FC<ICustomDataGrid> = ({
    rows,
    columns,
    getRowId,
    isLoading,
}) => {
    const { colorMode } = useColorMode();

    const isDarkMode = colorMode === THEME_TYPE.DARK;

    const defaultTheme = {
        '& .MuiLinearProgress-root': {
            backgroundColor: isDarkMode ? '#3f444e' : '#eef1f6',
        },
        '& .MuiLinearProgress-bar': {
            backgroundImage: 'linear-gradient(to left, #7928CA, #FF0080)',
        }
    }
    
    const darkStyle = {
        borderColor: '#ffffff29',
        '--DataGrid-containerBackground': '#1a202c',
        '--DataGrid-rowBorderColor': '#ffffff29',
        '& .MuiTablePagination-root': {
            color: 'white'
        },
        '& .MuiSvgIcon-root': {
            color: 'white'
        },
        '& .MuiDataGrid-footerContainer': {
            borderColor: '#ffffff29',
        },
        color: 'white',
    };

    const theme = isDarkMode ? darkStyle : {};

    return (
        <DataGrid 
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            loading={isLoading}
            density="compact"
            disableColumnMenu
            disableRowSelectionOnClick
            disableVirtualization
            pageSizeOptions={[25, 50, 100]}
            rowHeight={35}
            columnBufferPx={17}
            slots={{
                loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
              }}
            sx={{ ...defaultTheme, ...theme }}
        />
    )
};
