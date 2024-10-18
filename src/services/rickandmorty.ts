/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ky from "ky";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Character } from "./types";

// Create the API slice using RTK Query
export const rickAndMortyApi = createApi({
  reducerPath: "rickAndMortyApi", // Unique key for this API slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rickandmortyapi.com/api", // Base URL for the Rick and Morty API
    fetchFn: async (...args) => ky(...args), // Using 'ky' to handle the actual HTTP requests
  }),
  endpoints: (builder) => ({
    // Define endpoints (API operations)

    // Fetches a list of characters with optional filters: pagination, name, species, gender, and status
    getCharacterList: builder.query<
      CharacterListResponse,
      {
        page?: number;
        name?: string;
        species?: string;
        gender?: string;
        status?: string;
      }
    >({
      query: ({
        page = 1,
        name = "",
        species = "",
        gender = "",
        status = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString()); // Add pagination to the query string
        if (name) params.append("name", name); // Add name filter if provided
        if (species) params.append("species", species); // Add species filter if provided
        if (gender) params.append("gender", gender); // Add gender filter if provided
        if (status) params.append("status", status); // Add status filter if provided
        return `character/?${params.toString()}`; // Return the full API endpoint with query string
      },
    }),

    // Fetches the details of a single character by its ID
    getCharacterById: builder.query<Character, string>({
      query: (id) => `/character/${id}`, // Endpoint for fetching character by ID
    }),

    // Fetches unique species from all characters (loops through all pages to find unique species)
    getUniqueSpecies: builder.query<string[], void>({
      async queryFn() {
        const speciesSet = new Set<string>(); // Use a Set to store unique species
        let page = 1;
        let hasNextPage = true;

        // Loop through the API pages until all species are fetched
        while (hasNextPage) {
          const response = await ky
            .get(`https://rickandmortyapi.com/api/character/?page=${page}`)
            .json();
          // @ts-ignore
          response?.results?.forEach((character: unknown) => {
            // @ts-ignore
            if (character.species) speciesSet.add(character.species); // Add species to the Set
          });
          // @ts-ignore
          hasNextPage = !!response?.info?.next; // Check if there is another page to fetch
          page++;
        }

        return { data: Array.from(speciesSet) }; // Return the unique species as an array
      },
    }),

    // Fetches unique origins from characters (similar to getUniqueSpecies, but for origins)
    getUniqueOrigins: builder.query<string[], void>({
      async queryFn() {
        const originSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky
            .get(`https://rickandmortyapi.com/api/character/?page=${page}`)
            .json();
          // @ts-ignore

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.results.forEach((character: any) => {
            if (character.origin?.name) originSet.add(character.origin.name); // Add origin to the Set
          });
          // @ts-ignore
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(originSet) }; // Return unique origins as an array
      },
    }),

    // Fetches unique locations from characters (similar to getUniqueOrigins, but for locations)
    getUniqueLocations: builder.query<string[], void>({
      async queryFn() {
        const locationSet = new Set<string>();
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await ky
            .get(`https://rickandmortyapi.com/api/character/?page=${page}`)
            .json();
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.results.forEach((character: any) => {
            if (character.location?.name)
              locationSet.add(character.location.name); // Add location to the Set
          });
          // @ts-ignore
          hasNextPage = !!response.info.next;
          page++;
        }

        return { data: Array.from(locationSet) }; // Return unique locations as an array
      },
    }),

    // Fetches a list of locations with optional filters: pagination, name, type, and dimension
    getLocationsList: builder.query<
      LocationListResponse,
      { page?: number; name?: string; type?: string; dimension?: string }
    >({
      query: ({ page = 1, name = "", type = "", dimension = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString()); // Add pagination to the query string
        if (name) params.append("name", name); // Add name filter if provided
        if (type) params.append("type", type); // Add type filter if provided
        if (dimension) params.append("dimension", dimension); // Add dimension filter if provided
        return `location/?${params.toString()}`; // Return the full API endpoint with query string
      },
    }),

    // Fetches a list of episodes with optional filters: pagination, name, air_date, episode code, and characters
    getEpisodeList: builder.query<
      EpisodeListResponse,
      { page?: number; name?: string; air_date?: string; episode?: string }
    >({
      query: ({ page = 1, name = "", air_date = "", episode = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString()); // Add pagination to the query string
        if (name) params.append("name", name); // Add name filter if provided
        if (air_date) params.append("air_date", air_date); // Add air_date filter if provided
        if (episode) params.append("episode", episode); // Add episode filter if provided
        return `episode/?${params.toString()}`; // Return the full API endpoint with query string
      },
    }),

    // Fetches episodes by season and episode number
    getEpisodesBySeasonAndNumber: builder.query<
      EpisodeListResponse,
      { season: number; episode: number }
    >({
      query: ({ season, episode }) => {
        const episodeCode = `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`; // Construct episode code like S01E01
        return `episode/?episode=${episodeCode}`; // Return the full API endpoint filtered by episode code
      },
    }),

    // Fetches episodes by season only
    getEpisodesBySeason: builder.query<EpisodeListResponse, { season: number }>(
      {
        query: ({ season }) => {
          const seasonCode = `S${String(season).padStart(2, "0")}`; // Construct the season part of episode code (e.g., S01)
          return `episode/?episode=${seasonCode}`; // Return the full API endpoint filtered by season
        },
      },
    ),
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
