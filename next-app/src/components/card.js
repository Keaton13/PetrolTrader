import React from "react";

const style = {
  card: {
    background: "#F5F5F5",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    // boxShadow: "0 0 10px 5px white"
  },
  imageContainer: {
    height: "340px",
    overflow: "hidden",
  },
};

const card = () => {
  return (
    <div className={style.card}>
        <div className={style.imageContainer}>

        </div>
    </div>
  )
};

export default card;
