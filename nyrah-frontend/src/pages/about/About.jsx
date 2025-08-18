import assetProvider from "../../utils/assetProvider";
import { AnimatePresence, motion } from "motion/react";

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.2, // delay between children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function About() {
  return (
    <div className="about-sec space-y-8 sm:space-y-16 px-[1rem] sm:px-[3rem]">
      {/* <!-- About us banner --> */}
      <div
        className="relative w-full h-[250px] md:h-[350px] lg:h-[350px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${assetProvider.banner.aboutUsBanner})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40  flex items-end justify-center ">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-center text-white max-w-lg mb-16"
          >
            <motion.h2
              variants={childVariants}
              className="text-3xl sm:text-5xl text-center font-noto-serif-display font-bold uppercase tracking-widest"
            >
              About us
            </motion.h2>
          </motion.div>
        </div>
      </div>

      {/* <!-- About us text --> */}
      <div className=" text-justify sm:text-center sm:px-[3rem] xl:px-[9rem] space-y-7">
        <div>
          <p className="font-poppins text-sm sm:text-[.94rem]  font-[500] tracking-wider ">
            Welcome to Nyrah, where artistry meets precision in the world of
            jewelry manufacturing. With a rich heritage of craftsmanship and a
            passion for creating timeless pieces, we specialize in designing and
            producing exquisite jewelry that captivates and inspires.
          </p>
        </div>
        <div className="text-sm sm:text-[.94rem] font-poppins  tracking-wider">
          <p>
            To shewing another demands to. Marianne property cheerful informed
            at striking at. Clothes parlors however by cottage on. In views it
            or meant drift to. Be concern parlors settled or do shyness address.
            Remainder northward performed out for moonlight. Yet late add name
            was rent park from rich.
          </p>
        </div>
      </div>

      {/* <!-- our story section --> */}

      <div className="flex flex-col md:flex-row gap-5 lg:gap-10 w-full">
        <div className="md:w-1/2">
          <img
            src={assetProvider.about.aboutUs}
            className="w-full h-auto object-cover aspect-square"
            alt="our-story"
          />
        </div>
        <div className="md:w-1/2">
          <div className="font-poppins space-y-7 lg:space-y-4 xl:space-y-8 text-justify">
            <h1 className="font-cardo capitalize text-lg lg:text-3xl font-[500]">
              Our Story
            </h1>
            <p
              className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider "
              style={{ color: "black", fontWeight: "500" }}
            >
              At NyraH Jewelry, we believe that jewelry is more than just an
              accessory-it's an expression of individuality and a reflection of
              life's most precious moments. Join us in celebrating life's
              milestones with a piece that will last for generations.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider">
              Founded in 2005, NyraH Jewelry has grown from a small workshop
              into a globally recognized jewelry manufacturer. Our journey began
              with a commitment to quality, innovation, and attention to detail,
              values that continue to drive us today.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider">
              Over the years, we have built a reputation for delivering
              exceptional jewelry that reflects both tradition and modernity.
            </p>
          </div>
        </div>
      </div>

      {/* <!-- Whar we do section --> */}
      <div className="flex flex-col-reverse md:flex-row gap-5 lg:gap-10 w-full">
        <div className="md:w-1/2">
          <div className="font-poppins space-y-4 lg:space-y-4 xl:space-y-8 text-justify">
            <h1 className="font-cardo text-lg lg:text-3xl font-[500] capitalize">what we do</h1>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              We are a full-service jewelry manufacturing company, offering
              end-to-end solutions from concept to creation. Our expertise
              spans:
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Custom Jewelry Design:
              </strong>{" "}
              Collaborate with us to bring your unique vision to life.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Production:{" "}
              </strong>{" "}
              State-of-the-art facilities and skilled artisans ensure precision
              and quality in every piece.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Materials:{" "}
              </strong>{" "}
              We work with the finest metals, gemstones, and diamonds, sourced
              responsibly.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Finishing:{" "}
              </strong>{" "}
              Meticulous polishing, plating, and quality control to ensure
              perfection.
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
           <img
            src={assetProvider.about.whatWeDo}
            className="w-full h-auto object-cover aspect-square"
            alt="our-story"
          />
        </div>
      </div>

      {/* <!-- Our commitment section --> */}
      <div className="flex flex-col md:flex-row gap-5 lg:gap-10 w-full">
        <div className="md:w-1/2">
           <img
            src={assetProvider.about.ourCommitment}
            className="w-full h-auto object-cover aspect-square"
            alt="our-story"
          />
        </div>
        <div className="md:w-1/2">
          <div className="font-poppins space-y-7 lg:space-y-4 xl:space-y-8 text-justify">
            <h1 className="font-cardo text-lg lg:text-3xl font-[500] capitalize">Our Commitment</h1>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              At NyraH, we believe jewelry is more than an accessory-it's a
              symbol of love, celebration, and individuality. That's why we are
              dedicated to:
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                {" "}
                Sustainability:{" "}
              </strong>{" "}
              Ethical sourcing and eco-friendly practices.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Innovation:{" "}
              </strong>{" "}
              Cutting-edge technology combined with traditional craftsmanship.
            </p>
            <p className="text-sm md:text-[.8rem] lg:text-[1rem] tracking-wider ">
              <strong style={{ color: "black", fontWeight: "600" }}>
                Customer Satisfaction:{" "}
              </strong>{" "}
              Personalized service and unwavering attention to detail ..
            </p>
          </div>
        </div>
      </div>

      {/* <!-- Why choose us section --> */}
      <div className="space-y-7">
        <div className="text-center uppercase font-noto-serif-display text-4xl">
          <p>why choose us?</p>
        </div>
        <div className=" text-justify sm:text-center sm:px-[3rem] xl:px-[9rem] ">
          <p className="font-poppins text-sm sm:text-[.94rem] text-[#4A4A4A]  font-[500] tracking-wider ">
            Whether you're a retailer, designer, or individual seeking a custom
            piece, NyraH Jewelry is your trusted partner in jewelry
            manufacturing. Let us help you create something extraordinary.
            Discover the art of fine jewelry with us. Nyrah - Crafting Beauty,
            One Piece at a Time.
          </p>
        </div>

        <div className="grid grid-cols sm:grid-cols-2 lg:grid-cols-4 gap-10 my-10">
          <div className="flex flex-col shadow-xl py-4 space-y-3 justify-center items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#C19A6B"
            >
              <path
                d="M22.4268 2.66675H9.57342C6.73342 2.66675 4.42676 4.98675 4.42676 7.81341V26.6001C4.42676 29.0001 6.14676 30.0134 8.25342 28.8534L14.7601 25.2401C15.4534 24.8534 16.5734 24.8534 17.2534 25.2401L23.7601 28.8534C25.8668 30.0267 27.5868 29.0134 27.5868 26.6001V7.81341C27.5734 4.98675 25.2668 2.66675 22.4268 2.66675Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.7866 14.6666L14.7866 16.6666L20.12 11.3333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="font-cardo font-semibold">EXPERIENCE</h3>
            <p className="text-center font-poppins">
              Decades of experience in the
              <br /> jewelry industry.
            </p>
          </div>

          <div className="flex flex-col shadow-xl py-4 space-y-3 justify-center items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#C19A6B"
            >
              <path
                d="M12.2134 14.4934C12.0801 14.4801 11.9201 14.4801 11.7734 14.4934C8.60008 14.3867 6.08008 11.7867 6.08008 8.58675C6.08008 5.32008 8.72008 2.66675 12.0001 2.66675C15.2667 2.66675 17.9201 5.32008 17.9201 8.58675C17.9067 11.7867 15.3867 14.3867 12.2134 14.4934Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.8801 5.33325C24.4668 5.33325 26.5468 7.42659 26.5468 9.99992C26.5468 12.5199 24.5468 14.5733 22.0535 14.6666C21.9468 14.6533 21.8268 14.6533 21.7068 14.6666"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.54671 19.4133C2.32004 21.5733 2.32004 25.0933 5.54671 27.2399C9.21338 29.6933 15.2267 29.6933 18.8934 27.2399C22.12 25.0799 22.12 21.5599 18.8934 19.4133C15.24 16.9733 9.22671 16.9733 5.54671 19.4133Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.4534 26.6667C25.4134 26.4667 26.32 26.0801 27.0667 25.5067C29.1467 23.9467 29.1467 21.3734 27.0667 19.8134C26.3334 19.2534 25.44 18.8801 24.4934 18.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="font-cardo font-semibold">PROFESSIONAL TEAM</h3>
            <p className="text-center font-poppins">
              A team of passionate designers,
              <br /> artisans, and gemologists.
            </p>
          </div>

          <div className="flex flex-col shadow-xl py-4 space-y-3 justify-center items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#C19A6B"
            >
              <path
                d="M16.8267 27.7466C16.3734 27.9066 15.6267 27.9066 15.1734 27.7466C11.3067 26.4266 2.66675 20.92 2.66675 11.5866C2.66675 7.46663 5.98675 4.1333 10.0801 4.1333C12.5067 4.1333 14.6534 5.30663 16.0001 7.11997C17.3467 5.30663 19.5067 4.1333 21.9201 4.1333C26.0134 4.1333 29.3334 7.46663 29.3334 11.5866C29.3334 20.92 20.6934 26.4266 16.8267 27.7466Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h3 className="font-cardo font-semibold">MADE WITH LOVE</h3>
            <p className="text-center font-poppins">
              Competitive pricing without
              <br /> compromising on quality.
            </p>
          </div>

          <div className="flex flex-col shadow-xl py-4 space-y-3 justify-center items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#C19A6B"
            >
              <path
                d="M16 18.6667H17.3333C18.8 18.6667 20 17.4667 20 16.0001V2.66675H8C6 2.66675 4.25335 3.7734 3.34668 5.40007"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.6665 22.6667C2.6665 24.8801 4.45317 26.6667 6.6665 26.6667H7.99984C7.99984 25.2001 9.19984 24.0001 10.6665 24.0001C12.1332 24.0001 13.3332 25.2001 13.3332 26.6667H18.6665C18.6665 25.2001 19.8665 24.0001 21.3332 24.0001C22.7998 24.0001 23.9998 25.2001 23.9998 26.6667H25.3332C27.5465 26.6667 29.3332 24.8801 29.3332 22.6667V18.6667H25.3332C24.5998 18.6667 23.9998 18.0667 23.9998 17.3334V13.3334C23.9998 12.6001 24.5998 12.0001 25.3332 12.0001H27.0531L24.7732 8.01343C24.2932 7.18676 23.4132 6.66675 22.4532 6.66675H19.9998V16.0001C19.9998 17.4667 18.7998 18.6667 17.3332 18.6667H15.9998"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 29.3333C12.1394 29.3333 13.3333 28.1394 13.3333 26.6667C13.3333 25.1939 12.1394 24 10.6667 24C9.19391 24 8 25.1939 8 26.6667C8 28.1394 9.19391 29.3333 10.6667 29.3333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.3332 29.3333C22.8059 29.3333 23.9998 28.1394 23.9998 26.6667C23.9998 25.1939 22.8059 24 21.3332 24C19.8604 24 18.6665 25.1939 18.6665 26.6667C18.6665 28.1394 19.8604 29.3333 21.3332 29.3333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M29.3333 16V18.6667H25.3333C24.6 18.6667 24 18.0667 24 17.3333V13.3333C24 12.6 24.6 12 25.3333 12H27.0533L29.3333 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.6665 10.6667H10.6665"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.6665 14.6667H7.99984"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.6665 18.6667H5.33317"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="font-cardo font-semibold">ON TIME DELIVERY</h3>
            <p className="text-center font-poppins">
              A commitment to delivering on
              <br /> time, every time.
            </p>
          </div>
        </div>
      </div>
      <div className="sm:flex flex-col items-center pb-10 px-[1rem] sm:px-[4rem] text-center">
        <h2 className="text-4xl pb-4 uppercase font-noto-serif-display tracking-wider">
          Contact us
        </h2>
        <p>
          <span className="font-semibold">Contact No : </span>+1 732-800-8804
        </p>
        <p>
          <span className="font-semibold">Branch Address : </span>1229 Browning
          Ct, Lansdale, PA , USA
        </p>
        <p>
          <span className="font-semibold">Branch Address : </span>Unit 6 53
          Pumpkin Corner Crescent L9J 0T7 , CANADA
        </p>
      </div>
    </div>
  );
}

export default About;
