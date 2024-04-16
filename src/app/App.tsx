import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme as chakraExtendTheme } from "@chakra-ui/react";
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from '@mui/material/styles';

import { Layout } from "./Layout"

import { queryClient } from "./shared/react-query";
import { routes } from "./shared/routes";
import { HomePage } from "./features/home-page";

import { SatellitesList } from "./features/satellites/components/satellites-overview";
import { SelectLocation } from "./features/user-location/containers";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: routes.starlink.list,
        element: <SatellitesList group="starlink"/>,
      },
      {
        path: routes.oneWeb.list,
        element: <SatellitesList group="oneweb"/>,
      },
      {
        path: routes.amateurSatellites.list,
        element: <SatellitesList group="amateur"/>,
      },
      {
        path: routes.spaceStations.list,
        element: <SatellitesList group="stations"/>,
      },
      {
        path: routes.allSatellites.list,
        element: <SatellitesList group="active"/>
      },
      {
        path: routes.selectLocation,
        element: <SelectLocation />
      }
    ]
  },

]);

const chakraTheme = chakraExtendTheme();
const materialTheme = muiCreateTheme();

export function App() {

  return (
    <ChakraProvider theme={chakraTheme} resetCSS>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>  
      </MaterialThemeProvider>
    </ChakraProvider>
  )
}

export default App
