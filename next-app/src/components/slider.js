import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = (props) => {
    const images = props.images;

    const styles = {
        image: "m-auto m-h-100 object-contain w-100 rounded-t-lg max-h-[16rem]",
        imageContainer: "flex items-center",
    }

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true
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
