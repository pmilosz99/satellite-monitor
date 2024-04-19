import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAtomValue } from "jotai";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
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

import { THEME_TYPE, darkTheme, lightTheme } from "./shared/themes";
import { currentTheme, language } from "./shared/atoms";
import { LANGUAGE_VALUES } from "./shared/dict-translation";
import { plPL } from "@mui/material/locale";

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

export function App() {
  const { colorMode } = useColorMode();
  const atomTheme = useAtomValue(currentTheme); 
  const atomLanguage = useAtomValue(language);

  const currLng = atomLanguage === LANGUAGE_VALUES.PL ? plPL : {};
  const materialTheme = muiCreateTheme(currLng);

  /**
   * We have to use both solutions (useColorMode and atom value) 
   * because useColorMode dont working 
   * (is undefined here and component App not refresh)
   */
  const initialMode = colorMode === undefined ? atomTheme : colorMode;

  const theme = initialMode === THEME_TYPE.DARK ? darkTheme : lightTheme;

  return (
    <ChakraProvider theme={theme}>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>  
      </MaterialThemeProvider>
    </ChakraProvider>
  )
}

export default App
