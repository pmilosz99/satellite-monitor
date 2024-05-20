import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from '@mui/material/styles';

import { Layout } from "./Layout"

import { routes } from "./shared/routes";
import { HomePage } from "./features/home-page";

import { SatelliteList } from "./features/satellites/containers/satellite-list";
import { SelectLocation } from "./features/user-location/containers";

import { THEME_TYPE, darkTheme, lightTheme } from "./shared/themes";
import { currentTheme, language, tle } from "./shared/atoms";
import { LANGUAGE_VALUES } from "./shared/dict-translation";
import { plPL } from "@mui/material/locale";
import { SatelliteDetails } from "./features/satellites/containers/satellite-details";
import { useSatellitesTle } from "./features/satellites/data-access";
import { useEffect } from "react";

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
      }
    ]
  },
]);

export function App() {
  const { colorMode } = useColorMode();
  const atomTheme = useAtomValue(currentTheme); 
  const atomLanguage = useAtomValue(language);
  const setTle = useSetAtom(tle);

  const currLng = atomLanguage === LANGUAGE_VALUES.PL ? plPL : {};
  const materialTheme = muiCreateTheme(currLng);

  const { data: tleData } = useSatellitesTle({ GROUP: 'active' });

  useEffect(() => {
    setTle(tleData || null);
  }, [tleData, setTle]);

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
        <RouterProvider router={router} />
      </MaterialThemeProvider>
    </ChakraProvider>
  )
}

export default App
