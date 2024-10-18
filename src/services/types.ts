export interface Location {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface CharacterListQueryParams {
  page?: number;
  name?: string;
  species?: string;
  gender?: string;
  status?: string;
}

// Type for Location object
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // Array of character URLs who reside in this location
  url: string;
  created: string; // ISO date string
}

// Type for Episode object
export interface Episode {
  id: number;
  name: string;
  air_date: string; // Air date of the episode
  episode: string; // Format: SXXEXX (Season and Episode)
  characters: string[]; // Array of character URLs that appear in this episode
  url: string;
  created: string; // ISO date string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  season?: any;
}

// Type for a list of Locations
export interface LocationList {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Location[]; // Array of Location objects
}

// Type for a list of Episodes
export interface EpisodeList {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Episode[]; // Array of Episode objects
}
