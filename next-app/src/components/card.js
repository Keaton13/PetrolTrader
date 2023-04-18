import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppContext } from "../context/context";

const styles = {
  card: "bg-white rounded-lg overflow-hidden flex flex-col m-1",
  imageContainer: "h-96 overflow-hidden",
  textContainer: "text-black flex",
  textItems: "p-1",
};

const Card = (props) => {
  console.log(props);
  const { address } = useAccount();
  const {
    uploadToIpfs,
    setInspectionStatus,
    buyCar,
    approveSale,
    finalizeSale,
    approvalStatus,
    loadBlockchainData,
    events
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
  }, [address, events]);

  const seller = async () => {
    console.log(status);
    if (buyerAddress === "0x0000000000000000000000000000000000000000") {
      setButton(<h2>Waiting for buyer</h2>);
    } else if (inspectionStatus == false) {
      setButton(<h2>Waiting for inspection</h2>);
    } else if (status === false) {
      setButton(
        <button onClick={() => approveSale(tokenId, address)}>
          Approve Sale
        </button>
      );
    } else if (inspectionStatus == true) {
      setButton(
        <button onClick={() => finalizeSale(tokenId)}>Finalize Sale</button>
      );
    }
  };

  const buyer = async () => {
    if (buyerAddress !== "0x0000000000000000000000000000000000000000") {
      if (inspectionStatus === false) {
        setButton(<h2>Waiting for inspection</h2>);
      } else if (inspectionStatus === true && status === false) {
        setButton(
          <button onClick={() => approveSale(tokenId, address)}>
            Approve Sale
          </button>
        );
      } else {
        setButton(<h2>Waiting for Finalized Sale</h2>);
      }
    } else {
      setButton(<button onClick={() => buyCar(tokenId, price)}>Buy</button>);
    }
  };

  const inspector = async () => {
    if (address == "0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30") {
      if (buyerAddress === "0x0000000000000000000000000000000000000000") {
        setButton(<h2>Waiting for buyer</h2>);
      } else if (inspectionStatus === false) {
        setButton(
          <button onClick={() => setInspectionStatus(tokenId, true)}>
            Approve Inspection
          </button>
        );
      } else {
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div>{card.images ? <img src={card.images[0]} /> : <></>}</div>
        <div className={styles.textContainer}>
          <h2 className={styles.textItems}>{card.attributes.year}</h2>
          <h2 className={styles.textItems}>{card.attributes.manufacturer}</h2>
          <h2 className={styles.textItems}>{card.attributes.model}</h2>
          <h2 className={styles.textItems}>{card.attributes.miles}</h2>
          <h2 className={styles.textItems}>${card.attributes.price}</h2>
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.textItems}></h2>
          <p>{sellerAddress}</p>
        </div>
        <div className={styles.textContainer}>
          {/* <p>{card.attributes.description}</p> */}
        </div>
        <div className={styles.textContainer}>{button}</div>
      </div>
    </div>
  );
};

export default Card;
