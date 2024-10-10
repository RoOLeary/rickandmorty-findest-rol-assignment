/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Suspense, useCallback } from 'react';
import {
  useGetEpisodeListQuery,
  useGetEpisodesBySeasonQuery,
  useGetEpisodesBySeasonAndNumberQuery
} from './../services/rickandmorty';
import { debounce } from 'lodash';
import Modal from '../components/Modal';

const Episodes = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [season, setSeason] = useState<number | string>('');  
  const [episodeNumber, setEpisodeNumber] = useState<number | string>('');  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    setSearchTerm(e.target.value);
    debouncedSearchChange(e.target.value);
  };

  // API call based on filters
  const { data = { results: [], info: {} }, error, isLoading } = season
  ? episodeNumber
    ? useGetEpisodesBySeasonAndNumberQuery({ season: Number(season), episode: Number(episodeNumber) })
    : useGetEpisodesBySeasonQuery({ season: Number(season) })
  : useGetEpisodeListQuery({ page, name: debouncedSearch });

  const [characterDetails, setCharacterDetails] = useState<{
    [key: number]: { url: string | undefined; name: string; image: string }[];
  }>({});

  const openModal = (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const LoadingFallback = () => <div>Awwww Jeez...th..th..this is gonna take a second.</div>;

  // Fetch character details
  const fetchCharacterDetails = async (episodeId: number, characterUrls: string[]) => {
    const characterIds = characterUrls.map((url) => url.split('/').pop());
    const characterDetailsArray = await Promise.all(
      characterIds.map(async (id) => {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const characterData = await response.json();
        return {
          name: characterData.name || 'Unknown',
          image: characterData.image || '',
          url: characterData.url || '',
          species: characterData.species || 'Unknown',
          origin: characterData.origin.name || 'C-137',
          location: characterData.location.name || 'Earth',
        };
      })
    );
    setCharacterDetails((prev) => ({ ...prev, [episodeId]: characterDetailsArray }));
  };

  useEffect(() => {
    if (data?.results) {
      data.results.forEach((episode: any) => {
        fetchCharacterDetails(episode.id, episode.characters);
      });
    }
   
  }, [data]);

  const handleNextPage = () => {
    if (data?.info?.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.info?.prev && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value);
    setPage(1); 
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEpisodeNumber(e.target.value);
  };


  return (
    <>
      <section className="episodeList">
        {/* Filters Section */}
        <div className="episodeFilters">
          <input type="text" className="searchInput" placeholder="Search Episodes" value={searchTerm} onChange={handleSearchChange} />
          <div className="filters">
            <select onChange={handleSeasonChange} value={season}>
              <option value="">All Seasons</option>
              <option value="1">Season 1</option>
              <option value="2">Season 2</option>
              <option value="3">Season 3</option>
              <option value="4">Season 4</option>
              <option value="5">Season 5</option>
              <option value="6">Season 6</option>
            </select>
            {season && (
              <select onChange={handleEpisodeChange} value={episodeNumber}>
                <option value="">All Episodes</option>
                {[...Array(10)].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    Episode {idx + 1}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className={'pagination'}>
          <button onClick={handlePreviousPage} disabled={!data?.info?.prev || page === 1} data-testid="pagination-previous">
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!data?.info?.next} data-testid="pagination-next">
            Next
          </button>
          <span>{page} / {data?.info?.pages}</span>
        </div>

        {/* Episode List or Error Handling */}
        <div className="episodeListContainer">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className={'error'}>
              <h2>Awwww Jeez</h2>
              <p className='font-black'>N-n-n-no characters found for this...c-c-c uuuhhh jeez....current search criteria.</p>
              <p className='font-black'>Maybe try another search term? Or we could watch some Interdimensional Cable?</p>
            </div>
          ) : data?.results?.length === 0 ? (
            
            <div className={'error'}>
              <h2>Awwww Jeez</h2>
              <p>N-n-n-no episodes found for the current search criteria.</p>
          </div>
          ) : (
            data?.results?.map((episode: any) => (
              <div key={episode.id} className="episodeListItem">
                <div className="episodeListItemDetail">
                  <h3 className="episodeListItemTitle">{episode.name}</h3>
                  <p><strong>Air Date: </strong>{episode.air_date}</p>
                  <p><strong>Episode: </strong>{episode.episode}</p>
                  <p><strong>Characters: </strong></p>
                  <ul className="flex flex-wrap gap-2 py-4 max-sm:justify-between">
                    <Suspense fallback={<LoadingFallback />}>
                      {characterDetails[episode.id] ? (
                        characterDetails[episode.id].map((character, idx) => (
                          <li key={idx}>
                            <div onClick={() => openModal(character)}>
                              <img
                                src={character.image}
                                alt={character.name}
                                style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '25px' }}
                              />
                            </div>
                          </li>
                        ))
                      ) : (
                        <LoadingFallback />
                      )}
                    </Suspense>
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedCharacter && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} />
          <h3 className="font-black text-2xl">{selectedCharacter.name}</h3>
          <p>Species: {selectedCharacter.species}</p>
          {selectedCharacter.origin.name ? <p>Origin: {selectedCharacter.origin.name}</p> : null}
          {selectedCharacter.location.name ? <p>Location: {selectedCharacter.location.name}</p> : null}
        </Modal>
      )}
    </>
  );
};

export default Episodes;
