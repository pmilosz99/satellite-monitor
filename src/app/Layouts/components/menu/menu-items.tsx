import { T } from "../../../shared/components/translator";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { To } from "react-router-dom";

import StorageIcon from '@mui/icons-material/Storage';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

import { routes } from "../../../shared/routes";

interface ISectionItem {
    title: string;
    route: string;
}

interface ISection {
    title: string;
    icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
        muiName: string;
    }
    route?: To;
    children?: ISectionItem[];
    isAlignBottom?: boolean;
}

export const MENU_ITEMS: ISection[] = [
    {
        title: <T dictKey="database" /> as unknown as string,
        icon: StorageIcon,
        children: [
            {
                title: 'Starlink',
                route: routes.satellite.list.starlink,
            },
            {
                title: 'OneWeb',
                route: routes.satellite.list.oneWeb,
            },
            {
                title: <T dictKey="amateurRadio" /> as unknown as string,
                route: routes.satellite.list.amateurSatellites,
            },
            {
                title: <T dictKey="spaceStations" /> as unknown as string,
                route: routes.satellite.list.spaceStation,
            },
            {
                title: <T dictKey="activeSatellites" /> as unknown as string,
                route: routes.satellite.list.allSatellites,
            },
        ]
    },
    {
        title: <T dictKey="map" /> as unknown as string,
        icon: MapIcon,
        route: routes.map,
    },
    {
        title: <T dictKey="settings" /> as unknown as string,
        icon: SettingsIcon,
        route: routes.settings,
        isAlignBottom: true,
    }
]