import React from "react";

const styles = {
  card: "bg-white rounded-lg overflow-hidden flex flex-col m-1",
  imageContainer: "h-96 overflow-hidden",
  textContainer: "text-black flex",
  textItems: "p-1",
};

const Card = (props) => {
  console.log(props.card);
  let card = props.card;
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
      </div>
    </div>
  );
};

export default Card;
