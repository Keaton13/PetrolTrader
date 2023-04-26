import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppContext } from "../context/context";
import ImageSlider from "../components/slider";

const styles = {
  card: "bg-white rounded-lg flex flex-col m-1",
  bottomCard: "h-20",
  imageContainer: "flex items-center",
  image: "max-h-[16rem] m-auto",
  textContainer: "text-black flex p-1",
  buttonContainer: "h-20 text-black flex items-center pl-6",
  textItems: "p-1 pl-4",
  textItemsBottom: "p-2 pb-4 text-slate-500 m-auto text-xs border-t border-gray-400",
  textItemsBigText: "p-1 pl-4 pr-2 text-2xl",
  borderLeft: "p-1 pl-2 text-2xl border-l border-gray-400",
  button:
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  blueLink: 'text-blue-500 font-bold'
};

const Card = (props) => {
  const { address } = useAccount();
  const {
    uploadToIpfs,
    setInspectionStatus,
    buyCar,
    approveSale,
    finalizeSale,
    approvalStatus,
    events,
  } = useAppContext();

  const [button, setButton] = useState(null);
  const [showModal, setShowModal] = useState(false);

  let card = props.card[0];
  let price = props.card[1];
  let inspectionStatus = props.card[2];
  let sellerAddress = props.card[3];
  let buyerAddress = props.card[4];
  let tokenId = props.card[5];
  let status = props.card[6];
  

  let stringPrice = parseFloat(card.attributes.price);
  stringPrice = stringPrice.toLocaleString();

  let milage = parseInt(card.attributes.mileage, "10");
  milage = Math.ceil(milage / 1000);

  // console.log(card);

  useEffect(() => {
    setButton();
    if (inspectionStatus !== undefined) {
      if (address === sellerAddress) {
        seller();
      } else if (address === "0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30") {
        inspector();
      } else {
        buyer();
      }
    } else {
      sold();
    }
  }, [address, props]);

  const seller = async () => {
    if (buyerAddress === "0x0000000000000000000000000000000000000000") {
      setButton(<h2 className={styles.button}>Waiting for buyer</h2>);
    } else if (inspectionStatus == false) {
      setButton(<h2 className={styles.button}>Waiting for inspection</h2>);
    } else if (status === false) {
      setButton(
        <button
          classname={styles.button}
          onClick={() => approveSale(tokenId, address)}
          className={styles.button}
        >
          Approve Sale
        </button>
      );
    } else if (inspectionStatus == true) {
      setButton(
        <button onClick={() => finalizeSale(tokenId)} className={styles.button}>
          Finalize Sale
        </button>
      );
    }
  };

  const buyer = async () => {
    if (buyerAddress !== "0x0000000000000000000000000000000000000000") {
      if (inspectionStatus === false) {
        setButton(<h2 className={styles.button}>Waiting for inspection</h2>);
      } else if (inspectionStatus === true && status === false) {
        setButton(
          <button
            onClick={() => approveSale(tokenId, address)}
            className={styles.button}
          >
            Approve Sale
          </button>
        );
      } else {
        setButton(
          <h2 className={styles.button}>Waiting for Finalized Sale</h2>
        );
      }
    } else {
      setButton(
        <button
          onClick={() => buyCar(tokenId, price)}
          className={styles.button}
        >
          Buy
        </button>
      );
    }
  };

  const inspector = async () => {
    if (address == "0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30") {
      if (buyerAddress === "0x0000000000000000000000000000000000000000") {
        setButton(<h2 className={styles.button}>Waiting for buyer</h2>);
      } else if (inspectionStatus === false) {
        setButton(
          <button
            onClick={() => setInspectionStatus(tokenId, true)}
            className={styles.button}
          >
            Approve Inspection
          </button>
        );
      } else {
        setButton(
          <button className={styles.button}>Inspection Approved</button>
        );
      }
    }
  };

  const sold = async () => {
    setButton(<button className={styles.button}>Sold</button>);
  };

  return (
    <div className={styles.card}>
      {card.images ? <ImageSlider images={card.images} /> : <></>}
      <div
        className={styles.bottomCard}
        onClick={() => {
          props.handleOpen(card,button);
        }}
      >
        <div className={styles.textContainer}>
          <a className={styles.blueLink}>
            {" "}
            <h2 className={styles.textItems}>
              {card.attributes.year} {card.attributes.manufacturer}{" "}
              {card.attributes.model}
            </h2>
          </a>
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.textItemsBigText}>${stringPrice}</h2>
          <h2 className={styles.borderLeft}>{milage}K mi</h2>
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.textItems}></h2>
        </div>
      </div>
      <div className={styles.buttonContainer}>{button}</div>
      <div className={styles.textContainer}>
        <p className={styles.textItemsBottom}>
          All purchases and sales require an inspection *
        </p>
      </div>
    </div>
  );
};

export default Card;
