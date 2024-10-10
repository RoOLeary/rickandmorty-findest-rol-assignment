import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Locations from './Locations'; // Adjust the import path
import { useGetLocationsListQuery } from './../services/rickandmorty';

// Mock the API hook
jest.mock('./../services/rickandmorty', () => ({
  useGetLocationsListQuery: jest.fn(),
}));

// Mock lodash debounce
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

describe('Locations Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('search input updates correctly', async () => {
    // Mock API hook with valid location data
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [{ id: 1, name: 'Earth', type: 'Planet', dimension: 'Dimension C-137' }],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Locations />);

    // Ensure the search input is rendered
    expect(screen.getByPlaceholderText(/search locations by name/i)).toBeInTheDocument();

    // Simulate typing in the search input
    fireEvent.change(screen.getByPlaceholderText(/search locations by name/i), {
      target: { value: 'Earth' },
    });

    // Check that the search input value updates
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search locations by name/i)).toHaveValue('Earth');
    });

    // Expect debounce to trigger search with updated name
    await waitFor(() => {
      expect(useGetLocationsListQuery).toHaveBeenCalledWith({
        page: 1,
        name: 'Earth',
        type: '',
        dimension: '',
      });
    });
  });
});
