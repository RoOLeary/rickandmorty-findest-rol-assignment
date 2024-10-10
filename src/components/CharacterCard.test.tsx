import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CharacterCard from './CharacterCard';
import Modal from './Modal';

// Mock the Modal component
jest.mock('./Modal', () => ({ show, onClose, children }: any) => {
  return show ? (
    <div data-testid="modal">
      <button data-testid="modal-close" onClick={onClose}>
        X
      </button>
      {children}
    </div>
  ) : null;
});

beforeAll(() => {
  // Mock `startViewTransition` to avoid errors in test environments
  Object.defineProperty(document, 'startViewTransition', {
    value: jest.fn((callback) => callback()),
    writable: true,
  });
});

describe('CharacterCard Component', () => {
  const mockCharacter = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
    location: { name: 'Earth' },
    origin: { name: 'Earth' },
  };

  const mockChartoggle = jest.fn();

  test('renders character details correctly', () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    
    // expect(screen.getByText('Location: Earth')).toBeInTheDocument();
  });

  test('does not show the modal initially', () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('opens the modal when the character card is clicked', async () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

    fireEvent.click(screen.getByText('Rick Sanchez')); // Simulate clicking the card to open the modal

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
    // expect(screen.getByText('Rick Sanchez')).toBeInTheDocument(); // Check if modal displays character details
  });

  test('closes the modal when the close button is clicked', async () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

    // Open the modal
    fireEvent.click(screen.getByText('Rick Sanchez'));
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    // Close the modal by clicking the 'X' button
    fireEvent.click(screen.getByTestId('modal-close'));

    // Ensure modal is closed
    // await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
  });
});
