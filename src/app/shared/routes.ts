export const routes = {
    home: '/',
    satellite: {
        list: {
            starlink: 'satellites/starlink',
            oneWeb: 'satellites/one-web',
            amateurSatellites: 'satellites/amateur-satellites',
            spaceStation: 'satellites/space-stations',
            allSatellites: 'satellites',
        },
        item: {
            path: '/satellites/:satelliteId',
            goTo: (satelliteId: string) => '/satellites/:satelliteId'.replace(':satelliteId', satelliteId),
        }

    },
    selectLocation: 'select-location',
    satellitesAbove: 'satellites-above',
    map: 'map',
    settings: 'settings',
    passes: {
        path: 'passes',
        satellite: {
            path: '/passes/:satelliteId',
            goTo: (satelliteId: string) => '/passes/:satelliteId'.replace(':satelliteId', satelliteId),
            details: {
                path: '/passes/:satelliteId/details',
                goTo: (satelliteId: string) => '/passes/:satelliteId/details'.replace(':satelliteId', satelliteId),
            }
        }
    }
}; 
