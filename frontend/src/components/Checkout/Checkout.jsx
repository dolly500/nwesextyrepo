import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const userId = user._id
  const userEmail = user.email

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paystackApiKey, setPaystackApiKey] = useState('');

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0)

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Get PayStack API key on page load
  useEffect(() => {
    const fetchPaystackApiKey = async () => {
      try {
        const res = await axios.get(`${server}/payment/paystackapikey`);
        setPaystackApiKey(res.data.paystackApikey);
      } catch (error) {
        console.error('Error fetching Paystack API key:', error);
      }
    };

    fetchPaystackApiKey();
  }, []);

  const handlePayment = async () => {
    try {
      // API request to create order
      const createOrderResponse = await axios.post(`${server}/order/create-order`, {
        cart,
        shippingAddress,
        user: user,
        totalPrice,
        paymentInfo,
      });

      const { orders } = createOrderResponse.data;
      setOrders(orders);

      // Process and verify payment for each order
      for (const order of orders) {
        const orderId = order._id;

        try {
          await axios.post(
            `${server}/payment/process/${orderId}`,
            {
              email: userEmail,
              amount: order?.totalPrice * 100 //Convert amount to subunit of currency
            },
            {
              headers: {
                'Authorization': `Bearer ${paystackApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          ).then((res) => {
            /** Redirect users to a paystack payment page,
             * If transaction is initialized succesfully
            */
            if (res.status === 200 && res?.data.success) {
              window.location.replace(res?.data.client_secret?.data?.authorization_url)
            }
          }).catch((err) => {
            throw new Error(err.response.data.message)
          })
        } catch (error) {
          console.error('Error making payment request:', error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment Failed!");
    }
  };

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentInfoChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      <div className="bg-white p-5 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p>Quantity: {item.qty}</p>
              <p>Price: ₦{item.discountPrice}</p>
            </div>
            <p className="font-medium">₦{item.qty * item.discountPrice}</p>
          </div>
        ))}
        <div className="flex justify-between items-center font-semibold text-lg">
          <p>Total:</p>
          <p>₦{totalPrice}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-5">Shipping Address</h2>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleShippingAddressChange}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* <h2 className="text-xl font-semibold mb-4 mt-5">Payment Information</h2>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentInfo.cardNumber}
          onChange={handlePaymentInfoChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={paymentInfo.expiryDate}
          onChange={handlePaymentInfoChange}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={paymentInfo.cvv}
          onChange={handlePaymentInfoChange}
          className="mb-2 p-2 border rounded w-full"
        /> */}

        <button
          onClick={handlePayment}
          className="mt-5 w-full bg-red-500 text-white py-2 rounded"
        >
          Confirm and Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
