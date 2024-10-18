/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent, act } from '@testing-library/react';
import Episodes from '../../components/Episodes';
import { 
  useGetEpisodeListQuery, 
  useGetEpisodesBySeasonQuery, 
  useGetEpisodesBySeasonAndNumberQuery 
} from '../../services/rickandmorty';

// Mock API calls
jest.mock('../../services/rickandmorty', () => ({
  useGetEpisodeListQuery: jest.fn(),
  useGetEpisodesBySeasonQuery: jest.fn(),
  useGetEpisodesBySeasonAndNumberQuery: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Episodes Component', () => {

  test('renders and fetches episodes for a season', async () => {
    // Mock API data for the episode list
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

    await act(async () => {
      render(<Episodes />);
    });

    // Check if the episode is rendered
    expect(screen.getByText('Pilot')).toBeInTheDocument();
  });

  test('displays loading message while fetching data', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    await act(async () => {
      render(<Episodes />);
    });

    // Check for the loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetching fails', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'N-n-n-no episodes found ' },
      isLoading: false,
    });

    await act(async () => {
      render(<Episodes />);
    });

    // Check for the error message
    expect(screen.getByText(/N-n-n-no episodes found /)).toBeInTheDocument();
  });

  test('fetches episodes by season using useGetEpisodesBySeasonQuery', async () => {
    // Mock API data for fetching by season
    (useGetEpisodesBySeasonQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          { id: 3, name: 'Rick Potion #9', air_date: 'January 27, 2014', episode: 'S01E06', characters: [] },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    await act(async () => {
      render(<Episodes season="1" />);
    });

    // Check if the episode from season 1 is rendered
    expect(screen.getByText('Rick Potion #9')).toBeInTheDocument();
  });

  test('fetches episode by season and number using useGetEpisodesBySeasonAndNumberQuery', async () => {
    // Mock API data for fetching by season and number
    (useGetEpisodesBySeasonAndNumberQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          { id: 4, name: 'Meeseeks and Destroy', air_date: 'January 20, 2014', episode: 'S01E05', characters: [] },
        ],
      },
      error: null,
      isLoading: false,
    });

    await act(async () => {
      render(<Episodes season="1" episodeNumber="5" />);
    });

    // Check if the specific episode from season 1, episode 5 is rendered
    expect(screen.getByText('Meeseeks and Destroy')).toBeInTheDocument();
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

    await act(async () => {
      render(<Episodes />);
    });

    // Simulate clicking the "Next" button
    await act(async () => {
      fireEvent.click(screen.getByText('Next'));
    });

    // Assert that the second episode is rendered
    expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument();
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

    await act(async () => {
      render(<Episodes />);
    });

    // Simulate clicking the "Previous" button
    await act(async () => {
      fireEvent.click(screen.getByText('Previous'));
    });

    // Assert that the first episode is rendered again
    expect(screen.getByText('Pilot')).toBeInTheDocument();
  });
});
