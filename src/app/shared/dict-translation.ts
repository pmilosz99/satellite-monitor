export enum LANGUAGE_VALUES {
    EN = 'en',
    PL = 'pl-PL',
}

export type TLngDict = {
    [key in LANGUAGE_VALUES]: Record<string, string>;
};

export const dict: TLngDict = {
    [LANGUAGE_VALUES.EN]: {
        //layout
        database: 'Database',
        amateurRadio: 'Amateur radio',
        spaceStations: 'Space stations',
        activeSatellites: 'Active satellites',
        satellitesLive: 'Satellites live',
        satellitesAbove: 'Satellites above',
        futureFeatures: 'Future features',
        map: 'Map',
        map3d: 'Map 3D',
        developedAndMainted: 'Developed and maintained by ',
        devVersion: '· Development version',
        searchSatellite: 'Search for a satellite',
        fetchErrorData: 'Data fetch error',
        new: 'new',
        //home-page
        homePageWelcome: 'Welcome to Satellite Monitor',
        homePageDisc: `The Satellite Monitor is a hobby project to facilitate nighttime satellite observing. 
        This application allows you to browse databases of active satellites and, most importantly, 
        view the satellites that are actually passing overhead so that you can accurately plan your nightly 
        satellite observations. In the future, detailed satellite information and a map with the orbits 
        of the satellites will be added together with a 3d map.`,
        //user-location
        yourLocation: 'Your location',
        location: 'Location',
        latitude: 'Latitude',
        longtitude: 'Longtitude',
        altitude: 'Altitude',
        selectManualy: 'or select manually location',
        here: 'here',
        requiresLocation: 'The application requires a location to function properly. Please select a location by clicking',
        allowLocation: 'or allow localization in your browser and refresh the application',
        setLocation: 'Set location',
        resetLocation: 'Reset location',
        locationInfo: 'Click on the map to set the location.',
        locationRemoved: 'Location removed',
        locationSetSucc: 'Location set successful',
        locationSharing: 'Location sharing',
        youHave: 'You have ',
        turnedOff: 'turned off ',
        automaticLocation: `automatic location sharing. 
        For all application features to work, you must enable location sharing or manually select`,
        //satellite details
        satelliteDetails: 'Satellite details',
        height: 'Height',
        name: 'Name',
        numberOrbit: 'Number of orbits',
        orbitTime: 'Time at which the object circles the earth',
        warningNumberOrbit: 'Drawing a large number of orbits can take a while.',
        zoom: 'Zoom in',
        trackPosition: 'Track position',
        on: 'on',
        off: 'off',
        notFoundSat: 'Satellite not found',
        fetchErrorDesc: 'A fetch data error has occurred. Please try again in two hour',
        //map2d
        satellite: 'Satellite',
        apogee: 'Apogee',
        perigee: 'Perigee',
        period: 'Orbital period',
        moreDetails: 'More details',
    },
    [LANGUAGE_VALUES.PL]: {
        //layout
        database: 'Bazy danych',
        amateurRadio: 'Radioamatorskie',
        spaceStations: 'Stacje kosmiczne',
        activeSatellites: 'Aktywne satelity',
        satellitesLive: 'Satelity na żywo',
        satellitesAbove: 'Przeloty satelitów',
        futureFeatures: 'Przyszłe funkcje',
        map: 'Mapa',
        map3d: 'Mapa 3D',
        developedAndMainted: 'Aplikacja stworzona i utrzymywana przez ',
        devVersion: '· Wersja deweloperska',
        searchSatellite: 'Wyszukaj satelitę',
        new: 'nowe',
        //home-page
        homePageWelcome: 'Witaj na Satellite Monitor',
        homePageDisc: `Satellite Monitor jest to hobbistyczny projekt, który umożliwa planowanie nocnych obserwacji satelitów.
        Ta aplikacja pozwala na przeglądanie baz danych aktywnych satelitów oraz co najważniejsze, przeglądać satelity, które
        akurat przelatują nad naszymi głowami, więc możesz planować nocne obserwacje satelitów. W przyszłości zostaną dodane takie funkcje jak
        mapa wraz z orbitami satelitów a także mapa 3D.`,
        //user-location
        yourLocation: 'Twoja lokalizacja',
        location: 'Lokalizacja',
        latitude: 'Szerokość geograficzna',
        longtitude: 'Długość geograficzna',
        altitude: 'Wysokość',
        selectManualy: 'lub wybierz lokalizację ręcznie',
        here: 'tutaj',
        requiresLocation: 'Aplikacja wymaga lokalizacji aby funkcjonować poprawnie. Wybierz ręcznie lokalizację przez kliknięcie',
        allowLocation: 'lub zezwól na udostępnianie swojej lokalizacji przez przeglądarkę i odśwież aplikację',
        setLocation: 'Ustaw lokalizację',
        resetLocation: 'Zresetuj lokalizację',
        locationInfo: 'Kliknij na mapę aby wybrać lokalizację.',
        locationRemoved: 'Lokalizacja usunięta',
        locationSetSucc: 'Lokalizacja wybrana pomyślnie',
        locationSharing: 'Udostępnianie lokalizacji',
        youHave: 'Właśnie ',
        turnedOff: 'wyłączyłeś ',
        automaticLocation: `automatyczną lokalizację. 
        Dla poprawnego działania aplikacji musisz udostępnić lokalizację lub manualnie wybrać`,
        //satellite details
        satelliteDetails: 'Dane szczegółowe',
        height: 'Wysokość',
        name: 'Nazwa',
        numberOrbit: 'Ilość orbit',
        orbitTime: 'Czas w jakim obiekt okrąża ziemie',
        warningNumberOrbit: 'Narysowanie dużej ilości orbit może chwilę potrwać',
        zoom: 'Przybliż',
        trackPosition: 'Śledź pozycję',
        on: 'wł',
        off: 'wył',
        notFoundSat: 'Nie znaleziono satelity',
        fetchErrorData: 'Błąd pobierania danych',
        fetchErrorDesc: 'Wystąpił błąd pobierania danych. Spróbuj ponownie za dwie godziny',
        //map2d
        satellite: 'Satelita',
        apogee: 'Apogeum',
        perigee: 'Perigeum',
        period: 'Okres orbitalny',
        moreDetails: 'Więcej szczegółów',
    }
}