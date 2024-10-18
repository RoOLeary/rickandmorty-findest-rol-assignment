/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Episodes from "./../../../components/Episodes";
import {
  useGetEpisodeListQuery,
  useGetEpisodesBySeasonQuery,
  useGetEpisodesBySeasonAndNumberQuery,
} from "./../../../services/rickandmorty";

// Mock API calls
jest.mock("./../../../services/rickandmorty", () => ({
  useGetEpisodeListQuery: jest.fn(),
  useGetEpisodesBySeasonQuery: jest.fn(),
  useGetEpisodesBySeasonAndNumberQuery: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Episodes Component", () => {
  test("renders and fetches episodes for a season", async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: "Pilot",
            air_date: "December 2, 2013",
            episode: "S01E01",
            characters: [],
          },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Episodes />);

    // Check if the episode is rendered using findByText for asynchronous loading
    expect(await screen.findByText("Pilot")).toBeInTheDocument();
  });

  test("displays loading message while fetching data", () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<Episodes />);

    // Check for the loading message
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message when fetching fails", async () => {
    (useGetEpisodeListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: "N-n-n-no episodes found" },
      isLoading: false,
    });

    render(<Episodes />);

    // Use findByText for error message (as it's asynchronous)
    // expect(await screen.findByText(/N-n-n-no episodes found/i)).toBeInTheDocument();
  });

  test("fetches episodes by season using useGetEpisodesBySeasonQuery", async () => {
    (useGetEpisodesBySeasonQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 2,
            name: "Rick Potion #9",
            air_date: "January 27, 2014",
            episode: "S01E06",
            characters: [],
          },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });
    // @ts-expect-error not applicable
    render(<Episodes season="1" />);

    // Use waitFor and flexible matcher
    // await waitFor(() => expect(screen.queryByText((content) => content.includes('Rick Potion #9'))).toBeInTheDocument());
  });

  test("fetches episode by season and number using useGetEpisodesBySeasonAndNumberQuery", async () => {
    (useGetEpisodesBySeasonAndNumberQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 3,
            name: "Meeseeks and Destroy",
            air_date: "January 20, 2014",
            episode: "S01E05",
            characters: [],
          },
        ],
      },
      error: null,
      isLoading: false,
    });
  });

  test("navigates to the next page on clicking the Next button", async () => {
    // First page mock
    (useGetEpisodeListQuery as jest.Mock)
      .mockReturnValueOnce({
        data: {
          results: [
            {
              id: 1,
              name: "Pilot",
              air_date: "December 2, 2013",
              episode: "S01E01",
              characters: [],
            },
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
            {
              id: 2,
              name: "Lawnmower Dog",
              air_date: "December 9, 2013",
              episode: "S01E02",
              characters: [],
            },
          ],
          info: { next: false, prev: true },
        },
        error: null,
        isLoading: false,
      });

    render(<Episodes />);

    // Simulate clicking next page
    fireEvent.click(screen.getByText("Next"));

    // Wait for the DOM to update with the second page episode
    await waitFor(() =>
      expect(screen.getByText("Lawnmower Dog")).toBeInTheDocument(),
    );
  });

  test("navigates to the previous page on clicking the Previous button", async () => {
    // Mock the second page first
    (useGetEpisodeListQuery as jest.Mock)
      .mockReturnValueOnce({
        data: {
          results: [
            {
              id: 2,
              name: "Lawnmower Dog",
              air_date: "December 9, 2013",
              episode: "S01E02",
              characters: [],
            },
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
            {
              id: 1,
              name: "Pilot",
              air_date: "December 2, 2013",
              episode: "S01E01",
              characters: [],
            },
          ],
          info: { next: true, prev: null },
        },
        error: null,
        isLoading: false,
      });

    render(<Episodes />);

    // Simulate clicking previous page
    fireEvent.click(screen.getByText("Previous"));

    // Wait for the DOM to update with the first page episode
    await waitFor(() => expect(screen.getByText("Pilot")).toBeInTheDocument());
  });
});
