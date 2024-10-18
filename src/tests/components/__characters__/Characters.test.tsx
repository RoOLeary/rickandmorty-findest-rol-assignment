/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Characters from './../../../components/Characters';
import { debounce } from 'lodash';
import {
  useGetCharacterListQuery,
  useGetUniqueSpeciesQuery,
  useGetUniqueOriginsQuery,
  useGetUniqueLocationsQuery,
} from './../../../services/rickandmorty';

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
jest.mock('../../../services/rickandmorty', () => ({
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

  test('renders search input and filters correctly', async () => {
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

    // Check if search input and filters render correctly
    expect(screen.getByPlaceholderText(/search characters/i)).toBeInTheDocument();
    expect(screen.getByTestId('species-select')).toBeInTheDocument();
    expect(screen.getByTestId('gender-select')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toBeInTheDocument();
    expect(screen.getByTestId('origin-select')).toBeInTheDocument();
    expect(screen.getByTestId('location-select')).toBeInTheDocument();
  });

  test('search input updates and triggers debounced search', async () => {
    // Mock API responses
    (useGetCharacterListQuery as jest.Mock).mockReturnValue({
      data: mockCharacterData,
      error: null,
      isLoading: false,
    });

    // Render component
    render(<Characters />);

    // Simulate typing in the search input
    fireEvent.change(screen.getByPlaceholderText(/search characters/i), {
      target: { value: 'Morty' },
    });

    // Wait for the debounce function to trigger the search
    await waitFor(() => {
      expect(debounce).toHaveBeenCalled(); // Verifies debounce was called
      expect(useGetCharacterListQuery).toHaveBeenCalledWith({
        page: 1,
        name: 'Morty',
        species: '',
        gender: '',
        status: '',
      });
    });
  });

  test('pagination works and calls API on next page click', async () => {
    // Mock API responses for page 1
    (useGetCharacterListQuery as jest.Mock).mockReturnValue({
      data: mockCharacterData,
      error: null,
      isLoading: false,
    });

    // Render component
    render(<Characters />);

    // Simulate clicking "Next" button
    fireEvent.click(screen.getByText(/next/i));

    // Expect API to be called for the next page
    await waitFor(() => {
      expect(useGetCharacterListQuery).toHaveBeenCalledWith({
        page: 2,
        name: '',
        species: '',
        gender: '',
        status: '',
      });
    });
  });

  test('pagination disables "Previous" button on first page', () => {
    // Mock API responses for page 1
    (useGetCharacterListQuery as jest.Mock).mockReturnValue({
      data: mockCharacterData,
      error: null,
      isLoading: false,
    });

    // Render component
    render(<Characters />);

    // Expect the "Previous" button to be disabled on the first page
    expect(screen.getByText(/previous/i)).toBeDisabled();
  });

  test('filters work and call API on species filter change', async () => {
    // Mock API responses
    (useGetCharacterListQuery as jest.Mock).mockReturnValue({
      data: mockCharacterData,
      error: null,
      isLoading: false,
    });
    (useGetUniqueSpeciesQuery as jest.Mock).mockReturnValue({ data: mockSpeciesList, isLoading: false });

    // Render component
    render(<Characters />);

    // Simulate selecting a species filter
    fireEvent.change(screen.getByTestId('species-select'), {
      target: { value: 'Human' },
    });

    // Expect API to be called with the species filter
    await waitFor(() => {
      expect(useGetCharacterListQuery).toHaveBeenCalledWith({
        page: 1,
        name: '',
        species: 'Human',
        gender: '',
        status: '',
      });
    });
  });

  // test('displays error message when API fails', async () => {
  //   // Mock API error response
  //   (useGetCharacterListQuery as jest.Mock).mockReturnValue({
  //     data: null,
  //     error: { message: 'API error' },
  //     isLoading: false,
  //   });

  //   // Render component
  //   render(<Characters />);

  //   // Expect an error message to be displayed
  //   expect(screen.getByText(/api error/i)).toBeInTheDocument();
  // });
});
