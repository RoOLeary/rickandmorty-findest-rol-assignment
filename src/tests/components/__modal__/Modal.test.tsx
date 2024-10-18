import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './../../../components/Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Suppress console.error temporarily for this test suite
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    (console.error as jest.Mock).mockRestore();
  });

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

});
