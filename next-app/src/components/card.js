import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppContext } from "../context/context";
import ImageSlider from "../components/slider";

const styles = {
  card: "bg-white rounded-lg flex flex-col m-1",
  bottomCard: "h-8",
  imageContainer: "flex items-center min-h-[16rem] max-h-[16rem]",
  image: "max-h-[16rem] m-auto",
  textContainer: "text-black flex",
  buttonContainer: "h-20 text-black flex items-center justify-center",
  textItems: "p-1",
  button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
};

const Card = (props) => {
  console.log(props.images);
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

  let card = props.card[0];
  let price = props.card[1];
  let inspectionStatus = props.card[2];
  let sellerAddress = props.card[3];
  let buyerAddress = props.card[4];
  let tokenId = props.card[5];
  let status = props.card[6];

  console.log(status);

  useEffect(() => {
    setButton();
    if (address === sellerAddress) {
      seller();
    } else if (address === "0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30") {
      inspector();
    } else {
      buyer();
    }
  }, [address, props]);

  const seller = async () => {
    console.log(status);
    if (buyerAddress === "0x0000000000000000000000000000000000000000") {
      setButton(<h2 className={styles.button}>Waiting for buyer</h2>);
    } else if (inspectionStatus == false) {
      setButton(<h2 className={styles.button}>Waiting for inspection</h2>);
    } else if (status === false) {
      setButton(
        <button classname={styles.button} onClick={() => approveSale(tokenId, address)} className={styles.button}>
          Approve Sale
        </button>
      );
    } else if (inspectionStatus == true) {
      setButton(
        <button onClick={() => finalizeSale(tokenId)} className={styles.button}>Finalize Sale</button>
      );
    }
  };

  const buyer = async () => {
    if (buyerAddress !== "0x0000000000000000000000000000000000000000") {
      if (inspectionStatus === false) {
        setButton(<h2 className={styles.button}>Waiting for inspection</h2>);
      } else if (inspectionStatus === true && status === false) {
        setButton(
          <button onClick={() => approveSale(tokenId, address)} className={styles.button}>
            Approve Sale
          </button>
        );
      } else {
        setButton(<h2 className={styles.button}>Waiting for Finalized Sale</h2>);
      }
    } else {
      setButton(<button onClick={() => buyCar(tokenId, price)} className={styles.button}>Buy</button>);
    }
  };

  const inspector = async () => {
    if (address == "0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30") {
      if (buyerAddress === "0x0000000000000000000000000000000000000000") {
        setButton(<h2 className={styles.button}>Waiting for buyer</h2>);
      } else if (inspectionStatus === false) {
        setButton(
          <button onClick={() => setInspectionStatus(tokenId, true)} className={styles.button}>
            Approve Inspection
          </button>
        );
      } else {
        setButton(
          <button className={styles.button}>
          Inspection Approved
        </button>
        )
      }
    }
  };

  return (
    <div className={styles.card}>
          {card.images ? <ImageSlider images={card.images}/> : <></>}
          {/* {card.images ? <img src={card.images[0]} className={styles.image}/> : <></>} */}
        <div className={styles.bottomCard}>
          <div className={styles.textContainer}>
            <h2 className={styles.textItems}>{card.attributes.year}</h2>
            <h2 className={styles.textItems}>{card.attributes.manufacturer}</h2>
            <h2 className={styles.textItems}>{card.attributes.model}</h2>
            <h2 className={styles.textItems}>${card.attributes.price}</h2>
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.textItems}></h2>
          </div>
          <div className={styles.textContainer}>
            {/* <p>{card.attributes.description}</p> */}
          </div>
        </div>
        <div className={styles.buttonContainer}>{button}</div>
    </div>
  );
};

export default Card;
