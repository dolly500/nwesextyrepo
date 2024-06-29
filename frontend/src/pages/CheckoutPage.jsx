import React from 'react'
import Header from '../components/Layout/Header'
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import Footer from '../components/Layout/Footer';
import Payment from "../components/Payment/Payment";

const CheckoutPage = () => {
  return (
    <div>
        <Header />
        <br />
        <br />
        <CheckoutSteps active={1} />
        {/** INFO: add missing @param userId 
         * userId - 66116c8364783ef83120989a
         * 
         * TODO: dynamically fetch userID
        */}
        <Checkout userId="66116c8364783ef83120989a" />
        {/* <Payment /> */}
        <br />
        <br />
        <Footer />
    </div>
  )
}

export default CheckoutPage