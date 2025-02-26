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
    upcomingPasses: 'upcoming-passes',
};
