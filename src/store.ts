import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createBrowserHistory } from 'history'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import { rickAndMortyApi } from './services/rickandmorty'

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() })

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      // additional slices here
      rickAndMortyApi.middleware,
      routerMiddleware,
    ]), // Add taskApi.middleware
  reducer: combineReducers({
    // additional reducers: ex
    // counter: counterReducer,
    router: routerReducer,
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
  }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
export const history = createReduxHistory(store)

// src/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import { tasksApiSlice } from './features/tasks/tasksApiSlice';

// const store = configureStore({
//   reducer: {
//     // Add the API slice reducer to the store
//     [tasksApiSlice.reducerPath]: tasksApiSlice.reducer,
//   },
//   // Adding the RTK Query middleware for caching and other features
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(tasksApiSlice.middleware),
// });

// export default store;
