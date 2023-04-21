import React from "react";
import ImageSlider from "../components/slider";

const styles = {
  modal:
    "fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[2]",
  spanDiv: "",
  modalContent: "w-1/2 h-3/4 bg-white text-black rounded-lg",
  contentContainer: "items-center justify-center object-contain w-1/2 m-auto",
  imageContainer: "flex items-center min-h-[16rem] max-h-[16rem]",
  image: "max-h-[16rem] m-auto object-contain w-100",
  textContainer: "flex items-center justify-center",
};

function Modal(props) {
  let data = props.card;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.spanContainer}>
          <span className="close" onClick={props.onClose}>
            &times;
          </span>
        </div>
        <ImageSlider images={props.card.images} />
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h2 className={styles.textItems}>{data.attributes.year}</h2>
            <h2 className={styles.textItems}>{data.attributes.manufacturer}</h2>
            <h2 className={styles.textItems}>{data.attributes.model}</h2>
            <h2 className={styles.textItems}>${data.attributes.price}</h2>
          </div>
          <div className={styles.textContainer}>
            <p>{data.attributes.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
