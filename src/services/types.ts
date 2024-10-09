export interface Location {
    name: string;
    url: string;
  }
  
  export interface Character {
    id: number;
    name: string;
    status: string; // "Alive", "Dead", or "unknown"
    species: string;
    type: string; // Sometimes characters have a specific type, but often it is an empty string
    gender: string; // "Male", "Female", "Genderless", or "unknown"
    origin: Location; // Location where the character originated
    location: Location; // Current location of the character
    image: string; // URL to the character's image
    episode: string[]; // Array of episode URLs the character has appeared in
    url: string; // URL of this character's own API endpoint
    created: string; // ISO date string of when the character was created
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
  