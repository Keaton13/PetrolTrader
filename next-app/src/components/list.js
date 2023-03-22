import React from 'react'

const style = {
    container: "flex flex-col items-center justify-center",
    title: "text-4xl font-bold text-center text-white",
    carWrapper: "mt-8",
    car: "animate-bounce w-16 h-16 text-white",
    text: "mt-4 mb-5 text-white text-2xl text-center",
    textLogo: "text-white text-2xl",
  };

const List = () => {
  return (
    <div className={style.container}>
    <h1 className={style.title}>Welcome to Petrol trader</h1>
    <div className={style.carWrapper}>
      <div className={style.car}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M3 9H6V19H3V9Z" fill="currentColor" />
          <path
            d="M6 9H15L17 6H21V9H20V18C20 18.2652 19.8946 18.5196 19.7071 18.7071C19.5196 18.8946 19.2652 19 19 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18V9H6ZM16.5 9H6.826L5.5 11.5H19V10C19 9.73478 18.8946 9.48043 18.7071 9.29289C18.5196 9.10536 18.2652 9 18 9H16.5ZM7.5 12C6.67157 12 6 12.6716 6 13.5C6 14.3284 6.67157 15 7.5 15C8.32843 15 9 14.3284 9 13.5C9 12.6716 8.32843 12 7.5 12ZM16.5 12C15.6716 12 15 12.6716 15 13.5C15 14.3284 15.6716 15 16.5 15C17.3284 15 18 14.3284 18 13.5C18 12.6716 17.3284 12 16.5 12Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </div>
  )
}

export default List