/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useGetCharacterListQuery } from './../services/rickandmorty';
import styles from './index.module.css';
import Tabs from './Tabs/Tabs'

const Characters = () => {
  const { data, error, isLoading } = useGetCharacterListQuery();

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
    console.log(`Character with name ${character.name} and id: ${character.id} was clicked`);
  };

  return (
    <main className={styles.container}>
      <section className={styles.taskList}>
        <h1>What up? Let's do it! Wubbalubbadubdub</h1>
       
        <form>
          <input type="text" name="character" value="" />
          <button type="submit">Search Characters</button>
        </form>

        {data?.results.map((character: any) => (
          <div key={character.id} onClick={() => whoGotClicked(character)}>
            <h3>{character.name}</h3>
            <p>Species: {character.species}</p>
            <p>Status: {character.status}</p>
            <p>Location: {character.location.name}</p>
            <img src={character.image} alt={character.name} width={100} />
          </div>
        ))}

        <p>We'll splooge out results here shortly.</p>
      </section>
    </main>
  );
};

export default Characters;







