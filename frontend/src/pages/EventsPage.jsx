import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [categoriesData, setCategoriesData] = useState([])

  useEffect(() => {
    axios.get(`${server}/category`, {withCredentials: true}).then((res) => {
      setCategoriesData(res.data.categorys);
    })
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} categoriesData={categoriesData}/>
          <div className={`${styles.section} my-8`}>
            <div className={`${styles.heading}`}>
              <h1>Upcoming Promos And Price Discount Offers</h1>
            </div>

            <EventCard active={true} data={allEvents && allEvents[0]} />
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
