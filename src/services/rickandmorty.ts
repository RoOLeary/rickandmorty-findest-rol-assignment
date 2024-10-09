// @ts-nocheck
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ky from 'ky'

import type { LocationListResponse, Location, EpisodeListResponse, Episode, CharacterListResponse, Character } from './types'

export const rickAndMortyApi = createApi({
  reducerPath: 'rickAndMortyApi', // Unique identifier for the API service
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api',
    fetchFn: async (...args) => ky(...args),
  }),
  endpoints: (builder) => ({
    // Read all tasks
    getCharacterList: builder.query<CharacterListResponse, void>({
      query: ({ page = 1, name = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (name) params.append('name', name);  // Search by name if provided
        return `character/?${params.toString()}`;
      },
    }),

    getLocationsList: builder.query<LocationsListResponse, void>({
      query: () => '/location',
      providesTags: (result = [], error, arg) =>
        result ? result.results.map(({ id }) => ({ type: 'Task', id })) : ['Task'],
    }),

    getEpisodeList: builder.query<EpisodeListResponse, void>({
      query: () => '/episode',
      providesTags: (result = [], error, arg) =>
        result ? result.results.map(({ id }) => ({ type: 'Task', id })) : ['Task'],
    }),

    // Read a single task by ID
    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Create a new task
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'], // Invalidate cache to refetch the task list
    }),

    // Update an existing task by ID
    updateTask: builder.mutation<Task, Partial<Task>>({
      query: ({ id, ...updatedTask }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: updatedTask,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    // Delete a task by ID
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
  }),
})

// Export the hooks for the API endpoints
export const {
  useGetCharacterListQuery,
  useGetLocationsListQuery,
  useGetTaskByIdQuery,
  useGetEpisodeListQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = rickAndMortyApi
