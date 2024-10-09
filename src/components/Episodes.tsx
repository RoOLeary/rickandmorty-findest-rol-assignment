import React, { useEffect, useState, Suspense } from 'react';
import { useGetEpisodeListQuery } from './../services/rickandmorty';
import styles from './index.module.css';

const Episodes = () => {
  const [page, setPage] = useState(1);
  const [air_date, setAirDate] = useState('');
  const [episode, setEpisode] = useState('');
  const [characters, setCharacters] = useState('');
  
  const { data, error, isLoading } = useGetEpisodeListQuery({
    page,
    air_date,
    episode,
    characters
  });

  

  

  // Fetch character list based on search, filters, and page



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
  
    // Set character details (name + image) once all promises resolve
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
        <p className={styles.error}>{JSON.stringify(error)}</p>
      </main>
    );
  }

  const whoGotClicked = (character: any) => {
    console.log(`Episode with name ${character.name} and id: ${character.id} was clicked`);
  };

  return (
    <section className={"episodeList"}>
      <div className="episodeListContainer">
        {data?.results.map((episode: any) => (
          <div key={episode.id} onClick={() => whoGotClicked(episode)} className="episodeListItem">
            <div className="episodeListItemDetail">
              <h3 className="episodeListItemTitle">{episode.name}</h3>
              <p><strong>Air Date: </strong>{episode.air_date}</p>
              <p><strong>Episode: </strong>{episode.episode}</p>
              <p><strong>Characters: </strong></p>
              <ul className="flex flex-wrap gap-2 py-4">
              <Suspense fallback={<LoadingFallback />}>
                {characterDetails[episode.id] ? (
                  characterDetails[episode.id].map((character, idx) => (
                    <li key={idx}>
                      <a href={character.url}>
                        <img
                          src={character.image}
                          alt={character.name}
                          style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '25px' }}
                        />
                      </a>
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
      <div className={'pagination'}>
        <button onClick={handlePreviousPage} disabled={!data?.info.prev || page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={!data?.info.next}>
          Next
        </button>
      </div>
    </section>
  );
};

export default Episodes;
