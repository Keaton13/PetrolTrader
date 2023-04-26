import React from "react";
import ImageSlider from "../components/slider";

const styles = {
  modal:
    "fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[2]",
  spanDiv: "p-5",
  headerText: "text-4xl font-bold",
  modalContent:
    "w-1/2 h-3/4 overflow-auto bg-white text-black rounded-lg object-contain overflow-auto",
  contentContainer: "items-center justify-center object-contain w-1/2 m-auto",
  imageContainer: "flex items-center min-h-[16rem] max-h-[16rem]",
  image: "max-h-[16rem] m-auto object-contain w-100",
  textContainer: "text-black flex p-1",
  descriptionContainer: "justify-center text-black w-3/4 m-auto flex p-5",
  textItemsBigText: "p-1 pl-4 pr-2 text-2xl",
  borderLeft: "p-1 pl-2 text-2xl border-l border-gray-400",
  infoContainer: "flex m-auto justify-center text-center",
  infoItems: "flex-col w-auto p-5",
  buttonContainer: "flex-col p-[3rem] w-3/4 text-center items-center m-auto p-5"
};

function Modal(props) {
  let data = props.card.attributes;
  console.log(data);
  let stringPrice = parseFloat(data.price);
  stringPrice = stringPrice.toLocaleString();

  let milage = parseInt(data.mileage, "10");
  milage = Math.ceil(milage / 1000);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.spanDiv}>
          <span className="close p-5" onClick={props.onClose}>
            &times;
          </span>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h2 className={styles.headerText}>
              {data.year} {data.manufacturer} {data.model}
            </h2>
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.textItemsBigText}>${stringPrice}</h2>
            <h2 className={styles.borderLeft}>{milage}K mi</h2>
          </div>
        </div>
        <div className="pt-5">
          <ImageSlider images={props.card.images} />
        </div>
        <div className={styles.descriptionContainer}>
          <p>{data.description}</p>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoItems}>
            <p>VIN: </p>
            <h2>{data.vin}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Title: </p>
            <h2>{data.titleStatus}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Drive: </p>
            <h2>{data.drive}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Transmission: </p>
            <h2>{data.transmission}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Cylinders: </p>
            <h2>{data.cylinders}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Fuel: </p>
            <h2>{data.fuel}</h2>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoItems}>
            <p>Odometer: </p>
            <h2>{data.mileage} miles</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Type: </p>
            <h2>{data.type}</h2>
          </div>
          <div className={styles.infoItems}>
            <p>Location: </p>
            <h2>{data.city}, {data.state}</h2>
          </div>
        </div>
        <div className={styles.buttonContainer}>
                {props.button}
          </div>
      </div>
    </div>
  );
}

export default Modal;
