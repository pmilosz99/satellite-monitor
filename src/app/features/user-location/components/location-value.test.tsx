import { MemoryRouter } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import { vi } from "vitest";
import { LocationValue } from "./location-value";
import { ChakraProvider } from "@chakra-ui/react";

const mockValues = {
    latitude: '50.0000',
    longtitude: '20.0000',
    altitude: '123',
    closePopover: vi.fn(),
}

describe('LocationValue component', () => {
    const renderWithProviders = (ui: JSX.Element) => (
        render(
            <MemoryRouter>
                <ChakraProvider>
                    {ui}            
                </ChakraProvider>
            </MemoryRouter>
        )
    );

    it('render loction values', () => {
        renderWithProviders(
            <LocationValue 
                latitude={mockValues.latitude} 
                longtitude={mockValues.longtitude} 
                altitude={mockValues.altitude} 
                closePopover={mockValues.closePopover}
            />
        )

        screen.debug();

        const longitude = screen.getByText('50.0000');
        const latitude = screen.getByText('20.0000');
        const altitude = screen.getByText('123 m');

        expect(longitude).toBeInTheDocument();
        expect(latitude).toBeInTheDocument();
        expect(altitude).toBeInTheDocument();
    });
});