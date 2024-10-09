/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useGetLocationsListQuery } from './../services/rickandmorty';
import styles from './index.module.css';

const Locations = () => {
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
    
        {data?.results.map((location: any) => (
          <div key={location.id} onClick={() => whereGotClicked(location)}>
            <h3>{location.name}</h3>
            <p>Dimension: {location.dimension}</p>
          </div>
        ))}

        <p>We'll splooge out results here shortly.</p>
      </section>
    </main>
  );
};

export default Locations;
