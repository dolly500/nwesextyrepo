import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../../styles/styles";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  


  return (
    <div style={{ overflow: 'hidden' }}>
    <Slider {...settings}>
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/premium-photo/female-set-sex-toys-bdsm_118086-2207.jpg?size=626&ext=jpg&ga=GA1.1.1799229163.1671081494&semt=ais)] bg-blend-darken ${styles.noramlFlex}`}
    >
      <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
        <h1
          className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-[#E6007E] font-[700] capitalize`}
        >
          Best Collection Of <br /> Sex Toys
        </h1>
        <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-[#ffffff]">
        We provide solutions and guidance needed in relationships regarding all aspects of their sex life's challenges. With our experienced and  professional counselors, date deal  offers an accessible, convenient solution for those seeking online therapy. Take an in-depth questionnaire to find the right therapist for you.
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
    <div
        className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/free-photo/top-view-woman-with-smartphone-vibrator_23-2150232187.jpg?size=626&ext=jpg&ga=GA1.1.1799229163.1671081494&semt=ais)] bg-blend-darken ${styles.noramlFlex}`}
      >
        {/* Slide 2 content */}
        <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
        <h1
          className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-white font-[700] capitalize`}
        >
          Message your therapist anytime
        </h1>
        <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-[#ffffff]">
        24/7 messaging services with our assigned therapists via text messaging & voice calls.
        </p>
        <Link to="/sign-up" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Register Now
            </span>
          </div>
        </Link>
        </div>
    </div>

    <div
        className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat bg-center bg-[url(https://img.freepik.com/free-photo/close-up-sex-toys_23-2149151785.jpg?size=626&ext=jpg&ga=GA1.1.1799229163.1671081494&semt=ais)] bg-blend-darken ${styles.noramlFlex}`}
      >
        {/* Slide 3 content */}
        <div className={`${styles.section}  w-[90%] 800px:w-[60%]`} style={{marginTop: '100px'}}>
            <h1
              className={`text-[45px] leading-[1.2] 800px:text-[80px] 1200px:text-[80px] text-white font-[700] capitalize`}
            >
              Affordable quality products of sex toys
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[16px] 1200px:text-[20px] font-[400] text-[#ffffff]">
            Affordable compared to other providers.
            </p>
            <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
        </div>
    </div>
    </Slider>
    </div>
  );
};

export default Hero;
