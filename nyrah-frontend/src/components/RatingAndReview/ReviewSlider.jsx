import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosStar } from "react-icons/io";

function ReviewSlider({ reviews }) {
  
  return (
    <Swiper
      slidesPerView={1}
      breakpoints={{
        580: {slidesPerView: 2},
        1024: { slidesPerView: 3},
        1400: {slidesPerView: 4}
      }}
      centeredSlides={true}
      spaceBetween={30}
      grabCursor={true}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {reviews?.map((r, i) => (
        <SwiperSlide className=" text-white py-5">
          <div className="flex min-h-[200px] w-full bg-black shadow-md flex-col rounded-xl justify-start p-3 space-y-2">
            <p className="text-start">{r.user.name}</p>
            <div className="flex justify-start ">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <IoIosStar
                    key={i}
                    size={14}
                    className="cursor-pointer transition-colors"
                    color={
                      value <= (r.rating)
                        ? "#facc15"
                        : "#e5e7eb"
                    }
                  />
                );
              })}
            </div>
            <p className="text-start font-poppins text-sm tracking-wide">{r.review}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ReviewSlider;
