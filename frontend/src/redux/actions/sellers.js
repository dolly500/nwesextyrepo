import axios from "axios";
import { server } from "../../server";
import { getLocalStorage } from '../../lib/localStorage'

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const token = getLocalStorage("auth-token")

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
      headers:
      {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,

    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
      payload: error.response.data.message,
    });
  }
};
