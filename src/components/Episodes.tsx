import React, { useEffect, useState, Suspense } from 'react';
import { useGetEpisodeListQuery } from './../services/rickandmorty';
// import styles from './index.module.css';
import Modal from '../components/Modal';

const Episodes = () => {
  const [page, setPage] = useState(1);
  const [air_date, setAirDate] = useState('');
  const [episode, setEpisode] = useState('');
  const [characters, setCharacters] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  const openModal = (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const { data, error, isLoading } = useGetEpisodeListQuery({
    page,
    air_date,
    episode,
    characters
  });

  const [characterDetails, setCharacterDetails] = useState<{ [key: number]: {
    url: string | undefined; name: string, image: string 
}[] }>({});

  const LoadingFallback = () => <li>Awwww Jeez...th..th..this is gonna take a second.</li>;

  // Function to fetch character names from the character URLs
  const fetchCharacterDetails = async (episodeId: number, characterUrls: string[]) => {
    const characterIds = characterUrls.map((url) => url.split('/').pop()); // Extract character IDs
    const characterDetailsArray = await Promise.all(
      characterIds.map(async (id) => {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const characterData = await response.json();
        return {
          name: characterData.name || 'Unknown',
          image: characterData.image || '', // Fetch image URL
          url: characterData.url || '', // Fetch image URL
        };
      })
    );
  
    setCharacterDetails((prev) => ({ ...prev, [episodeId]: characterDetailsArray }));
  };

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

  useEffect(() => {
    if (data) {
      data.results.forEach((episode: any) => {
        fetchCharacterDetails(episode.id, episode.characters);
      });
    }
  }, [data]);

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
          {/* Search Input */}
          <input
            type="text"
            className="searchInput"
            placeholder="Search Episodes"
          />

          {/* Filters */}
          <div className="filters">
            {/* Season Filter */}
            <select>
              <option value="">Seasons</option>
              <option value="se1">Season 1</option>
              <option value="se2">Season 2</option>
              <option value="se3">Season 3</option>
              <option value="se4">Season 4</option>
              <option value="se5">Season 5</option>
              <option value="se6">Season 6</option>
            </select>

            {/* Episode Filter */}
            <select>
              <option value="">Episode</option>
              <option value="ep1">Episode 1</option>
              <option value="ep2">Episode 2</option>
              <option value="ep3">Episode 3</option>
              <option value="ep4">Episode 4</option>
              <option value="ep5">Episode 5</option>
              <option value="ep6">Episode 6</option>
              <option value="ep7">Episode 7</option>
              <option value="ep8">Episode 8</option>
              <option value="ep9">Episode 9</option>
              <option value="ep10">Episode 10</option>
            </select>

            {/* Character Filter */}
            <select>
              <option value="">Characters</option>
              <option value="Dimension C-137">Dimension C-137</option>
              <option value="Post-Apocalyptic Dimension">Post-Apocalyptic Dimension</option>
            </select>
          </div>
        </div>

        {/* Episode List Section */}
        <div className="episodeListContainer">
       
          {data?.results.map((episode: any) => (
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
                              data-view-transition={`character-image-${character}`}
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

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={!data?.info.prev || page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={handleNextPage} disabled={!data?.info.next}>
            Next
          </button>
        </div>
      </section>

      {/* Modal Component */}
      {selectedCharacter && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} data-view-transition={`character-image-${selectedCharacter.id}`}/>
          <h3 className="characterListItemTitle">{selectedCharacter.name}</h3>
        </Modal>
      )}
    </>
  );
};

export default Episodes;
