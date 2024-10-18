/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ky from "ky";
// @ts-expect-error n/a
import type { Character, CharacterListResponse, EpisodeListResponse, LocationListResponse } from "./types";

// Create the API slice using RTK Query
export const rickAndMortyApi = createApi({
  reducerPath: "rickAndMortyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rickandmortyapi.com/api",
    fetchFn: async (...args: any) => ky(...args),
  }),
  endpoints: (builder: { query: (arg0: { query?: (({ page, name, air_date, episode }?: { page?: number | undefined; name?: string | undefined; air_date?: string | undefined; episode?: string | undefined; }) => string) | (({ season, episode }: { season: any; episode: any; }) => string) | (({ season }: { season: any; }) => string) | (({ page, name, species, gender, status }?: { page?: number | undefined; name?: string | undefined; species?: string | undefined; gender?: string | undefined; status?: string | undefined; }) => string) | ((id: any) => string) | (({ page, name, type, dimension }?: { page?: number | undefined; name?: string | undefined; type?: string | undefined; dimension?: string | undefined; }) => string); queryFn?: (() => Promise<{ data: string[]; }>) | (() => Promise<{ data: string[]; }>) | (() => Promise<{ data: string[]; }>); }) => any; }) => ({
    
    // Fetches a list of characters with optional filters
    getCharacterList: builder.query<CharacterListResponse, {
      page?: number;
      name?: string;
      species?: string;
      gender?: string;
      status?: string;
    }>({
      query: ({ page = 1, name = "", species = "", gender = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (name) params.append("name", name);
        if (species) params.append("species", species);
        if (gender) params.append("gender", gender);
        if (status) params.append("status", status);
        return `character/?${params.toString()}`;
      },
    }),

    // Fetches the details of a single character by its ID
    getCharacterById: builder.query<Character, string | number>({
      query: (id: any) => `/character/${id}`,
    }),

    // Fetches unique species from all characters
    getUniqueSpecies: builder.query<string[], void>({
      async queryFn() {
        const speciesSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          // @ts-expect-error not applicable
          response.results.forEach((character: any) => {
            if (character.species) speciesSet.add(character.species);
          });
          // @ts-expect-error not applicable
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(speciesSet) };
      },
    }),

    // Fetches unique origins from all characters
    getUniqueOrigins: builder.query<string[], void>({
      async queryFn() {
        const originSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          // @ts-expect-error not applicable
          response.results.forEach((character: any) => {
            if (character.origin?.name) originSet.add(character.origin.name);
          });
          // @ts-expect-error not applicable
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(originSet) };
      },
    }),

    // Fetches unique locations from all characters
    getUniqueLocations: builder.query<string[], void>({
      async queryFn() {
        const locationSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky.get(`https://rickandmortyapi.com/api/character/?page=${page}`).json();
          // @ts-expect-error not applicable
          response.results.forEach((character: any) => {
            if (character.location?.name) locationSet.add(character.location.name);
          });
          // @ts-expect-error not applicable
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(locationSet) };
      },
    }),

    // Fetches a list of locations with optional filters
    getLocationsList: builder.query<LocationListResponse, {
      page?: number;
      name?: string;
      type?: string;
      dimension?: string;
    }>({
      query: ({ page = 1, name = "", type = "", dimension = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (name) params.append("name", name);
        if (type) params.append("type", type);
        if (dimension) params.append("dimension", dimension);
        return `location/?${params.toString()}`;
      },
    }),

    // Fetches a list of episodes with optional filters
    getEpisodeList: builder.query<EpisodeListResponse, {
      page?: number;
      name?: string;
      air_date?: string;
      episode?: string;
    }>({
      query: ({ page = 1, name = "", air_date = "", episode = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (name) params.append("name", name);
        if (air_date) params.append("air_date", air_date);
        if (episode) params.append("episode", episode);
        return `episode/?${params.toString()}`;
      },
    }),

    // Fetches episodes by season and episode number
    getEpisodesBySeasonAndNumber: builder.query<EpisodeListResponse, { season: number; episode: number }>({
      query: ({ season, episode }) => {
        const episodeCode = `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
        return `episode/?episode=${episodeCode}`;
      },
    }),

    // Fetches episodes by season only
    getEpisodesBySeason: builder.query<EpisodeListResponse, { season: number }>({
      query: ({ season }:any) => {
        const seasonCode = `S${String(season).padStart(2, "0")}`;
        return `episode/?episode=${seasonCode}`;
      },
    }),
  }),
});

// Export the hooks for all API queries and mutations
export const {
  useGetCharacterListQuery,
  useGetCharacterByIdQuery,
  useGetUniqueSpeciesQuery,
  useGetUniqueOriginsQuery,
  useGetUniqueLocationsQuery,
  useGetLocationsListQuery,
  useGetEpisodeListQuery,
  useGetEpisodesBySeasonAndNumberQuery,
  useGetEpisodesBySeasonQuery,
} = rickAndMortyApi;
