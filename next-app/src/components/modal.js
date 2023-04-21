import React from "react";
import ImageSlider from "../components/slider";

const styles = {
  modal:
    "fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[2]",
  spanDiv: "",
  headerText: "text-4xl font-bold",
  modalContent: "w-1/2 h-3/4 bg-white text-black rounded-lg object-contain overflow-auto",
  contentContainer: "items-center justify-center object-contain w-1/2 m-auto",
  imageContainer: "flex items-center min-h-[16rem] max-h-[16rem]",
  image: "max-h-[16rem] m-auto object-contain w-100",
  textContainer: "text-black flex p-1",
  descriptionContainer: "justify-center text-black flex p-1",
  textItemsBigText: "p-1 pl-4 pr-2 text-2xl",
  borderLeft: "p-1 pl-2 text-2xl border-l border-gray-400",

};

function Modal(props) {
  let data = props.card;

  let stringPrice = parseFloat(data.attributes.price);
  stringPrice = stringPrice.toLocaleString();

  let milage = parseInt(data.attributes.mileage, "10");
  milage = Math.ceil(milage / 1000);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.spanContainer}>
          <span className="close" onClick={props.onClose}>
            &times;
          </span>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h2 className={styles.headerText}>
              {data.attributes.year} {data.attributes.manufacturer}{" "}
              {data.attributes.model}
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
            <p>{data.attributes.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
