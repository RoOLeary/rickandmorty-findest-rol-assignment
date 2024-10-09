/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

import { useGetCharacterListQuery } from '../../services/rickandmorty'

import styles from './index.module.css'

const TaskList = () => {
  const { data, error } = useGetCharacterListQuery()


  console.log('data', data?.results);

  const whoGotClicked = (task:any) => {
    console.log(`item with title ${task.title} and id: ${task.id} was clicked`);
  }

  if (error)
    return (
      <main className={styles.container}>
        <p className={styles.error}>{JSON.stringify(error)}</p>
      </main>
    )

  return (
    <main className={styles.container}>
      <section className={styles.taskList}>
        <h1>What up? Let's do it! Wubbalubbadubdub</h1>
        
        <p>We'll splooge out results here shortly. </p>

      </section>
    </main>
  )
}

export default TaskList
