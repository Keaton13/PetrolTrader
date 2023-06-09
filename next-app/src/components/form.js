import { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import Loading from "./loading";

// Initialize once (at the start of your app).
const uploader = Uploader({ apiKey: process.env.UPLOADER }); // Your real API key.
const uploaderOptions = {
  multi: true,

  // Comment out this line & use 'onUpdate' instead of
  // 'onComplete' to have the dropzone close after upload.
  showFinishButton: true,

  styles: {
    colors: {
      primary: "#377dff",
    },
  },
};

// Styles for the form component
const style = {
  container: "flex flex-row items-center justify-center w-full",
  form: "lg:w-3/4 sm:w-full",
  formCol: "p-5 md:w-3/4", // add flex-1 and pr-2
  formRow: "flex flex-col md:flex-row w-full justify-center", // add flex and flex-wrap
  inputGroup: "pb-4",
  input: "w-100 h-8 rounded-lg bg-white text-black min-w-full",
  descriptionTextArea: "w-100 rounded-lg bg-white text-black min-w-full h-32",
  label: "mr-2 font-bold",
  buttonRow: "flex justify-center",
  button:
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-2/5",
};

export default function Form() {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [vin, setVin] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [titleStatus, setTitleStatus] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [drive, setDrive] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [imageModalStatus, setImageModalStatus] = useState(true);

  // Using the App Context to access uploadToIpfs and transactionModalResponse
  const { uploadToIpfs, transactionModalStatus } = useAppContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    // From data collected from the form below, converted to a string and sent to uploadToIpfs function
    if (images[0]) {
      const metaData = {
        images: images,
        attributes: {
          manufacturer,
          model,
          year,
          mileage,
          price,
          vin,
          description,
          city,
          state,
          titleStatus,
          cylinders,
          drive,
          fuel,
          transmission,
          type,
        },
      };

      const metaDataString = JSON.stringify(metaData);
      uploadToIpfs(metaDataString);
    } else {
      alert("Error need to publish image");
    }
  };

  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formRow}>
          <div className={style.formCol}>
            <div className={style.inputGroup}>
              <div>
                <label className={style.label} htmlFor="manufacturer">
                  Manufacturer:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  id="manufacturer"
                  className={style.input}
                  value={manufacturer}
                  onChange={(event) => setManufacturer(event.target.value)}
                  required
                  pattern="[a-zA-Z0-9\s,]*"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                <label className={style.label} htmlFor="model">
                  Model:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  id="model"
                  className={style.input}
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                <label className={style.label} htmlFor="Year">
                  Year:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  id="year"
                  className={style.input}
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  required
                  pattern="[a-zA-Z0-9\s,]*"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="mileage">
                  Mileage:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="mileage"
                  className={style.input}
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Vin Number">
                  Vin Number:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="Vin"
                  className={style.input}
                  value={vin}
                  onChange={(event) => setVin(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="City">
                  City:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="city"
                  className={style.input}
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="State">
                  State:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="state"
                  className={style.input}
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="price">
                  Price:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="price"
                  className={style.input}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Title">
                  Title Status:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="Title"
                  className={style.input}
                  value={titleStatus}
                  onChange={(event) => setTitleStatus(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
          </div>
          <div className={style.formCol}>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Upload">
                  Upload Pictures:
                </label>
              </div>
              <div>
                {imageModalStatus ? (
                  <UploadDropzone
                    uploader={uploader}
                    options={uploaderOptions}
                    onComplete={(files) => {
                      const imageUrls = files.map((file) => file.fileUrl); // Save fileUrls in an array
                      setImages(imageUrls); // Set the array to component state
                      setImageModalStatus(false);
                    }}
                    width="40rem"
                    height="16rem"
                  />
                ) : (
                  <div>
                    <h1>Upload Complete!</h1>
                  </div>
                )}
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Cylinders">
                  Cylinders:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="cylinders"
                  className={style.input}
                  value={cylinders}
                  onChange={(event) => setCylinders(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>{" "}
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Drive">
                  Drive:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="drive"
                  className={style.input}
                  value={drive}
                  onChange={(event) => setDrive(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>{" "}
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Fuel">
                  Fuel:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="fuel"
                  className={style.input}
                  value={fuel}
                  onChange={(event) => setFuel(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Transmission">
                  Transmission:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="transmission"
                  className={style.input}
                  value={transmission}
                  onChange={(event) => setTransmission(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="Type">
                  Type:
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="text"
                  id="type"
                  className={style.input}
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  required
                  step="any"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={style.formRow}>
          <div className={style.formCol}>
            <div className={style.inputGroup}>
              <div>
                <label className={style.label} htmlFor="description">
                  Description:
                </label>
              </div>
              <div>
                <textarea
                  id="description"
                  className={style.descriptionTextArea}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className={style.buttonRow}>
              <button type="submit" className={style.button}>
                Submit
              </button>{" "}
            </div>
          </div>
        </div>
      </form>
      {transactionModalStatus && (
        <Loading>
          <h2>Hello, World!</h2>
          <p>Minting NFT Please Hold</p>
        </Loading>
      )}
    </div>
  );
}
