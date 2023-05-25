import React, { useState } from "react";
import Form from "./form";

// Styles for List component
const style = {
  container: "flex flex-col items-center justify-center w-full",
  title: "text-4xl font-bold text-center text-white",
  carWrapper: "mt-8",
  car: "animate-bounce w-16 h-16 text-white",
  text: "mt-4 mb-5 text-white text-2xl text-center",
  textLogo: "text-white text-2xl",
};

const List = () => {
  return (
    <div className={style.container}>
      <h1 className={style.title}>List for sale</h1>
      <Form />
    </div>
  );
};

export default List;
