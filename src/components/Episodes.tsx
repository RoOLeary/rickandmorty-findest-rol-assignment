/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useGetEpisodeListQuery } from './../services/rickandmorty';
import styles from './index.module.css';

const Episodes = () => {
  const { data, error, isLoading } = useGetEpisodeListQuery();

    console.log('episode data', data);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <main className={styles.container}>
        <p className={styles.error}>{JSON.stringify(error)}</p>
      </main>
    );
  }


  const whoGotClicked = (character: any) => {
    console.log(`Episode with name ${character.name} and id: ${character.id} was clicked`);
  };

  return (
    <main className={styles.container}>
      <section className={styles.taskList}>
        <h1>What up? Let's do it! Wubbalubbadubdub</h1>
       
        {data?.results.map((episode: any) => (
          <div key={episode.id} onClick={() => whoGotClicked(episode)}>
            <h3>{episode.name}</h3>
            <p>Air Date: {episode.air_date}</p>
            <p>Episode: {episode.episode}</p>
            
            
          </div>
        ))}

        <p>We'll splooge out results here shortly.</p>
      </section>
    </main>
  );
};

export default Episodes;







