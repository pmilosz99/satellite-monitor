import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import Map2d from "./map2d";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

describe('Map2d page component', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        };

        global.Worker = class {
            addEventListener = vi.fn();
            removeEventListener = vi.fn();
            dispatchEvent = vi.fn();
            postMessage = vi.fn();
            terminate = vi.fn();        // Mock the terminate method
            onmessage = null;   
        } as unknown as typeof Worker
    });

    const rendersWithProviders = (ui: JSX.Element) => {
        render(
            <MemoryRouter>
                <ChakraProvider>
                    {ui}
                </ChakraProvider>
            </MemoryRouter>
        )
    };

    it('renders container', () => {
        rendersWithProviders(<Map2d />);

        const container = screen.getByTestId('map2d-container');
        expect(container).toBeInTheDocument();
    });
})