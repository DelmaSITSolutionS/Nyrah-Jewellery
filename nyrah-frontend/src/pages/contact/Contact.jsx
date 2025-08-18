import { useState } from "react";
import API from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import assetProvider from "../../utils/assetProvider";
import { motion } from "motion/react";

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

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = API.post("/contact", formData);

    toast.promise(promise, {
      pending: "Sending message...",
      success: "Message sent successfully!",
      error: "Failed to send message",
    });

    try {
      await promise;
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err); // already handled by toast.error
    }
  };
  return (
    <div className=" px-[1rem] md:px-[3rem] space-y-7">
      <div
        className="relative w-full h-[250px] md:h-[350px] lg:h-[350px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${assetProvider.banner.contactUsBanner})`,
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
              Contact Us
            </motion.h2>
          </motion.div>
        </div>
      </div>

      <div >
        <p className="tracking-wider  font-poppins text-center ">
          Click on your neares store location below to set the road on Google
          Map.
        </p>
      </div>

      <div className="h-90">
        <div className="h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.4766070575906!2d72.8499423!3d21.2114127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f2dd6f0c941%3A0xf79455a2e02e9399!2sNYRAH%20JEWELLERY!5e1!3m2!1sen!2sin!4v1754567137351!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="grid grid-cols sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="info-box flex flex-col shadow-xl  py-4 justify-center items-center gap-3">
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#C19A6B"
          >
            <path
              d="M17.4997 19.5854C20.0126 19.5854 22.0497 17.5482 22.0497 15.0354C22.0497 12.5225 20.0126 10.4854 17.4997 10.4854C14.9868 10.4854 12.9497 12.5225 12.9497 15.0354C12.9497 17.5482 14.9868 19.5854 17.4997 19.5854Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5.27931 12.3812C8.15223 -0.247954 26.8626 -0.23337 29.721 12.3958C31.3981 19.8041 26.7897 26.075 22.7501 29.9541C19.8189 32.7833 15.1814 32.7833 12.2356 29.9541C8.21056 26.075 3.60223 19.7895 5.27931 12.3812Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <h3 className="font-cardo font-semibold">OUR STORE</h3>
          <p className="text-center font-poppins text-sm">
            Heera-Panna Complex, 102, Varachha Main Rd, near diamond world, Mini
            Bazar, Varachha, Mini Bazar, Kodiyar Nagar, Surat, Gujarat 395006
          </p>
        </div>
        <div className="info-box flex flex-col shadow-xl  py-4 justify-center items-center gap-3">
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#C19A6B"
          >
            <path
              d="M32.0394 26.7312C32.0394 27.2562 31.9228 27.7958 31.6748 28.3208C31.4269 28.8458 31.1061 29.3416 30.6832 29.8083C29.9686 30.5958 29.1811 31.1645 28.2915 31.5291C27.4165 31.8937 26.4686 32.0833 25.4478 32.0833C23.9603 32.0833 22.3707 31.7333 20.6936 31.0187C19.0165 30.3041 17.3394 29.3416 15.6769 28.1312C13.9998 26.9062 12.4103 25.55 10.8936 24.0479C9.3915 22.5312 8.03525 20.9416 6.82484 19.2791C5.629 17.6166 4.6665 15.9541 3.9665 14.3062C3.2665 12.6437 2.9165 11.0541 2.9165 9.53746C2.9165 8.54579 3.0915 7.59788 3.4415 6.72288C3.7915 5.83329 4.34567 5.01663 5.11859 4.28746C6.05192 3.36871 7.07275 2.91663 8.15192 2.91663C8.56025 2.91663 8.96859 3.00413 9.33317 3.17913C9.71234 3.35413 10.0478 3.61663 10.3103 3.99579L13.6936 8.76454C13.9561 9.12913 14.1457 9.46454 14.2769 9.78538C14.4082 10.0916 14.4811 10.3979 14.4811 10.675C14.4811 11.025 14.379 11.375 14.1748 11.7104C13.9853 12.0458 13.7082 12.3958 13.3582 12.7458L12.2498 13.8979C12.0894 14.0583 12.0165 14.2479 12.0165 14.4812C12.0165 14.5979 12.0311 14.7 12.0603 14.8166C12.104 14.9333 12.1478 15.0208 12.1769 15.1083C12.4394 15.5895 12.8915 16.2166 13.5332 16.975C14.1894 17.7333 14.8894 18.5062 15.6478 19.2791C16.4353 20.052 17.1936 20.7666 17.9665 21.4229C18.7248 22.0645 19.3519 22.502 19.8478 22.7645C19.9207 22.7937 20.0082 22.8375 20.1103 22.8812C20.2269 22.925 20.3436 22.9395 20.4748 22.9395C20.7228 22.9395 20.9123 22.852 21.0728 22.6916L22.1811 21.5979C22.5457 21.2333 22.8957 20.9562 23.2311 20.7812C23.5665 20.577 23.9019 20.475 24.2665 20.475C24.5436 20.475 24.8353 20.5333 25.1561 20.6645C25.4769 20.7958 25.8123 20.9854 26.1769 21.2333L31.004 24.6604C31.3832 24.9229 31.6457 25.2291 31.8061 25.5937C31.9519 25.9583 32.0394 26.3229 32.0394 26.7312Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
            />
          </svg>
          <h3 className="font-cardo font-semibold">CONTACT INFO</h3>
          <p className="text-center font-poppins text-sm">
            Telephone: +91 97375 27178
            <br />
            E-mail: nyrahbyjhanvi@gmail.com
          </p>
        </div>
        <div className="info-box flex flex-col shadow-xl  py-4 justify-center items-center gap-3">
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#C19A6B"
          >
            <path
              d="M32.0832 17.5C32.0832 25.55 25.5498 32.0833 17.4998 32.0833C9.44984 32.0833 2.9165 25.55 2.9165 17.5C2.9165 9.44996 9.44984 2.91663 17.4998 2.91663C25.5498 2.91663 32.0832 9.44996 32.0832 17.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.9104 22.1374L18.3896 19.4395C17.6021 18.9729 16.9604 17.8499 16.9604 16.9312V10.952"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="font-cardo font-semibold">BUSINESS HOURS</h3>
          <p className="text-center font-poppins text-sm">
            Monday - Sunday:
            <br />
            09:00 am - 10.00 pm
          </p>
        </div>
      </div>

      <div className="py-10 sm:flex shadow-xl flex-col space-y-2 font-poppins text-sm text-center justify-center items-center px-[1rem] sm:px-[4rem]">
        <h2 className="text-4xl pb-4  text-center font-cardo tracking-wide">
          Foreign Address
        </h2>
        <p>
          <span className="font-semibold ">Contact No : </span>+1 732-800-8804
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

      <div className="flex flex-col justify-center items-center space-y-4 mb-10">
        <div className="text-center font-cardo text-lg">
          <h1>HAVE A QUESTION? CONTACT US!</h1>
        </div>

        <div className="w-full md:w-[50%]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                name="name"
                placeholder="NAME"
                required
                value={formData.name}
                autoComplete="true"
                onChange={handleChange}
                className="font-poppins placeholder:font-poppins text-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                required
                value={formData.email}
                autoComplete="true"
                onChange={handleChange}
                className="font-poppins placeholder:font-poppins text-sm"
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="subject"
                placeholder="SUBJECT"
                required
                value={formData.subject}
                onChange={handleChange}
                className="font-poppins placeholder:font-poppins text-sm"
              />
            </div>
            <div className="w-full">
              <textarea
                name="message"
                placeholder="WRITE YOUR COMMENT..."
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full font-poppins placeholder:font-poppins border border-zinc-300 p-3 text-sm min-h-[30vh] max-h-[30vh]"
              />
            </div>
            <button className="btn btn-neutral btn-outline rounded-none" type="submit">SUBMIT</button>
          </form>
        </div>
      </div>

    
    </div>
  );
}

export default Contact;
