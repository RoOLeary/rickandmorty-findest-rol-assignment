/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CharacterCard from "./../../../components/CharacterCard";

// Mock the Modal component
// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
jest.mock(
  "../../../components/Modal",
  () =>
    ({ show, onClose, children }: any) => {
      return show ? (
        <div data-testid="modal">
          <button data-testid="modal-close" onClick={onClose}>
            X
          </button>
          {children}
        </div>
      ) : null;
    },
);

beforeAll(() => {
  // Mock `startViewTransition` to avoid errors in test environments
  Object.defineProperty(document, "startViewTransition", {
    value: jest.fn((callback) => callback()),
    writable: true,
  });
});

beforeEach(() => {
  // Suppress console.error to avoid React warnings
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // Restore console.error after each test
  jest.restoreAllMocks();
});

describe("CharacterCard Component", () => {
  const mockCharacter = {
    id: 1,
    name: "Rick Sanchez",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    species: "Human",
    status: "Alive",
    gender: "Male",
    location: { name: "Earth" },
    origin: { name: "Earth" },
  };

  const mockChartoggle = jest.fn();

  test("renders character details correctly", () => {
    render(
      <CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />,
    );

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
  });

  test("does not show the modal initially", () => {
    render(
      <CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />,
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("opens the modal when the character card is clicked", async () => {
    render(
      <CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />,
    );

    fireEvent.click(screen.getByText("Rick Sanchez")); // Simulate clicking the card to open the modal

    const modal = await screen.findByTestId("modal");
    expect(modal).toBeInTheDocument();
  });
});
