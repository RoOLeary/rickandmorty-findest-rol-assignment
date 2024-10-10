import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CharacterCard from './CharacterCard';

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

  it('renders character details correctly', () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('opens the modal when the character card is clicked', async () => {
    render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

    fireEvent.click(screen.getByText('Rick Sanchez'));

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getAllByText('Rick Sanchez')).toHaveLength(2); // One in card, one in modal
  });

  // it('closes the modal when "X" button is clicked', async () => {
  //   render(<CharacterCard character={mockCharacter} chartoggle={mockChartoggle} />);

  //   fireEvent.click(screen.getByText('Rick Sanchez')); // Open modal

  //   const modal = await screen.findByTestId('modal');
  //   expect(modal).toBeInTheDocument();

  //   // Close modal by clicking the 'X' button
  //   fireEvent.click(screen.getByTestId('modal-close'));

  //   // Ensure modal is closed
  //   await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
  // });
});
