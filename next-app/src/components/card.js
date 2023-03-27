import React from "react";

const styles = {
  card: "bg-white rounded-lg overflow-hidden flex flex-col m-1",
  imageContainer: "h-96 overflow-hidden",
};

const Card = () => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        Test
      </div>
    </div>
  );
};

export default Card;