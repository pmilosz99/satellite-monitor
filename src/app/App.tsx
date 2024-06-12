import { FC, PropsWithChildren, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { UseQueryResult } from "@tanstack/react-query";
import { ChakraProvider, useColorMode, useToast } from "@chakra-ui/react";
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from '@mui/material/styles';
import { plPL } from "@mui/material/locale";

import { Layout } from "./Layout"

import { routes } from "./shared/routes";
import { HomePage } from "./features/home-page";

import { T } from "./shared/components";
import { Map2d } from "./features/map2d/containers";
import { SatelliteList } from "./features/satellites/containers/satellite-list";
import { SatelliteDetails } from "./features/satellites/containers/satellite-details";
import { SelectLocation } from "./features/user-location/containers";

import { THEME_TYPE, darkTheme, lightTheme } from "./shared/themes";
import { currentTheme, language, tle } from "./shared/atoms";
import { LANGUAGE_VALUES } from "./shared/dict-translation";

import { useSatellites } from "./features/satellites/data-access";
import { Settings } from "./features/settings/containers";

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
        path: routes.satellite.item.path,
        element: <SatelliteDetails />
      },
      {
        path: routes.satellite.list.starlink,
        element: <SatelliteList group="starlink"/>,
      },
      {
        path: routes.satellite.list.oneWeb,
        element: <SatelliteList group="oneweb"/>,
      },
      {
        path: routes.satellite.list.amateurSatellites,
        element: <SatelliteList group="amateur"/>,
      },
      {
        path: routes.satellite.list.spaceStation,
        element: <SatelliteList group="stations"/>,
      },
      {
        path: routes.satellite.list.allSatellites,
        element: <SatelliteList group="active"/>,
      },
      {
        path: routes.selectLocation,
        element: <SelectLocation />
      },
      {
        path: routes.map,
        element: <Map2d />
      },
      {
        path: routes.settings,
        element: <Settings />
      }
    ]
  },
]);

const ThemeAndLngChanger: FC<PropsWithChildren> = ({ children }) => {
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
        {children}
      </MaterialThemeProvider>
    </ChakraProvider>
  )
};

export function App() {
  const setTle = useSetAtom(tle);
  const toast = useToast();

  const tleQuery = useSatellites({ GROUP: 'active', FORMAT: 'tle' }) as  UseQueryResult<string>;

  const handleFetctTleQueryError = (): void => {
    if (tleQuery.isError) {
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

  const setGlobalTleQuery = (): void => {
    setTle(tleQuery || null);
  };

  useEffect(setGlobalTleQuery, [tleQuery, setTle]);
  useEffect(handleFetctTleQueryError, [tleQuery, toast]);

  return (
    <ThemeAndLngChanger>
        <RouterProvider router={router} />
    </ThemeAndLngChanger>
  )
}

export default App
