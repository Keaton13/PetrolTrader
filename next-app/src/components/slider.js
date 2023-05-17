import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = (props) => {
    const images = props.images;

    // Styles for loading component
    const styles = {
        image: "m-auto h-auto object-contain w-full rounded-t-lg",
        imageContainer: "flex items-center",
    }

  // Settings for Slider. Check React Slick Docs for more info
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
    };
    
    return (
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image} className={styles.imageContainer}>
            <img src={image} className={styles.image} alt="Slider Image" />
          </div>
        ))}
      </Slider>
    );
  }

export default ImageSlider;
