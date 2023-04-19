import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = (props) => {
    console.log(props);

    const images = props.images;

    const style = {
        image: "max-h-[16rem] m-auto",
        imageContainer: "flex items-center min-h-[16rem] max-h-[16rem]",
    }

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image} className={style.imageContainer}>
            <img src={image} className={style.image} alt="Slider Image" />
          </div>
        ))}
      </Slider>
    );
  }

export default ImageSlider;
