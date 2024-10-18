/* eslint-disable react/react-in-jsx-scope */
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useGetLocationsListQuery } from './../services/rickandmorty';

const Locations = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dimension, setDimension] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(name);

  // Debounce the search input
  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
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

  return (
    <div className={'locations'}>
      <div className={'locationFilters'}>
        {/* Search Input */}
        <input
          type="text"
          className={'searchInput'}
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
          </select>

          {/* Dimension Filter */}
          <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
            <option value="">All Dimensions</option>
            <option value="Dimension C-137">Dimension C-137</option>
            <option value="Post-Apocalyptic Dimension">Post-Apocalyptic Dimension</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={'pagination'}>
        <button onClick={handlePreviousPage} disabled={!data?.info.prev || page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={!data?.info.next}>
          Next
        </button>
        <span>{page} / {data?.info?.pages}</span>
      </div>

      {/* Locations List or Error Handling */}
      <section className={'locationList'}>
        <div className={'locationListContainer'}>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className={'error'}>
              <h2>DAMN IT M-M-M-MORTY..</h2>
              <p className="font-black">
                We have an Error!!...AN ERROR M-m-m-m-morty...Unable to fetch data...WHAT DID YOU DO M-M-M-MORTY?
              </p>
              <div style={{ width: '100%', height: '0', paddingBottom: '100%', position: 'relative' }}>
                <iframe
                  src="https://giphy.com/embed/YrrihyxWQ3pRswrIYe"
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  frameBorder="0"
                  className="giphy-embed"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="error">
              <h2>No Locations Found</h2>
              <p>No locations found for the current search criteria.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?.results.map((location: any) => (
              <div key={location.id} className={'locationCard'}>
                <h3 className={'locationListItemTitle'}>{location.name}</h3>
                {/* <p>{location.url}</p> */}
                <p>
                  <strong>Type:</strong> {location.type}
                </p>
                <p>
                  <strong>Dimension:</strong> {location.dimension}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Locations;
