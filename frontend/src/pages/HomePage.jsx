import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import axios from 'axios';

import Header from '../components/Layout/Header';
import Hero from '../components/Route/Hero/Hero';
import Categories from '../components/Route/Categories/Categories';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct';
import Events from '../components/Events/Events';
// import SliderIndicatorsOutside from '../components/Route/Slider/Slider';
// import Sponsored from '../components/Route/Sponsored';
import Footer from '../components/Layout/Footer';
import SlideInOnScroll from './SlideInOnScroll'; // Import the SlideInOnScroll component
import { server } from '../server';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [categoriesData, setCategoriesData] = useState([])
  const [isLoading, setIsLoading] = useState(false);



  /**
 * Retrieves transaction reference (@param trxRef) from the URL on page load.
 * Verifies @param trxRef by makin an API call to the /payment/verify endpoint.
 * If the verification is successful, User is redirected to the inbox (@ /inbox) route.
 * Otherwise, an error message is displayed to the user.
 */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxRefParam = urlParams.get('trxref'); // Extract 'trxRef' parameter
    const typeParam = urlParams.get('type'); // Extract 'type' parameter


    const verifyTrxRef = async (trxRef) => {
      setIsLoading(true);
      try {
        const response = await axios.put(`${server}/payment/verify/${trxRef}`);
        const data = await response.data;

        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        /** Logic to perform if redirect URL resulted from,
         * chat payment
         */
        if (typeParam === 'chat') {
          if (isAuthenticated) {
            const groupTitle = data._id + user._id;
            const userId = user._id;
            const sellerId = data.shop._id;

            await axios.post(`${server}/conversation/create-new-conversation`, {
              groupTitle,
              userId,
              sellerId,
            })
              .then((res) => {
                toast.success("Payment Successful!");
                navigate(`/inbox?${res.data.conversation._id}`);
              })
              .catch((error) => {
                toast.error(error.response.data.message);
              });

            return
          } else {
            toast.success("Payment Successful!");
            navigate('/inbox');

            return
          }
        }

        /** If Payment verification is successful,
         * redirect users to Chat Inbox
         */
        if (data.success) {
          toast.success("Payment Successful!");
          return
        } else {
          throw new Error(data.error || 'Verification failed'); // Handle error message from API
        }

      } catch (error) {
        console.error('Error verifying trxRef:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (trxRefParam) {
      verifyTrxRef(trxRefParam); // Trigger verification on mount
    } else {
      // Handle missing 'trxRef' parameter (optional)
      console.info(`No "trxRef" ${!typeParam ? 'or "type"' : null}  parameter was found in URL`);
    }
  }, []);




  useEffect(() => {
    // When the component mounts, scroll to the top of the page
    window.scrollTo(0, 0);
    axios.get(`${server}/category/`, { withCredentials: true }).then((res) => {
      setCategoriesData(res?.data?.categorys);
    }).catch((error) => {
      console.error('Error fetching category data:', error);
    });
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
      {
        isLoading ? <div>Verifying Transaction...</div> : null
      }
      <Header activeHeading={1} categoriesData={categoriesData} />
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
          <Footer onClick={handleFooterClick} />

        </SlideInOnScroll>
      </div>
    </div>
  );
};

export default HomePage;
