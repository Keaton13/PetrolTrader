import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const style = {
  connectButtonContainer: `w-2/4`,
};

const header = () => {
  return (
    <div className={styles.description}>
      <p>Get started by connecting your wallet! &nbsp;</p>
      <div className={style.connectButtonContainer}>
        <ConnectButton />
      </div>
      <div>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className={styles.vercelLogo}
            width={100}
            height={24}
            priority
          />
        </a>
      </div>
    </div>
  );
};

export default header;