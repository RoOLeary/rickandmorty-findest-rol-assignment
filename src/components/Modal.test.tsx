import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  it('prevents closing the modal when clicking inside the content', () => {
    render(
      <Modal show={true} onClose={mockOnClose}>
        <div data-testid="modal-content">
          <p>Modal Content</p>
        </div>
      </Modal>
    );

    // Click inside modal content, should not close
    fireEvent.click(screen.getByTestId('modal-content'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes the modal when clicking on the overlay (outside content)', () => {
    render(
      <Modal show={true} onClose={mockOnClose}>
        <div data-testid="modal-content">
          <p>Modal Content</p>
        </div>
      </Modal>
    );

    // Click outside modal content (overlay), should close
    fireEvent.click(screen.getByTestId('modal')); // Assuming the entire modal overlay has a `data-testid="modal"`
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
