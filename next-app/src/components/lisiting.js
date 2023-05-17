import React from "react";
import { useAppContext } from "../context/context";
import ImageSlider from "../components/slider";

// Styles for listing component
const styles = {
  container: "max-w-sm mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl",
  header:
    "mt-5 md:mt-10 text-center text-4xl md:text-5xl font-extrabold p-1 pl-4 pr-2 text-2xl",
  headerBorderLeft:
    "mt-5 md:mt-10 text-center text-4xl md:text-5xl font-extrabold p-1 pl-4 pr-2 text-2xl border-l border-gray-400",
  subHeader: "mt-5 md:mt-10 text-center text-2xl md:text-3xl font-medium",
  imageContainer: "mt-10 md:mt-16 flex justify-center",
  image: "max-w-full h-auto",
  textContainer: "mt-5 md:mt-10 text-center mx-auto",
  text: "text-xl md:text-2xl leading-8 font-light text-gray-500",
  detailsContainer:
    "mt-10 md:mt-16 flex flex-wrap sm:flex-nowrap justify-center",
  detailsCol: "w-full sm:w-1/2 text-center",
  detailsHeader: "text-lg md:text-xl font-medium mb-2 text-gray-500",
  detailsValue: "text-xl md:text-2xl font-semibold mb-4",
};

const lisiting = () => {
  // Using the App Context to access button and card
  const { button, card } = useAppContext();

  // Setting card attributes to data variable
  let data = card.attributes;

  // Converting and rounding milage
  let milage = parseInt(data.mileage, "10");
  milage = Math.ceil(milage / 1000);

  // Converting price to readable string
  let stringPrice = parseFloat(data.price);
  stringPrice = stringPrice.toLocaleString();

  return (
    <div className={styles.container}>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <h1 className={styles.header}>
          {data.year} {data.manufacturer} {data.model}
        </h1>
        <h1 className={styles.headerBorderLeft}>{milage}K mi</h1>
      </div>
      <div className="pt-5">
        <ImageSlider images={card.images} />
        {/* <img src="https://via.placeholder.com/800x400" alt="placeholder" className={styles.image} /> */}
      </div>
      <div className={styles.textContainer}>
        <p className={styles.text}>{data.description}</p>
      </div>
      <div className={styles.detailsContainer}>{button}</div>
      <div className={styles.detailsContainer}>
        <div className={styles.detailsCol}>
          <h2 className={styles.detailsHeader}>Vin</h2>
          <p className={styles.detailsValue}>{data.vin}</p>
          <h2 className={styles.detailsHeader}>Title</h2>
          <p className={styles.detailsValue}>{data.titleStatus}</p>
          <h2 className={styles.detailsHeader}>Drive</h2>
          <p className={styles.detailsValue}>{data.titleStatus}</p>
          <h2 className={styles.detailsHeader}>Transmission</h2>
          <p className={styles.detailsValue}>{data.transmission}</p>
        </div>
        <div className={styles.detailsCol}>
          <h2 className={styles.detailsHeader}>Cylinders</h2>
          <p className={styles.detailsValue}>{data.cylinders}</p>
          <h2 className={styles.detailsHeader}>Fuel</h2>
          <p className={styles.detailsValue}>{data.fuel}</p>
          <h2 className={styles.detailsHeader}>Odometer</h2>
          <p className={styles.detailsValue}>{data.mileage} K mi</p>
          <h2 className={styles.detailsHeader}>Location</h2>
          <p className={styles.detailsValue}>
            {data.city}, {data.state}
          </p>
        </div>
      </div>
    </div>
  );
};

export default lisiting;
