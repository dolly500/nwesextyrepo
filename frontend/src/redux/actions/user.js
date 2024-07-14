import axios from 'axios';
import { server } from '../../server';
import { getLocalStorage } from '../../lib/localStorage';

// load user
export const loadUser = () => async (dispatch) => {
  const token = getLocalStorage("auth-token")

  try {
    dispatch({
      type: 'LoadUserRequest',
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    dispatch({
      type: 'LoadUserSuccess',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'LoadUserFail',
      payload: error.response.data.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  const token = getLocalStorage("auth-token")

  try {
    dispatch({
      type: 'LoadSellerRequest',
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Log after the API call is successful
    console.log("Received seller data:", data);

    dispatch({
      type: 'LoadSellerSuccess',
      payload: data.seller,
    });

  } catch (error) {
    dispatch({
      type: 'LoadSellerFail',
      payload: error.response.data.message,
    });
  }
};

// user update information
export const updateUserInformation = (name, email, phoneNumber, password) => async (dispatch) => {
  try {
    dispatch({
      type: 'updateUserInfoRequest',
    });

    const token = getLocalStorage("auth-token")

    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      {
        email,
        password,
        phoneNumber,
        name,
      },
      {
        withCredentials: true,
        headers:
        {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: 'updateUserInfoSuccess',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'updateUserInfoFailed',
      payload: error.response.data.message,
    });
  }
};

// update user address
export const updatUserAddress = (country, city, address1, address2, zipCode, addressType) => async (dispatch) => {
  try {
    dispatch({
      type: 'updateUserAddressRequest',
    });

    const token = getLocalStorage("auth-token")

    const { data } = await axios.put(
      `${server}/user/update-user-addresses`,
      {
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
      },
      {
        withCredentials: true,
        headers:
        {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: 'updateUserAddressSuccess',
      payload: {
        successMessage: 'User address updated succesfully!',
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: 'updateUserAddressFailed',
      payload: error.response.data.message,
    });
  }
};

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'deleteUserAddressRequest',
    });

    const token = getLocalStorage("auth-token")

    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, {
      withCredentials: true,
      headers:
      {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: 'deleteUserAddressSuccess',
      payload: {
        successMessage: 'User deleted successfully!',
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: 'deleteUserAddressFailed',
      payload: error.response.data.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllUsersRequest',
    });

    const token = getLocalStorage("auth-token")

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
      headers:
      {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: 'getAllUsersSuccess',
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: 'getAllUsersFailed',
      payload: error.response.data.message,
    });
  }
};
