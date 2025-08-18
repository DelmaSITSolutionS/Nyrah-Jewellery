import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import assetProvider from "../../utils/assetProvider.js";
import "./Home.css";

// banners
import b1 from "../../assets/banners/b1.png";
import b2 from "../../assets/banners/b2.png";
import b3 from "../../assets/banners/b3.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import SwiperCard from "../../components/Swiper/SwiperCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useDispatch, useSelector } from "react-redux";
import { getProductsByMain } from "../../redux/apis/productApi";
import ProductCard from "../../components/ProductCard";
import { getAllInstaPosts } from "../../redux/apis/instaPostApi";

import { FaInstagram } from "react-icons/fa";
import { getAllDiscountBanners } from "../../redux/apis/discountBannerApi.js";

function Home() {
  const [trendySwiper, setTrendySwiper] = useState(false);
  const [instaSwiper, setInstaSwiper] = useState(false);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loadingTopRated, setLoadingTopRated] = useState(true);

  const [limitedEdition, setLimitedEdition] = useState([]);
  const [loadingLimited, setLoadingLimited] = useState(true);

  const { categories } = useSelector((state) => state.category);
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.main || "ring"
  );

  const dispatch = useDispatch();
  const { list: products } = useSelector((state) => state.product);
  const { posts } = useSelector((state) => state.instapost);
  const { banners } = useSelector((state) => state.discountBanner);

  useEffect(() => {
    const fetchLimitedEdition = async () => {
      try {
        const { data } = await axios.get("/low-stock");
        setLimitedEdition(data.products);
      } catch (error) {
        console.error("Failed to load Limited Editions products:", error);
      } finally {
        setLoadingLimited(false);
      }
    };

    const fetchTopRated = async () => {
      try {
        const { data } = await axios.get("/top-rated");
        setTopRatedProducts(data.products);
      } catch (error) {
        console.error("Failed to load top rated products:", error);
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchTopRated();
    fetchLimitedEdition();
    dispatch(getAllInstaPosts());
    dispatch(getAllDiscountBanners())
  }, []);

  useEffect(() => {
    dispatch(getProductsByMain({ mainCategory: selectedCategory }));
  }, [dispatch, selectedCategory]);

  

  return (
    <section>
      <div className="carousel-sections">
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          navigation={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          style={{ "--swiper-navigation-size": "15px" }}
          modules={[EffectFade, Navigation, Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={assetProvider.carousel.c1} />
            <div className="carousel-text">
              <p>Elegance, Reimagined in Every Detail</p>
              <a href="/shop">
                SHOP NOW
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.31528 12H21.192"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img src={assetProvider.carousel.c2} className="brightness-80" />
            <div className="carousel-text">
              <p>Discover the Brilliance of Nyrah Diamonds</p>
              <a href="/material/silver">
                EXPLORE MORE
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.31528 12H21.192"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="textline-part">
        <div className="first-textline">
          <p>where timeless design meets responsible luxury.</p>
        </div>
        <div className="seco-textline">
          <p>
            At Nyrah Jewels, we strive to offer a uniquely exquisite collection
            of engagement rings and everyday jewelry, with
            <br />
            sustainability at the heart of everything we do.
          </p>
        </div>
        <div className="third-textline">
          <p>
            Hand-crafted by our skilled artisans in local studios, blending
            timeless beauty with conscious craftsmanship
          </p>
        </div>
      </div>

      <div className="trendy-part">
        <div className="first-box">
          <div className="t-big-text">
            <p>
              TRENDY
              <br />
              COLLECTIONS
            </p>
          </div>
          <div className="t-small-text">
            <a href="/shop">
              SHOP NOW
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.31528 12H21.192"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <div className="second-box">
          <div className="second-inne w-full">
            <SwiperCard products={topRatedProducts} slidesPerView={3} />
          </div>
        </div>
      </div>

      <div className="home-banner-part">
        <div className="offer-swiper">
          <Swiper
            slidesPerView={1}
            breakpoints={{
              540: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            // centeredSlides={true}
            spaceBetween={30}
            grabCursor={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {banners.map((banner, i) => (
              <SwiperSlide key={banner?._id}>
                <a href={banner?.title} className="offer-card">
                  <img
                    src={banner?.image}
                    className="offer-img aspect-square"
                    alt="offer-banner"
                  />
                </a>
              </SwiperSlide>
            ))}

            {/* <SwiperSlide>
              <div className="offer-card">
                <img
                  src={b2}
                  className="offer-img aspect-square"
                  alt="offer-banner"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="offer-card">
                <img
                  src={b3}
                  className="offer-img aspect-square"
                  alt="offer-banner"
                />
              </div>
            </SwiperSlide> */}
          </Swiper>
        </div>
      </div>

      <div className="our-stacks-section">
        <div className="img-container">
          <img
            src={assetProvider.hero.stackBanner}
            className="stacks-img aspect-square"
            alt=""
          />
          <button onClick={() => setTrendySwiper((prev) => !prev)}>
            VIEW STACKS
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.31528 12H21.192"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="stacks-scroll">
          <h1>LIMITED EDITIONS</h1>
          {limitedEdition.map((s, i) => (
            <div key={i} className="big-card">
              <ProductCard product={s} />
            </div>
          ))}
        </div>
        <div
          className={`${
            trendySwiper ? "trendy-swiper-on" : "trendy-swiper-off"
          }`}
        >
          <svg
            className="pb-1 absolute top-5 right-5"
            onClick={() => setTrendySwiper(false)}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <SwiperCard products={limitedEdition} />
        </div>
      </div>

      <div className="sparkle-session">
        <div className="sparkle-text">
          <p>WHAT'S YOUR SPARKLE?</p>
        </div>

        <div className="sparkle-elements">
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  className={selectedCategory === cat.main ? "active" : ""}
                  onClick={() => setSelectedCategory(cat.main)}
                >
                  {cat.main.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <select
          id="sparkle-cat"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option value={cat.main} key={cat._id}>
              {cat.main}
            </option>
          ))}
        </select>
      </div>

      <div className="sparkle-card-sec">
        <SwiperCard products={products} slidesPerView={4} />
      </div>

      <div className="our-stacks-section">
        <div className="insta-scroll">
          <h1>FOLLOW OUR INSTA</h1>
          {posts ? (
            posts.map((post, i) => (
              <div key={i + 1} className="big-card relative">
                <img src={post?.post} alt={`post-${i + 1}`} />
                <a
                  href={post?.url}
                  target="_blank"
                  className="absolute opacity-0 hover:opacity-60 transition-opacity ease-in-out duration-200 top-0 left-0 w-full h-full bg-black flex items-center justify-center"
                >
                  <FaInstagram className="text-white text-3xl" />
                </a>
              </div>
            ))
          ) : (
            <div>No Post</div>
          )}
        </div>
        <div className="img-container">
          <img
            src={assetProvider.hero.instaBanner}
            className="stacks-img aspect-square object-cover"
            alt="instaPosts"
          />
          <button onClick={() => setInstaSwiper((prev) => !prev)}>
            VIEW INSTA
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.31528 12H21.192"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            instaSwiper ? "trendy-swiper-on" : "trendy-swiper-off"
          }`}
        >
          <svg
            className="pb-1 absolute top-5 right-5"
            onClick={() => setInstaSwiper(false)}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Swiper
            slidesPerView={2}
            breakpoints={{
              540: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            spaceBetween={30}
            navigation={true}
            style={{ "--swiper-navigation-size": "15px" }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {posts.map((post, i) => (
              <SwiperSlide key={i + 1}>
                <div className="aspect-square w-full bg-base-100 relative overflow-hidden">
                  {/* Main image (below) */}
                  <img
                    loading="lazy"
                    src={post?.post}
                    alt={name}
                    className={`w-full h-full object-cover`}
                  />
                  <a
                    href={post?.url}
                    target="_blank"
                    className="absolute opacity-0 hover:opacity-60 transition-opacity ease-in-out duration-200 top-0 left-0 w-full h-full bg-black flex items-center justify-center"
                  >
                    <FaInstagram className="text-white text-3xl" />
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Home;
