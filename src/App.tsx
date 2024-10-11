// App.js or App.tsx
import React from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';

import Home from './pages/Home';
import Explorer from './pages/Explorer';
import { history, store } from './store';

const App = () => {
  return (
    <ReduxStoreProvider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="*" element={<Navigate to="/explorer" replace />} />
        </Routes>
      </HistoryRouter>
    </ReduxStoreProvider>
  );
};

export default App;
