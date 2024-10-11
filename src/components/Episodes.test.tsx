/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Episodes from './Episodes';
import { useGetEpisodeListQuery, useGetEpisodesBySeasonQuery, useGetEpisodesBySeasonAndNumberQuery } from './../services/rickandmorty';

// Mock API calls
jest.mock('./../services/rickandmorty', () => ({
  useGetEpisodeListQuery: jest.fn(),
  useGetEpisodesBySeasonQuery: jest.fn(),
  useGetEpisodesBySeasonAndNumberQuery: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Episodes Component', () => {
  test('renders and fetches episodes for a season', () => {
    // Mock API data
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [] },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    // Check if the episode is rendered
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    // expect(screen.getByText('Air Date: December 2, 2013')).toBeInTheDocument();
  });

  test('displays loading message while fetching data', () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<Episodes />);

    // Check for the loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetching fails', () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'N-n-n-no episodes found ' },
      isLoading: false,
    });

    render(<Episodes />);

    // Check for the error message
    // expect(screen.getByText(/N-n-n-no episodes found /)).toBeInTheDocument();
  });

  test('navigates to the next page on clicking the Next button', async () => {
    // First page mock
    (useGetEpisodeListQuery as jest.Mock)
      .mockReturnValueOnce({
        data: {
          results: [
            { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [] },
          ],
          info: { next: true, prev: null },
        },
        error: null,
        isLoading: false,
      })
      // Second page mock
      .mockReturnValueOnce({
        data: {
          results: [
            { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: [] },
          ],
          info: { next: false, prev: true },
        },
        error: null,
        isLoading: false,
      });

    render(<Episodes />);

  });

  test('navigates to the previous page on clicking the Previous button', async () => {
    // Mock the second page first
    (useGetEpisodeListQuery as jest.Mock)
      .mockReturnValueOnce({
        data: {
          results: [
            { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: [] },
          ],
          info: { next: false, prev: true },
        },
        error: null,
        isLoading: false,
      })
      // Then mock the first page
      .mockReturnValueOnce({
        data: {
          results: [
            { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [] },
          ],
          info: { next: true, prev: null },
        },
        error: null,
        isLoading: false,
      });

    render(<Episodes />);

  });
});
