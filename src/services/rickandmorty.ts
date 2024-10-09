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
    // Query for fetching a list of characters with pagination and search functionality
    getCharacterList: builder.query<CharacterListResponse, { page?: number, name?: string, species?: string, gender?: string, status?: string }>({
      query: ({ page = 1, name = '', species = '', gender = '', status = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (name) params.append('name', name);
        if (species) params.append('species', species);
        if (gender) params.append('gender', gender);
        if (status) params.append('status', status);
        return `character/?${params.toString()}`;
      },
    }),

    // Query for fetching an individual character by ID
    getCharacterById: builder.query<Character, string>({
      query: (id) => `/character/${id}`,
    }),

    // Query for fetching unique species from characters
    getUniqueSpecies: builder.query<string[], void>({
      async queryFn() {
        const speciesSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          response.results.forEach((character: any) => {
            if (character.species) {
              speciesSet.add(character.species);
            }
          });
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(speciesSet) };
      }
    }),

    // Query for fetching unique origins from characters
    getUniqueOrigins: builder.query<string[], void>({
      async queryFn() {
        const originSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          response.results.forEach((character: any) => {
            if (character.origin?.name) {
              originSet.add(character.origin.name);
            }
          });
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(originSet) };
      }
    }),

    // Query for fetching unique locations from characters
    getUniqueLocations: builder.query<string[], void>({
      async queryFn() {
        const locationSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          response.results.forEach((character: any) => {
            if (character.location?.name) {
              locationSet.add(character.location.name);
            }
          });
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(locationSet) };
      }
    }),

    // Query for fetching locations list
    getLocationsList: builder.query<LocationListResponse, { page?: number, name?: string, type?: string, dimension?: string }>({
      query: ({ page = 1, name = '', type = '', dimension = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (name) params.append('name', name);
        if (type) params.append('type', type);
        if (dimension) params.append('dimension', dimension);
        return `location/?${params.toString()}`;
      },
    }),

    // Query for fetching episodes list
    getEpisodeList: builder.query<EpisodeListResponse, { page?: number, name?: string, air_date?: string, episode?: string, characters?: any }>({
      query: ({ page = 1, name = '', air_date = '', episode = '', characters = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (name) params.append('name', name);
        if (air_date) params.append('air_date', air_date);
        if (episode) params.append('episode', episode);
        return `episode/?${params.toString()}`;
      },
    }),
  }),
})

// Export the hooks for the API endpoints
export const {
  useGetCharacterListQuery,
  useGetCharacterByIdQuery,
  useGetUniqueSpeciesQuery,
  useGetUniqueOriginsQuery,
  useGetUniqueLocationsQuery,
  useGetLocationsListQuery,
  useGetEpisodeListQuery,
} = rickAndMortyApi;
