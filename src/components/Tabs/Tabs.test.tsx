import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tabs from './Tabs';
import { useNavigate } from 'react-router-dom';

// Mock Components
jest.mock('../Characters', () => () => <div data-testid="characters-content">Characters Component</div>);
jest.mock('../Locations', () => () => <div data-testid="locations-content">Locations Component</div>);
jest.mock('../Episodes', () => () => <div data-testid="episodes-content">Episodes Component</div>);
jest.mock('../Spinner', () => () => <div data-testid="spinner">Loading...</div>);

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // keep the original implementation
  useNavigate: jest.fn(),
}));

describe('Tabs Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn(); // Create a mock function
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate); // Ensure useNavigate returns the mock function
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  test('should display the spinner during loading', async () => {
    render(<Tabs />, { wrapper: MemoryRouter });

    // Ensure the spinner is rendered initially
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the spinner to disappear after loading
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument(), { timeout: 2000 });
  });

  test('should switch tabs correctly', async () => {
    render(<Tabs />, { wrapper: MemoryRouter });

    // Wait for the loading state to resolve
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument(), { timeout: 2000 });

    // Verify that the Characters tab is active by default
    expect(screen.getByTestId('characters-content')).toBeInTheDocument();

    // Click the Locations tab and verify content
    fireEvent.click(screen.getByText('Locations'));
    expect(screen.getByTestId('locations-content')).toBeInTheDocument();
    expect(screen.queryByTestId('characters-content')).not.toBeInTheDocument();

    // Click the Episodes tab and verify content
    fireEvent.click(screen.getByText('Episodes'));
    expect(screen.getByTestId('episodes-content')).toBeInTheDocument();
    expect(screen.queryByTestId('locations-content')).not.toBeInTheDocument();
  });

//   test('should reset the page when Reset button is clicked', () => {
//     render(<Tabs />, { wrapper: MemoryRouter });

//     // Click the Reset button
//     fireEvent.click(screen.getByText('Reset'));

//     // Verify that navigate(0) was called, which reloads the page
//     expect(mockNavigate).toHaveBeenCalledWith(0);
//     expect(mockNavigate).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
//   });
});
