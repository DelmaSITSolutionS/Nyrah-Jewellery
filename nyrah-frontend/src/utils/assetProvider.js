import optimizedImage from "./optimizedImage";

const assetProvider = {
  banner: {
    aboutUsBanner: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754543896/about-us-banner_rolrb4.jpg",
      1920,
      "auto:best"
    ),
    contactUsBanner: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754543897/contact-us-banner_pld8eu.jpg",
      1920,
      "auto:best"
    ),
    shopBanner: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754745755/shop-bannerr_dkycym.jpg",
      1920,
      "auto:best"
    ),
  },
  about: {
    aboutUs: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754552701/about-us_b20fpi.jpg",
      1000,
      "auto:best"
    ),
    whatWeDo: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754552702/what-we-do_yue9bi.jpg",
      1000,
      "auto:best"
    ),
    ourCommitment: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754552702/our-commitement_qwwxhn.jpg",
      1000,
      "auto:best"
    ),
  },
  carousel: {
    c1: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754742654/c2_bwcdwr.jpg",
      1920,
      "auto:best"
    ),
    c2: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754742655/c1_z3eudp.jpg",
      1920,
      "auto:best"
    ),
  },
  hero: {
    stackBanner: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754743017/stack-banner_uiobto.jpg",
      1000,
      "auto:best"
    ),
    instaBanner: optimizedImage(
      "https://res.cloudinary.com/dgte9qbce/image/upload/v1754743016/insta-banner_nawtxp.jpg",
      1000,
      "auto:best"
    ),
  },
};

export default assetProvider;
