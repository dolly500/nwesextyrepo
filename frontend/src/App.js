// import { Elements } from "@paystack/react-paystack-js";
// import { loadpaystack } from "@paystack/paystack-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ShopHomePage } from "./ShopRoutes.js";
import { getAllEvents } from "./redux/actions/event";
import { getAllPosts } from "./redux/actions/post";
import { getAllProducts } from "./redux/actions/product";
import { loadSeller, loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import {
  AdminDashboardEvents,
  AdminDashboardOrders,
  AdminDashboardPage,
  AdminDashboardPosts,
  AdminDashboardProducts,
  AdminDashboardSellers,
  AdminDashboardUsers,
  AdminCategoryPage,
  AdminDashboardWithdraw
} from "./routes/AdminRoutes";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import {
  ActivationPage,
  BestSellingPage,
  CheckoutPage,
  EventsPage,
  FAQPage,
  HomePage,
  LiveChat,
  LoginPage,
  OrderDetailsPage,
  OrderSuccessPage,
  PaymentPage,
  PostsPage,
  ProductDetailsPage,
  ProductsPage,
  ProfilePage,
  SellerActivationPage,
  ShopCheckPassword,
  ShopForgotPassword,
  ShopCreatePage,
  ShopLoginPage,
  SignupPage,
  TrackOrderPage,
  UserInbox,
  QuestionnaireForm,
  ForgotPassword, 
  CheckPassword
} from "./routes/Routes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import {
  ShopAllCoupouns,
  ShopAllEvents,
  ShopAllOrders,
  ShopAllPosts,
  ShopAllQuestionaire,
  ShopAllProducts,
  ShopAllRefunds,
  ShopCreateEvents,
  ShopCreatePosts,
  ShopCreateProduct,
  ShopDashboardPage,
  ShopInboxPage,
  ShopOrderDetails,
  ShopPreviewPage,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopCreateCategory, 
  ShopAllCategory,
  ShopInfo
} from "./routes/ShopRoutes";
import { server } from "./server";
import { getAllCategories } from "./redux/actions/category.js";


const App = () => {
  const [paystackApikey, setPaystackApiKey] = useState("");
  const [categoriesData, setCategoriesData] = useState([])

  async function getPaystackApikey() {
    const { data } = await axios.get(`${server}/payment/paystackapikey`);
    setPaystackApiKey(data.paystackApikey);
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    Store.dispatch(getAllPosts());
    Store.dispatch(getAllCategories());
    getPaystackApikey();
    axios.get(`${server}/category`, { withCredentials: true }).then((res) => {
      setCategoriesData(res.data.categorys);
    })
  }, []);

  return (
    <BrowserRouter>
      {paystackApikey && (
        <Routes>
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-password" element={<CheckPassword />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/questionaire" element={<QuestionnaireForm />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />

        <Route path="/posts" element={<PostsPage categoriesData={categoriesData} />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<LiveChat categoriesData={categoriesData} />} />
        <Route path="/contact" element={<FAQPage categoriesData={categoriesData} />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage/>
            </ProtectedRoute>
          }
        />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        {/* shop Routes */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/admin-check-password" element={<ShopCheckPassword />} />
        <Route path="/admin-forgot-password" element={<ShopForgotPassword />} />

        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        {/* <Route path="/shop/:id"  element={
            <SellerProtectedRoute>
              <ShopInfo />
            </SellerProtectedRoute>
          } /> */}

        <Route
          path="/settings"
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-post"
          element={
            <SellerProtectedRoute>
              <ShopCreatePosts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-category"
          element={
            <SellerProtectedRoute>
              <ShopCreateCategory />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-posts"
          element={
            <SellerProtectedRoute>
              <ShopAllPosts />
            </SellerProtectedRoute>
          }
        />

      <Route path="/dashboard-questionaire"
          element={
            <SellerProtectedRoute>
              <ShopAllQuestionaire />
            </SellerProtectedRoute>
          }
        />

      <Route
          path="/dashboard-all-categories"
          element={
            <SellerProtectedRoute>
              <ShopAllCategory />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupons"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardSellers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardOrders />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardProducts />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-category"
          element={
            <ProtectedAdminRoute>
              <AdminCategoryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-events"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardEvents />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-posts"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPosts />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-withdraw-request"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardWithdraw />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
