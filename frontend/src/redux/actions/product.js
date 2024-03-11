import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (data) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "productCreateRequest",
      });
      
      console.log("Request Payload:", data); 

      const { d } = await axios.post(
        `${server}/product/create-product`, data);
      dispatch({
        type: "productCreateSuccess",
        payload: d.product,
      });
    } catch (error) {
      dispatch({
        type: "productCreateFail",
        payload: error.response.data.message,
      });
    }
  };

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );

    console.log("Received data:", data);
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/get-all-products-shop/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
    console.log("Received data:", data);

  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};
