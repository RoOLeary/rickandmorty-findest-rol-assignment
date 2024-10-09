import React from 'react'
import { Link } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import type { RootState } from '../../store'

import styles from './index.module.css'
import Landing from '../../components/Landing'
import logo from './logo.svg'

const Home = () => {
  
  return (
    <main className={styles.container}>
      <Landing />
    </main>
  )
}
export default Home
