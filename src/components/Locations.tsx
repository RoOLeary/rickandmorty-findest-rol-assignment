import { useState, useEffect, useCallback } from 'react';
// @ts-expect-error
import { debounce } from 'lodash';
import { useGetLocationsListQuery } from './../services/rickandmorty';
import styles from './index.module.css';

const Locations = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dimension, setDimension] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(name);

  // Debounce the search input
  const debouncedSearchChange = useCallback(
    debounce((value:string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    debouncedSearchChange(e.target.value);
  };

  // Fetch the locations based on search, filters, and page
  const { data, error, isLoading } = useGetLocationsListQuery({
    page,
    name: debouncedSearch,
    type,
    dimension,
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Handle errors gracefully
  if (error) {
    return (
      <main>
        <p className={'error'}>
            Error: We're out of Portal Gun Fluid. Unable to fetch data.
        </p>
      </main>
    );
  }

  // Graceful handling of no results found
  if (data?.results.length === 0) {
    return (
      <main>
        <p className={
            'error'}>No locations found for the current search criteria.</p>
      </main>
    );
  }

  return (
    <div className={'locations'}>
      <div className={'locationFilters'}>
        {/* Search Input */}
        <input
          type="text"
          className={
            'searchInput'}
          placeholder="Search Locations by Name"
          value={name}
          onChange={handleSearchChange}
        />

        {/* Filters */}
        <div className={'filters'}>
          {/* Type Filter */}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Planet">Planet</option>
            <option value="Cluster">Cluster</option>
            <option value="Space station">Space Station</option>
            {/* Add more type options based on what the API supports */}
          </select>

          {/* Dimension Filter */}
          <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
            <option value="">All Dimensions</option>
            <option value="Dimension C-137">Dimension C-137</option>
            <option value="Post-Apocalyptic Dimension">Post-Apocalyptic Dimension</option>
            {/* Add more dimension options based on what the API supports */}
          </select>
        </div>
      </div>

      {/* Locations List */}
      <section className={'locationList'}>
      
        <div className={'locationListContainer'}>
          {data?.results.map((location:any) => (
            <div key={location.id} className={'locationCard'}>
              <h3 className={'locationListItemTitle'}>{location.name}</h3>
              <p><strong>Type:</strong> {location.type}</p>
              <p><strong>Dimension:</strong> {location.dimension}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Controls */}
      <div className={
        'pagination'}>
        <button onClick={handlePreviousPage} disabled={!data?.info.prev || page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={!data?.info.next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Locations;
