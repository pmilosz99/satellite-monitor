import { ChakraProvider } from "@chakra-ui/react";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { SelectLocation } from "./select-location";
import { MemoryRouter } from "react-router-dom";
import { useMap } from "../../../shared/hooks";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../../shared/react-query";
import { LocationPopover } from "../components";
import BaseEvent from "ol/events/Event";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import Map from 'ol/Map';
import { Vector } from 'ol/layer.js';
import Feature from "ol/Feature";

vi.mock('ol/Map', async () => {
    const actual = await vi.importActual<typeof import('ol/Map')>('ol/Map');
    return {
      ...actual,
      updateSize: vi.fn(),
    };
});

const mockGeolocation = { getCurrentPosition: vi.fn() };
//geo coords 21.9288;51.6270 x;y
const mockCoords = {
    longitude: 2441097.6253088927,
    latitude: 6732965.18624426, 
}
const mockGeolocationPosition = { coords: {
    ...mockCoords,
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null, 
    speed: null,
    toJSON: () => null
}, timestamp: 0, toJSON: () => null };
const mockGeolocationError: GeolocationPositionError = { code: 0, message: 'example error message', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };

type TMockGeolocation = { geolocation: typeof mockGeolocation };

(global.navigator as unknown as TMockGeolocation).geolocation = mockGeolocation;

const callSuccessfulGeolocation = () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((success) => success(mockGeolocationPosition));
};

const callErrorGeolocation = () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((_, error) => error ? error(mockGeolocationError) : undefined);
};

describe('SelectLocation component', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        };
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithProviders = (ui: JSX.Element) => (
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChakraProvider>
                        {ui}
                    </ChakraProvider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    );

    it('renders map component', () => {
        renderWithProviders(<SelectLocation />);

        const map = screen.getByTestId('map-select-location-testid');

        expect(map).toBeInTheDocument();
    });
    
    it('renders set location component', () => {
        renderWithProviders(<SelectLocation />);

        const map = screen.getByTestId('set-location-stack');

        expect(map).toBeInTheDocument();
    });

    it('renders point if is successful geolocation', async () => {
        await waitFor(callSuccessfulGeolocation);

        renderWithProviders(<LocationPopover />);
        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        const layersCount = mapRef?.getLayers().getArray().length;

        expect(layersCount).toEqual(2);
    });

    it('not renders point if is error geolocation', async () => {
        await waitFor(callErrorGeolocation);

        renderWithProviders(<LocationPopover />);
        renderWithProviders(<SelectLocation />);
        
        const { result: { current: mapRef } } = renderHook(() => useMap());

        const layersCount = mapRef?.getLayers().getArray().length;

        expect(layersCount).toEqual(1);
    });

    it('remove point when gelocation is deleted', async () => {
        await waitFor(callSuccessfulGeolocation);

        renderWithProviders(<LocationPopover />);
        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        const layersCount = mapRef?.getLayers().getArray().length;    

        expect(layersCount).toEqual(2);

        const deletedGeolocationButton = screen.getByTestId('remove-location-button');
        fireEvent.click(deletedGeolocationButton);

        const layersCountAfterDeleted = mapRef?.getLayers().getArray().length;

        expect(layersCountAfterDeleted).toEqual(1);
    });

    const getPointCoordinates = (mapRef: Map): Coordinate | undefined => {
        const layer = mapRef.getLayers().getArray().find((layer) => 
            layer instanceof VectorLayer && 
            layer.getSource() instanceof VectorSource &&
            layer.getSource().getFeatures()[0]?.getGeometry() instanceof Point
        ) as Vector<VectorSource<Feature<Point>>>;
    
        return layer?.getSource()?.getFeatures()[0]?.getGeometry()?.getCoordinates();
    };

    it('remove point and add new after click ', async () => {
        await waitFor(callErrorGeolocation);

        renderWithProviders(<LocationPopover />);
        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        if (!mapRef) return;

        const initLayersCount = mapRef.getAllLayers().length;
        expect(initLayersCount).toEqual(1);

        //first click on map
        await act(async () => {
            mapRef.dispatchEvent({ type: 'click', coordinate: [ mockCoords.longitude, mockCoords.latitude ]} as unknown as BaseEvent );
        });

        const firstClickLayerCount = mapRef.getAllLayers().length;
        expect(firstClickLayerCount).toEqual(2);
        
        const coordsAfterFirstClick = getPointCoordinates(mapRef);
        expect(coordsAfterFirstClick).toEqual([ mockCoords.longitude, mockCoords.latitude ]);
    
        //second click on map
        await act(async () => {
            mapRef.dispatchEvent({ type: 'click', coordinate: [ 2541097.6253, 6832965.1862 ]} as unknown as BaseEvent );
        });

        const secondClickLayerCount = mapRef.getAllLayers().length;
        expect(secondClickLayerCount).toEqual(2);

        const coordsAfterSecondClick = getPointCoordinates(mapRef);
        expect(coordsAfterSecondClick).toEqual([ 2541097.6253, 6832965.1862 ]);
    });

    it('render correct coords in component', async () => {
        await waitFor(callSuccessfulGeolocation);

        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        if (!mapRef) return;

        //click on map
        await act(async () => {
            mapRef.dispatchEvent({ type: 'click', coordinate: [ mockCoords.longitude, mockCoords.latitude ]} as unknown as BaseEvent ); // geo coords 21.9288;51.6270 x;y
        });

        const latitude = screen.getByTestId('select-location-latitude-value');
        expect(latitude.textContent).toEqual('51.6270');

        const longitude = screen.getByTestId('select-location-longtitude-value');
        expect(longitude.textContent).toEqual('21.9288');
    });

    it('render toast after save geolocation', async () => {
        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        if (!mapRef) return;

        //click on map
        await act(async () => {
            mapRef.dispatchEvent({ type: 'click', coordinate: [ mockCoords.longitude, mockCoords.latitude ]} as unknown as BaseEvent ); // geo coords 51.6270;21.9288 y;x
        });

        const saveButton = screen.getByTestId('set-location-button');
        fireEvent.click(saveButton);

        await screen.findByText('Location set successful');
    });
    
    it('render toast after delete geolocation', async () => {
        renderWithProviders(<SelectLocation />);

        const { result: { current: mapRef } } = renderHook(() => useMap());

        if (!mapRef) return;

        //click on map
        await act(async () => {
            mapRef.dispatchEvent({ type: 'click', coordinate: [ mockCoords.longitude, mockCoords.latitude ]} as unknown as BaseEvent ); // geo coords 51.6270;21.9288 y;x
        });

        const saveButton = screen.getByTestId('remove-location-button');
        fireEvent.click(saveButton);

        await screen.findByText('Location removed');
    });
});