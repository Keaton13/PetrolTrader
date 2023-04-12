import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppContext } from "../context/context";

const styles = {
  card: "bg-white rounded-lg overflow-hidden flex flex-col m-1",
  imageContainer: "h-96 overflow-hidden",
  textContainer: "text-black flex",
  textItems: "p-1",
};

const Card = (props) => {
  const { address } = useAccount();
  const { uploadToIpfs } = useAppContext();

  console.log(props.card);
  let card = props.card[0];
  let inspectionStatus = props.card[1];
  let tokenId = props.card[2];
  let button;

  useEffect(() => {
    if(address == "0x84125D450F39d06C3Df31161D6d7de5c5977F472"){
      button = <button>Approve Inspection</button>
    } else if (address == "") {
      button = <button>Approve Sale</button>
    } else if (address == "") {
      button = <button>Approve Inspection</button>
    } else {
      button = <></>
    }
  }, [address])

  const fetchData = async () => {

  }

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
          <p>{card.attributes.description}</p>
        </div>
        <div className={styles.textContainer}>
          {button}
        </div>
      </div>
    </div>
  );
};

export default Card;
