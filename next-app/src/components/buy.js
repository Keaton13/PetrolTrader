import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import { useAccount } from "wagmi";
import Card from "./card";
import Modal from "./modal";

const style = {
  container: "flex flex-col items-center justify-center w-full",
  cardContainer: "",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-6 w-full",
  title: "text-4xl font-bold text-center text-white",
  carWrapper: "mt-8",
  car: "animate-bounce w-16 h-16 text-white",
  text: "mt-4 mb-5 text-white text-2xl text-center",
  textLogo: "text-white text-2xl",
  card: "bg-white rounded-lg shadow-lg p-6",
};

const Buy = () => {
  const { nfts } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [card, setCard] = useState();
  const [button, setButton] = useState();

  const { address } = useAccount();

  useEffect(() => {
    handleClose();
  }, [address]);

  const handleClose = (card) => {
    setShowModal(false);
    setCard();
  };

  const handleOpen = (card, button) => {
    setCard(card);
    setButton(button);
    setShowModal(true);
  }

  return (
    <div className={style.container}>
      <h1 className={style.title}>Marketplace</h1>
      <div className={style.grid}>
        {nfts && nfts.map((card, index) => (
          <div key={index}>
            <Card key={index} card={card} handleOpen={handleOpen} />
          </div>
        ))}
      </div>
      {showModal && (
          <Modal onClose={handleClose} card={card} button={button}>
            <h2>Hello, World!</h2>
            <p>This is my modal dialog.</p>
          </Modal>
        )}
    </div>
  );
};

export default Buy;
