import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { queryClient } from "../../../shared/react-query";
import { LocationPopover } from "./location-popover";

const mockGeolocation = { getCurrentPosition: vi.fn() };
const mockCoords: GeolocationPosition = { coords: {
    latitude: 20.0000, longitude: 50.0000,
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

describe('LocationPopover', () => {
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

    const callSuccessfulGeolocation = () => {
        vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((success) => success(mockCoords));
    };

    const callErrorGeolocation = () => {
        vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((_, error) => error ? error(mockGeolocationError) : undefined);
    }

    it('renders ON icon after successful geolocation', async () => {
        await waitFor(callSuccessfulGeolocation);

        renderWithProviders(<LocationPopover />);

        const onIcon = screen.getByTestId('location-on-icon');
        expect(onIcon).toBeInTheDocument();
    });

    it('renders OFF icon after geolocation error', async () => {
        await waitFor(callErrorGeolocation);

        renderWithProviders(<LocationPopover />);

        const onIcon = screen.getByTestId('location-off-icon');
        expect(onIcon).toBeInTheDocument();
    });

    it('renders popover after click button', async () => {
        await waitFor(callSuccessfulGeolocation);

        renderWithProviders(<LocationPopover />);

        const button = screen.getByTestId('location-button');
        fireEvent.click(button);

        const contentContainer = screen.getByTestId('location-popover-content');

        expect(contentContainer).toBeInTheDocument();
    });

    it('renders error toast after geolocation error', async () => {
        await waitFor(callErrorGeolocation);

        renderWithProviders(<LocationPopover />);

        const toast = screen.getByTestId('location-toast-error');
        expect(toast).toBeInTheDocument();
    })
});