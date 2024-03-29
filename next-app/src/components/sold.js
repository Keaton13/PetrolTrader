import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import { useAccount } from "wagmi";
import Card from "./card";

// Styles for Sold component
const style = {
  container: "flex flex-col items-center justify-center w-full",
  cardContainer: "",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 w-full",
  title: "text-4xl font-bold text-center text-white",
  carWrapper: "mt-8",
  car: "animate-bounce w-16 h-16 text-white",
  text: "mt-4 mb-5 text-white text-2xl text-center",
  textLogo: "text-white text-2xl",
  textLogoNoNft: "text-white text-2xl font-bold",
  card: "bg-white rounded-lg shadow-lg p-6",
};

const Sold = () => {
  // Using the App Context to access soldNfts
  const { soldNfts } = useAppContext();
  console.log(soldNfts)
  return (
    <div className={style.container}>
      <h1 className={style.title}>Marketplace</h1>
      <div className={style.grid}>
        {soldNfts.length >= 1 &&
          soldNfts.map((card, index) => (
            <div key={index}>
              <Card key={index} card={card} />
            </div>
          ))}
      </div>
      {soldNfts.length == 0 && (
        <div>
          <h1 className={style.textLogoNoNft}>No Sold NFTS</h1>
          <h1 className={style.title}>:/</h1>
        </div>
      )}
    </div>
  );
};

export default Sold;
