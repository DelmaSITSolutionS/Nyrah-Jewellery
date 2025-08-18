import React from "react";
import "./Swiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import ProductCard from "../ProductCard"; // adjust path if needed

function SwiperCard({ products = [],slidesPerView }) {
  
  if (!products.length) return null;

  return (
    <Swiper
      slidesPerView={2}
      breakpoints={{
        540: { slidesPerView: 2 },
        1024: {slidesPerView: 3},
        1440: { slidesPerView: slidesPerView },
      }}
      spaceBetween={30}
      navigation={true}
      style={{ "--swiper-navigation-size": "15px" }}
      modules={[Navigation]}
      className="mySwiper"
    >
      {products.map((product) => (
        <SwiperSlide key={product._id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperCard;
