import React from "react";

const style = {
  container: {
    margin: "0 auto",
    maxWidth: "85%",
    padding: "0 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "24px",
  },
  title: "text-4xl font-bold text-center text-white",
  carWrapper: "mt-8",
  car: "animate-bounce w-16 h-16 text-white",
  text: "mt-4 mb-5 text-white text-2xl text-center",
  textLogo: "text-white text-2xl",
  card: "bg-white rounded-lg shadow-lg p-6",
};

const buy = () => {
  return (
    <div className={style.container}>
      <h1 className={style.title}>Marketplace</h1>
      <div className={style.container}>
        <div className={style.grid}>
          
        </div>
      </div>
    </div>
  );
};

export default buy;
