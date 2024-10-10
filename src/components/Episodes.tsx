/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Suspense } from 'react';
import {
  useGetEpisodeListQuery,
  useGetEpisodesBySeasonQuery,
  useGetEpisodesBySeasonAndNumberQuery
} from './../services/rickandmorty';
import Modal from '../components/Modal';

const Episodes = () => {
  const [page, setPage] = useState(1);
  const [season, setSeason] = useState<number | string>('');  
  const [episodeNumber, setEpisodeNumber] = useState<number | string>('');  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  // API call based on filters
  const { data = { results: [], info: {} }, error, isLoading } = season
  ? episodeNumber
    ? useGetEpisodesBySeasonAndNumberQuery({ season: Number(season), episode: Number(episodeNumber) })
    : useGetEpisodesBySeasonQuery({ season: Number(season) })
  : useGetEpisodeListQuery({ page });

  const [characterDetails, setCharacterDetails] = useState<{
    [key: number]: { url: string | undefined; name: string; image: string }[];
  }>({});

  const openModal = (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const LoadingFallback = () => <li>Awwww Jeez...th..th..this is gonna take a second.</li>;

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
          url: characterData.url || ''
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <main>
        <p className={'error'}>{JSON.stringify(error)}</p>
      </main>
    );
  }

  return (
    <>
      <section className="episodeList">
        {/* Filters Section */}
        <div className="episodeFilters">
          <input type="text" className="searchInput" placeholder="Search Episodes" />
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

        <div className={'pagination'}>
          <button onClick={handlePreviousPage} disabled={!data?.info?.prev || page === 1} data-testid="pagination-previous">
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!data?.info?.next} data-testid="pagination-next">
            Next
          </button>
          <span>Page {page}</span>
        </div>

        <div className="episodeListContainer">
          {data?.results?.map((episode: any) => (
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
          ))}
        </div>
      </section>

      {selectedCharacter && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} />
          <h3 className="characterListItemTitle">{selectedCharacter.name}</h3>
        </Modal>
      )}
    </>
  );
};

export default Episodes;