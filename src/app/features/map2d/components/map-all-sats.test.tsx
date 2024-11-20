import { Mock, vi } from "vitest";
import { getSatelliteTle } from "../../../shared/utils/getSatelliteTle";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import MapAllSats from "./map-all-sats";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../../shared/react-query";
import { useTle } from "../../../shared/hooks";

vi.mock("../../../shared/utils/getSatelliteTle", () => ({
    getSatelliteTle: vi.fn(),
}));

vi.mock(import("../../../shared/hooks"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...actual,
      useTle: vi.fn(),
    }
  })

// const mockNoradIdISS = '25544';
const mockTleData = [
    "ISS (ZARYA)             ",
    "1 25544U 98067A   24318.92348638 -.05293113  00000+0 -11407+0 0  9998",
    "2 25544  51.6128 293.5426 0013583 139.8593 260.7136 15.48469507481775",
];

// const mockJsonTleData = [
//     { name:'CALSPHERE 1', noradId: 900, line1: "1 00900U 64063C   24322.80493065  .00001171  00000+0  12031-2 0  9994", line2: "2 00902  90.2276  62.4007 0020483 100.1099  22.4271 13.52832551778336"},
//     { name:'CALSPHERE 2', noradId: 902, line1: "1 00902U 64063E   24322.81354319  .00000095  00000+0  12915-3 0  9991", line2: "2 00900  90.2119  58.6883 0024931 232.6634 225.4053 13.75586596992147"},
//     { name:'LCS 1', noradId: 1361, line1: "1 01361U 65034C   24323.49654307 -.00000011  00000+0 -25379-2 0  9992", line2: "2 01361  32.1387 103.9071 0009356 239.7121 120.2450  9.89307290153219"},
//     { name:'TEMPSAT 1', noradId: 1512, line1: "1 01512U 65065E   24322.96763005  .00000098  00000+0  17681-3 0  9992", line2: "2 01512  89.9676 213.4975 0071449  67.2523 304.5008 13.33541805883256"},
//     { name:'CALSPHERE 4A', noradId: 1520, line1: "1 01520U 65065H   24323.44873175  .00000136  00000+0  24605-3 0  9992", line2: "2 01520  89.9324 127.1702 0067758 288.5994 102.7211 13.36132779886236"},
// ];

describe('MapAllSats component', () => {
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
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChakraProvider>
                        {ui}
                    </ChakraProvider>
                </MemoryRouter>
            </QueryClientProvider>
            
        )
    };

    it('renders map component', () => {
        rendersWithProviders(
            <MapAllSats 
                setNoradId={vi.fn()} 
                isDrawerOpen={false} 
                setOpenDrawer={vi.fn()} 
                setCloseDrawer={vi.fn()} 
            />
        );

        const mapContainer = screen.getByTestId('map-2d-all-sats');
        expect(mapContainer).toBeInTheDocument();
    });

    it('renders a loading spinner when tle.isLoading is true', () => {
        (useTle as Mock).mockReturnValue({ isLoading: true });

        rendersWithProviders(<MapAllSats setNoradId={vi.fn()} setOpenDrawer={vi.fn()} setCloseDrawer={vi.fn()} isDrawerOpen={false} />);
        expect(screen.getByTestId('map2d-loading-spinner')).toBeInTheDocument();
    });

    //TODO: complete the tests

});