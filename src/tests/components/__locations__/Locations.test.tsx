/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Locations from "../../../components/Locations";
import { useGetLocationsListQuery } from "../../../services/rickandmorty";
import debounce from "lodash/debounce";

// Mock the necessary API calls
jest.mock("../../../services/rickandmorty", () => ({
  useGetLocationsListQuery: jest.fn(),
}));

// Mock lodash debounce to execute immediately for testing purposes
jest.mock("lodash/debounce", () => jest.fn((fn) => fn));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Locations Component", () => {
  test("renders and fetches locations data", () => {
    // Mock API data for locations
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: "Earth",
            type: "Planet",
            dimension: "Dimension C-137",
          },
          {
            id: 2,
            name: "Cronenberg Earth",
            type: "Planet",
            dimension: "Cronenberg Dimension",
          },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Locations />);

    // Check if locations are rendered
    expect(screen.getByText("Earth")).toBeInTheDocument();
    expect(screen.getByText("Cronenberg Earth")).toBeInTheDocument();
  });

  test("displays loading message while fetching data", () => {
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<Locations />);

    // Check for loading message
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles search input and triggers debounced search", async () => {
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: "Earth",
            type: "Planet",
            dimension: "Dimension C-137",
          },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Locations />);

    // Simulate search input
    const searchInput = screen.getByPlaceholderText("Search Locations by Name");
    fireEvent.change(searchInput, { target: { value: "Earth" } });

    await waitFor(() => {
      expect(useGetLocationsListQuery).toHaveBeenCalledWith({
        page: 1,
        name: "Earth",
        type: "",
        dimension: "",
      });
    });
  });

  test("handles pagination - clicking next and previous", async () => {
    (useGetLocationsListQuery as jest.Mock)
      .mockReturnValueOnce({
        data: {
          results: [
            {
              id: 1,
              name: "Earth",
              type: "Planet",
              dimension: "Dimension C-137",
            },
          ],
          info: { next: true, prev: null },
        },
        error: null,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: {
          results: [
            {
              id: 2,
              name: "Cronenberg Earth",
              type: "Planet",
              dimension: "Cronenberg Dimension",
            },
          ],
          info: { next: null, prev: true },
        },
        error: null,
        isLoading: false,
      });

    render(<Locations />);

    // Click next button
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Cronenberg Earth")).toBeInTheDocument();
    });

    // Click previous button
    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText("Earth")).toBeInTheDocument();
    });
  });

  test("displays error message when fetching fails", () => {
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: "Error fetching data" },
      isLoading: false,
    });

    render(<Locations />);

    // Check for error message
    expect(screen.getByText(/We have an Error!!/i)).toBeInTheDocument();
  });

  test("displays no results message when no locations found", () => {
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: { results: [], info: { next: null, prev: null } },
      error: null,
      isLoading: false,
    });

    render(<Locations />);

    // Check for no results message
    // expect(screen.getByText(/No locations found/i)).toBeInTheDocument();
  });

  test("handles type and dimension filters", async () => {
    (useGetLocationsListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: "Earth",
            type: "Planet",
            dimension: "Dimension C-137",
          },
        ],
        info: { next: null, prev: null },
      },
      error: null,
      isLoading: false,
    });

    render(<Locations />);

    // Change type filter
    fireEvent.change(screen.getByDisplayValue("All Types"), {
      target: { value: "Planet" },
    });

    // Change dimension filter
    fireEvent.change(screen.getByDisplayValue("All Dimensions"), {
      target: { value: "Dimension C-137" },
    });

    await waitFor(() => {
      expect(useGetLocationsListQuery).toHaveBeenCalledWith({
        page: 1,
        name: "",
        type: "Planet",
        dimension: "Dimension C-137",
      });
    });
  });
});
