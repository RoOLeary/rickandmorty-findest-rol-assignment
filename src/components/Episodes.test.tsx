import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Episodes from './Episodes'; // Adjust this path to where your Episodes component is located
import { useGetEpisodeListQuery } from './../services/rickandmorty';

// Mock the RTK Query API hook
jest.mock('./../services/rickandmorty', () => ({
  useGetEpisodeListQuery: jest.fn(),
}));

describe('Episodes Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock the API hook to return loading state
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<Episodes />);
    
    // Check if loading message is rendered
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    // Mock the API hook to return an error
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Error fetching data' },
      isLoading: false,
    });

    render(<Episodes />);
    
    // Check if the error message is rendered
    expect(screen.getByText(/error fetching data/i)).toBeInTheDocument();
  });

  test('renders episode list correctly', async () => {
    // Mock the API hook to return episode data
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: {
        info: { next: null, prev: null },
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [] },
          { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: [] },
        ],
      },
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    // Wait for the episode list to render
    await waitFor(() => {
      expect(screen.getByText(/Pilot/i)).toBeInTheDocument();
      expect(screen.getByText(/Lawnmower Dog/i)).toBeInTheDocument();
    });
  });

  test('navigates to next page on button click', async () => {
    // Mock the API hook to return episode data
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: {
        info: { next: true, prev: null },
        results: [{ id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [] }],
      },
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    // Simulate clicking the "Next" button
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    // Expect the hook to be called with the updated page number
    expect(useGetEpisodeListQuery).toHaveBeenCalledWith({
      page: 2,
      air_date: '',
      episode: '',
      characters: '',
    });
  });
});
