import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";
import DrawerSatDetails from "./drawer-sat-details";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";

// Mock the getSatelliteTle function
vi.mock("../../../shared/utils/getSatelliteTle", () => ({
    getSatelliteTle: vi.fn(),
}));

const mockNoradIdISS = '25544';
const mockTleData = [
    "ISS (ZARYA)             ",
    "1 25544U 98067A   24318.92348638 -.05293113  00000+0 -11407+0 0  9998",
    "2 25544  51.6128 293.5426 0013583 139.8593 260.7136 15.48469507481775",
];

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
            terminate = vi.fn(); 
            onmessage = null;   
        } as unknown as typeof Worker

        (getSatelliteTle as Mock).mockImplementation(() => mockTleData);
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

    it('renders drawer when isOpen is true', () => {
        rendersWithProviders(<DrawerSatDetails isOpen={true} onClose={vi.fn()} noradId={""} />);

        const container = screen.getByTestId('drawer-sat-details');
        expect(container).toBeInTheDocument();
    });

    it('not renders drawer when isOpen is false', () => {
        rendersWithProviders(<DrawerSatDetails isOpen={false} onClose={vi.fn()} noradId={""} />);

        const drawer = screen.queryByTestId("drawer-sat-details");
        expect(drawer).not.toBeInTheDocument();
    });

    it('renders noradId in component', () => {
        rendersWithProviders(<DrawerSatDetails isOpen={true} onClose={vi.fn()} noradId={mockNoradIdISS} />);

        const noradId = screen.getByTestId('noradId-value-text');
        expect(noradId.textContent).toEqual(`Norad ID: ${mockNoradIdISS}`);
    });
});