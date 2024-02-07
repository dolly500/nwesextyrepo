import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [categoriesData, setCategoriesData] = useState([])

  useEffect(() => {
    axios.get(`${server}/category`, {withCredentials: true}).then((res) => {
      setCategoriesData(res.data.categorys);
    })
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData);
  }, [allProducts]);

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div>
            <Header activeHeading={2} categoriesData={categoriesData} />
            <br />
            <br />
            <div className={`${styles.section}`}>
              <div className={`${styles.heading}`}>
                <h1>Best Selling</h1>
              </div>
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
              </div>
            </div>
            <Footer />
          </div>
        )
      }
    </>
  );
};

export default BestSellingPage;
