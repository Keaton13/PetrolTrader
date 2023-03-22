import React, { useContext } from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppContext } from "../context/context";

const style = {
  connectButtonContainer: "pl-4",
  headerButtonContainer: "flex flex-row items-center justify-center",
  headerButton: "w-40",
};
const header = () => {
  const { userAddress, setPage } = useAppContext();

  return (
    <div className={styles.description}>
      {userAddress ? (
        <div>
          <ConnectButton />
        </div>
      ) : (
        <div className={style.headerButtonContainer}>
          <p>Login by connecting your wallet &nbsp;</p>
          <div className={style.connectButtonContainer}>
            <ConnectButton />
          </div>
        </div>
      )}
      {userAddress ? (
        <div className={style.headerButtonContainer}>
          <button className={style.headerButton} onClick={() => setPage('Buy')}>For Sale</button>
          <button className={style.headerButton} onClick={() => setPage('List')}>List Car</button>
        </div>
      ) : (
        <></>
      )}

      <div>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Petrol Motor Group</h2>
        </a>
      </div>
    </div>
  );
};

export default header;
