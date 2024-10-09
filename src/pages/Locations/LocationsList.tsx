/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useGetLocationsListQuery } from '../../services/rickandmorty';
import styles from './index.module.css';

const LocationsList = () => {
  const { data, error, isLoading } = useGetLocationsListQuery();

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

  console.log('data', data?.results);

  const whereGotClicked = (location: any) => {
    console.log(`Character with name ${location.name} and id: ${location.id} was clicked`);
  };

  return (
    <main className={styles.container}>
      <section className={styles.taskList}>
        <h1>What up? Let's do it! Wubbalubbadubdub</h1>

        <form>
          <input type="text" name="location" value="" />
          <button type="submit">Search locations</button>
        </form>

        {data?.results.map((location: any) => (
          <div key={location.id} onClick={() => whereGotClicked(location)}>
            <h3>{location.name}</h3>
            <img src={location.image} alt={location.name} width={100} />
          </div>
        ))}

        <p>We'll splooge out results here shortly.</p>
      </section>
    </main>
  );
};

export default LocationsList;
