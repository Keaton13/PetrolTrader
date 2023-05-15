import React from "react";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useAppContext } from "../context/context";

const inter = Inter({ subsets: ["latin"] });


const footer = () => {
  const { userAddress, setPage } = useAppContext();

  return (
    <div className={styles.grid}>
      <a
        onClick={() => setPage('Buy')}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={inter.className}>
          Buy <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          Find the best deals right from the comfort of your home.
        </p>
      </a>

      <a
       onClick={() => setPage('List')}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={inter.className}>
          Sell <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          Instantly sell your cars to a worldwide marketplace.
        </p>
      </a>

      <a
        onClick={() => setPage('Sold')}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={inter.className}>
          Sold <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          See cars recently listed and sold on our application.
        </p>
      </a>
    </div>
  );
};

export default footer;
