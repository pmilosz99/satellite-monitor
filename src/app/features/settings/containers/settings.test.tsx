import { render, screen, fireEvent } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { useAtom } from 'jotai';
import { useToast } from '@chakra-ui/react';

vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof import('jotai')>('jotai');
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual<typeof import('@chakra-ui/react')>('@chakra-ui/react');
  return {
    ...actual,
    useToast: vi.fn().mockReturnValue(() => {}),
  };
});

import Settings from './settings';

describe('Settings Component', () => {
  const mockSetValues = vi.fn();
  const mockUseAtom = useAtom as Mock;
  const mockUseToast = useToast as Mock;

  beforeEach(() => {
    mockUseAtom.mockReturnValue([
      { REFRESH_SAT_MS: 1500 },
      mockSetValues,
    ]);
    mockUseToast.mockReturnValue(() => {});
  });

  it('renders the component', () => {
    render(<Settings />);
    expect(screen.getByText(/Application settings/i)).toBeInTheDocument();
  });

  it('calls setValues on input change', () => {
    render(<Settings />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: '1500' } });
    fireEvent.blur(input);

    expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function));
    expect(mockUseToast).toHaveBeenCalled();
  });
});