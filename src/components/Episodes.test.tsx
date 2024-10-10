import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Episodes from './Episodes';
import {
  useGetEpisodeListQuery,
  useGetEpisodesBySeasonQuery,
  useGetEpisodesBySeasonAndNumberQuery
} from './../services/rickandmorty';
import fetchMock from 'jest-fetch-mock';

// Mock API hooks
jest.mock('./../services/rickandmorty', () => ({
  useGetEpisodeListQuery: jest.fn(),
  useGetEpisodesBySeasonQuery: jest.fn(),
  useGetEpisodesBySeasonAndNumberQuery: jest.fn(),
}));

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.resetMocks();
});

describe('Episodes Component', () => {
  const mockEpisodeData = {
    info: { next: true, prev: null },
    results: [
      {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
      },
    ],
  };

  const mockCharacterData = {
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  };

  test('renders and fetches episodes for a season', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: mockEpisodeData,
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Air Date: December 2, 2013')).toBeInTheDocument();
    expect(screen.getByText('Episode: S01E01')).toBeInTheDocument();
  });

  test('displays loading message when data is being fetched', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<Episodes />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetching fails', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: 'Error fetching data',
      isLoading: false,
    });

    render(<Episodes />);
    expect(screen.getByText('"Error fetching data"')).toBeInTheDocument();
  });

  test('navigates to the next page on clicking the Next button', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValueOnce({
      data: mockEpisodeData,
      error: null,
      isLoading: false,
    }).mockReturnValueOnce({
      data: { ...mockEpisodeData, info: { next: false, prev: true }, results: [{ id: 2, name: 'Lawnmower Dog', episode: 'S01E02' }] },
      error: null,
      isLoading: false,
    });

    render(<Episodes />);
    const nextButton = screen.getByTestId('pagination-next');
    fireEvent.click(nextButton);

    await waitFor(() => expect(useGetEpisodeListQuery).toHaveBeenCalledWith({ page: 2 }));
    expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument();
  });

  test('opens and displays the character modal on character click', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: mockEpisodeData,
      error: null,
      isLoading: false,
    });

    fetchMock.mockResponseOnce(JSON.stringify(mockCharacterData));

    render(<Episodes />);

    // Simulate clicking the character image
    const characterImage = await screen.findByAltText('Rick Sanchez');
    fireEvent.click(characterImage);

    // Verify the modal opens and displays character details
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  test('closes the modal when the close button is clicked', async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: mockEpisodeData,
      error: null,
      isLoading: false,
    });

    fetchMock.mockResponseOnce(JSON.stringify(mockCharacterData));

    render(<Episodes />);

    // Simulate opening the modal
    const characterImage = await screen.findByAltText('Rick Sanchez');
    fireEvent.click(characterImage);

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    // Simulate closing the modal
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
  });

  test('handles season and episode selection changes', async () => {
    (useGetEpisodesBySeasonQuery as jest.Mock).mockReturnValue({
      data: mockEpisodeData,
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    // Simulate changing the season select
    fireEvent.change(screen.getByRole('combobox', { name: /season/i }), {
      target: { value: '1' },
    });

    await waitFor(() => expect(useGetEpisodesBySeasonQuery).toHaveBeenCalledWith({ season: 1 }));
  });
});
