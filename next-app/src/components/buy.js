import React from "react";
import { useAppContext } from "../context/context";
import Card from "./card";

const style = {
  container: "flex flex-col items-center justify-center w-full",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 w-full",
  title: "text-4xl font-bold text-center text-white",
  carWrapper: "mt-8",
  car: "animate-bounce w-16 h-16 text-white",
  text: "mt-4 mb-5 text-white text-2xl text-center",
  textLogo: "text-white text-2xl",
  card: "bg-white rounded-lg shadow-lg p-6",
};

const Buy = () => {
  const { nfts } = useAppContext();

  return (
    <div className={style.container}>
      <h1 className={style.title}>Marketplace</h1>
      <div className={style.grid}>
        {nfts.map((card, index) => (
          <div key={index}>
            <Card key={index} card={card}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;