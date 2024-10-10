// App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { history, store } from './store'; // Import the same history used in App.tsx
import configureStore from 'redux-mock-store'; // Fix this import
import App from './App';
import { Store, UnknownAction } from 'redux';

// Create a mock Redux store
const mockStore = configureStore([]);

// Mock the store state
const initialState = {
  // Add your initial state values here if needed
};

describe('App Component', () => {
  let store: Store<unknown, UnknownAction, unknown>;

  beforeEach(() => {
    // Initialize the mock store
    store = mockStore(initialState);
  });

  test('should render the Home page by default', () => {
    // Render the component with Redux store and the same history used in the App
    render(
      <Provider store={store}>
        <App /> {/* App uses the history from redux-first-history */}
      </Provider>
    );

    // Debug output to inspect the DOM
    screen.debug();

    // Check if the Home component is rendered by looking for its unique content or test ID
    expect(screen.getByTestId('home-component')).toBeInTheDocument();
  });

  test('should render the Explorer page when navigated to /findest-explorer', () => {
    // Manually navigate to the /findest-explorer route
    history.push('/findest-explorer');

    // Render the component with Redux store and the same history used in the App
    render(
      <Provider store={store}>
        <App /> {/* App uses the history from redux-first-history */}
      </Provider>
    );

    // Debug output to inspect the DOM
    screen.debug();

    // Check if the Explorer component is rendered by checking its unique content or test ID
    expect(screen.getByTestId('explorer-component')).toBeInTheDocument();
  });
});
