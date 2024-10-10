import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import {
  useGetCharacterListQuery,
  useGetUniqueSpeciesQuery,
  useGetUniqueOriginsQuery,
  useGetUniqueLocationsQuery,
} from './../services/rickandmorty';
import CharacterCard from './CharacterCard';

const Characters = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [origin, setOrigin] = useState('');
  const [location, setLocation] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce the search input
  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearchChange(e.target.value);
  };

  // Fetch character list based on search, filters, and page
  const { data, error, isLoading } = useGetCharacterListQuery({
    page,
    name: debouncedSearch,
    species,
    gender,
    status,
  });

  // Fetch unique species, origins, and locations dynamically from API
  const { data: speciesList } = useGetUniqueSpeciesQuery();
  const { data: originList } = useGetUniqueOriginsQuery();
  const { data: locationList } = useGetUniqueLocationsQuery();

  // Filter characters based on origin and location (client-side)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredCharacters = data?.results?.filter((character: any) => {
    const matchesOrigin = origin ? character.origin.name.includes(origin) : true;
    const matchesLocation = location ? character.location.name.includes(location) : true;
    return matchesOrigin && matchesLocation;
  });

  const handleNextPage = () => {
    if (data?.info.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.info.prev && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className={'character'}>
      <div className={'characterFilters'}>
        {/* Search Input */}
        <input
          type="text"
          className={'searchInput'}
          placeholder="Search Characters"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Filters */}
        <div className={'filters'}>
          {/* Species Filter */}
          <select value={species} onChange={(e) => setSpecies(e.target.value)} id="species" data-testid="species-select">
            <option value="">All Species</option>
            {speciesList?.map((speciesOption, idx) => (
              <option key={idx} value={speciesOption}>
                {speciesOption}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select value={gender} onChange={(e) => setGender(e.target.value)} id="gender" data-testid="gender-select">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Status Filter */}
          <select value={status} onChange={(e) => setStatus(e.target.value)} id="status" data-testid="status-select">
            <option value="">All Status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>

          {/* Origin Filter */}
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} id="origin" data-testid="origin-select">
            <option value="">All Origins</option>
            {originList?.map((originOption, idx) => (
              <option key={idx} value={originOption}>
                {originOption}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select value={location} onChange={(e) => setLocation(e.target.value)} id="location" data-testid="location-select">
            <option value="">All Locations</option>
            {locationList?.map((locationOption, idx) => (
              <option key={idx} value={locationOption}>
                {locationOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={'pagination'}>
        <button onClick={handlePreviousPage} disabled={!data?.info?.prev || page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={!data?.info?.next}>
          Next
        </button>
        <span>Page {page}</span>
      </div>

      {/* Character List */}
      <section className={'characterList'}>
        <div className={'characterListContainer'}>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className={'error'}>
              <p className="font-black">Error fetching characters. Please try again later.</p>
            </div>
          ) : filteredCharacters?.length === 0 ? (
            <div className="error">
              <h2>Awww Jeeez RICK</h2>
              <p>N-n-n-no characters found for the current search criteria.</p></div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filteredCharacters?.map((character: any) => (
              <CharacterCard key={character.id} character={character} chartoggle={undefined} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Characters;
