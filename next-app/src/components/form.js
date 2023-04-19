import { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

// Initialize once (at the start of your app).
const uploader = Uploader({ apiKey: "public_kW15b8eFsgxw9yiamkzK9CfB8Adr" }); // Your real API key.
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

const style = {
  container: "flex flex-row items-center justify-center w-full",
  form: "w-3/4",
  formCol: "p-5 flex-col w-1/2 flex-1 pr-2", // add flex-1 and pr-2
  formRow: "flex flex-wrap w-full", // add flex and flex-wrap
  inputGroup: "pb-4",
  input: "w-100 h-8 rounded-lg bg-white text-black min-w-full",
  descriptionTextArea: "w-100 rounded-lg bg-white text-black min-w-full h-32",
  label: "mr-2 font-bold",
  buttonRow:"flex justify-center",
  button:
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
};

export default function Form() {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageModalStatus, setImageModalStatus] = useState(true);

  const { uploadToIpfs } = useAppContext();

  useEffect(() => {
    console.log(images);
  }, [images]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data, like submit to a server or update state
    if(images[0]) {
      const metaData = {
        images: images,
        attributes: {
          manufacturer,
          model,
          year,
          mileage,
          condition,
          price,
          description,
        },
      };
  
      const metaDataString = JSON.stringify(metaData);
      uploadToIpfs(metaDataString);
    } else {
      alert("Error need to publish image")
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
                  pattern="[a-zA-Z0-9\s,]*"
                />
              </div>
            </div>
            <div className={style.inputGroup}>
              <div>
                <label className={style.label} htmlFor="model">
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
                <label className={style.label} htmlFor="condition">
                  Condition (1-10):
                </label>
              </div>
              <div>
                {" "}
                <input
                  type="number"
                  id="condition"
                  className={style.input}
                  min="1"
                  max="10"
                  value={condition}
                  onChange={(event) => setCondition(event.target.value)}
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
          </div>
          <div className={style.formCol}>
            <div className={style.inputGroup}>
              <div>
                {" "}
                <label className={style.label} htmlFor="condition">
                  Upload Pictures:
                </label>
              </div>
              <div>
                {imageModalStatus ? (
                  <UploadDropzone
                    uploader={uploader}
                    options={uploaderOptions}
                    onUpdate={(files) =>
                      console.log(files.map((x) => x.fileUrl).join("\n"))
                    }
                    onComplete={(files) => {
                      const imageUrls = files.map((file) => file.fileUrl); // Save fileUrls in an array
                      setImages(imageUrls); // Set the array to component state
                      setImageModalStatus(false);
                    }}
                    width="600px"
                    height="375px"
                  />
                ) : (
                  <div>
                    <h1>Upload Complete!</h1>
                  </div>
                )}
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
    </div>
  );
}
