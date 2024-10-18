/* eslint-disable react/react-in-jsx-scope */
import styles from "./home.module.css";
import Landing from "../../components/Landing";

const Home = () => {
  return (
    <main className={styles.container}>
      <div data-testid="home-component">
        <Landing />
      </div>
    </main>
  );
};
export default Home;
