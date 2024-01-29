import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Hero from '../components/Route/Hero/Hero';
import Categories from '../components/Route/Categories/Categories';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct';
import Events from '../components/Events/Events';
import SliderIndicatorsOutside from '../components/Route/Slider/Slider';
// import Sponsored from '../components/Route/Sponsored';
import Footer from '../components/Layout/Footer';
import SlideInOnScroll from './SlideInOnScroll'; // Import the SlideInOnScroll component

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    // When the component mounts, scroll to the top of the page
    window.scrollTo(0, 0);
  }, []);

  const handleFooterClick = () => {
    // When clicking on a footer link, store the current scroll position in session storage
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  const handleBackButtonClick = () => {
    // Check if the previous location was the footer
    if (navigate) {
      const previousLocation = sessionStorage.getItem('previousLocation');
      if (previousLocation === 'footer') {
        // Retrieve the stored scroll position and scroll to that position
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
        }
      }
    }
  };

  useEffect(() => {
    // Listen for history changes (e.g., browser back button)
    handleBackButtonClick();
  }, [navigate]);

  return (
    <div>
      <Header activeHeading={1} />
      <div className={`bg-black`}>
        <SlideInOnScroll>
          <Hero />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Categories />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <BestDeals />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <Events />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <FeaturedProduct />
        </SlideInOnScroll>
        <SlideInOnScroll>
          <SliderIndicatorsOutside />
        </SlideInOnScroll>
        <SlideInOnScroll>

          <Footer onClick={handleFooterClick}/>

        </SlideInOnScroll>
      </div>
    </div>
  );
};

export default HomePage;
