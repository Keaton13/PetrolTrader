import { useState } from "react";

const style = {
  container: "flex flex-row items-center justify-center",
  inputGroup: "pb-4",
  input: "w-100 h-8 rounded-lg bg-white min-w-full",
  label: "mr-2 font-bold",
  button:
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
};

export default function Form() {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data, like submit to a server or update state
  };

  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit}>
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
            {" "}
            <label className={style.label} htmlFor="mileage">
              Mileage:
            </label>
          </div>
          <div>
            {" "}
            <input
              type="number"
              id="mileage"
              className={style.input}
              value={mileage}
              onChange={(event) => setMileage(event.target.value)}
              required
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
              type="number"
              id="price"
              className={style.input}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className={style.button}>
          Submit
        </button>{" "}
      </form>
    </div>
  );
}
