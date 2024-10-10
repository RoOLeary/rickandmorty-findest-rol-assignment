import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Characters from './Characters';
import { debounce } from 'lodash';
import {
  useGetCharacterListQuery,
  useGetUniqueSpeciesQuery,
  useGetUniqueOriginsQuery,
  useGetUniqueLocationsQuery,
} from './../services/rickandmorty';

// Mock lodash debounce
jest.mock('lodash', () => ({
  debounce: jest.fn((fn) => {
    // Simulate debounce behavior with immediate invocation for testing
    let timeoutId: any;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), 0); // Set a minimal delay for testing
    };
  }),
}));

// Mock API hooks
jest.mock('./../services/rickandmorty', () => ({
  useGetCharacterListQuery: jest.fn(),
  useGetUniqueSpeciesQuery: jest.fn(),
  useGetUniqueOriginsQuery: jest.fn(),
  useGetUniqueLocationsQuery: jest.fn(),
}));

describe('Characters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCharacterData = {
    info: { next: true, prev: false },
    results: [
      { id: 1, name: 'Rick Sanchez', origin: { name: 'Earth' }, location: { name: 'Earth' } },
      { id: 2, name: 'Morty Smith', origin: { name: 'Earth' }, location: { name: 'Earth' } },
    ],
  };

  const mockSpeciesList = ['Human', 'Alien'];
  const mockOriginsList = ['Earth', 'Mars'];
  const mockLocationsList = ['Citadel of Ricks'];

  test('search input updates and triggers debounced search', async () => {
    // Mock API responses
    (useGetCharacterListQuery as jest.Mock).mockReturnValue({
      data: mockCharacterData,
      error: null,
      isLoading: false,
    });
    (useGetUniqueSpeciesQuery as jest.Mock).mockReturnValue({ data: mockSpeciesList, isLoading: false });
    (useGetUniqueOriginsQuery as jest.Mock).mockReturnValue({ data: mockOriginsList, isLoading: false });
    (useGetUniqueLocationsQuery as jest.Mock).mockReturnValue({ data: mockLocationsList, isLoading: false });

    // Render component
    render(<Characters />);

    // Simulate typing in the search input
    fireEvent.change(screen.getByPlaceholderText(/search characters/i), {
      target: { value: 'Morty' },
    });

    // Wait for the debounce function to trigger the search
    await waitFor(() => {
      expect(debounce).toHaveBeenCalled();  // Verifies debounce was called
      expect(useGetCharacterListQuery).toHaveBeenCalledWith({
        page: 1,
        name: 'Morty',
        species: '',
        gender: '',
        status: '',
      });
    });
  });
});
