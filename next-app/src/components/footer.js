import React from "react";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


const footer = () => {
  return (
    <div className={styles.grid}>
      <a
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
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
        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
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
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={inter.className}>
          Inspect <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          Certified inspectors confirm you are getting what you pay for.
        </p>
      </a>
    </div>
  );
};

export default footer;
