import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve orderData from location state
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Fallback in case state is not available (e.g., direct access)
      const storedOrderData = localStorage.getItem("latestOrder");
      if (storedOrderData) {
        try {
          const parsedOrderData = JSON.parse(storedOrderData);
          setOrderData(parsedOrderData);
        } catch (error) {
          console.error("Error parsing order data from localStorage", error);
        }
      }
    }
  }, [location.state]);

  const paymentHandler = async (e) => {
    e.preventDefault();

    // Debugging: Check the content of orderData
    console.log("Order Data:", orderData);

    // Dynamically extract the order ID from the cart items
    const orderId = orderData?.cart?.length > 0 ? orderData.cart[0]._id : null;

    // Debugging: Check if orderId exists
    console.log("Order ID:", orderId);

    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/payment/process/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        window.location.href = data.client_secret.data.authorization_url;
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (!orderData || !user) {
      toast.error("Order data or user information is missing");
      return;
    }

    console.log("Order Data before creating order:", orderData);

    const order = {
      cart: orderData.cart,
      shippingAddress: orderData.shippingAddress,
      user: user,
      totalPrice: orderData.totalPrice,
      paymentInfo: {
        type: "Cash On Delivery",
      },
    };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <div>
        <div className="flex w-full pb-5 border-b mb-2" onClick={() => setSelect(1)}>
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 1 && <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Pay with Paystack</h4>
        </div>

        {select === 1 && (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="w-full flex pb-3">
                <div className="w-[100%]">
                  <label className="block pb-2">Name On Card</label>
                  <input
                    required
                    placeholder={user && user.name}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                    value={user && user.name}
                    readOnly
                  />
                </div>
                <div className="w-[100%]">
                  <label className="block pb-2">Email</label>
                  <input
                    required
                    placeholder={user && user.email}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                    value={user && user.email}
                    readOnly
                  />
                </div>
              </div>
              <input
                type="submit"
                value="Submit"
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        )}
      </div>

      <br />

      <div>
        <div className="flex w-full pb-5 border-b mb-2" onClick={() => setSelect(3)}>
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 3 && <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">Cash on Delivery</h4>
        </div>

        {select === 3 && (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm"
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
