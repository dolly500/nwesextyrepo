import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART_FROM_LOCAL_STORAGE } from "../constants/cartConstants";

export const addToCart = (data, userId) => {
  return {
    type: ADD_TO_CART,
    payload: { data, userId },
  };
};

export const removeFromCart = (data, userId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: { data, userId },
  };
};

export const loadCartFromLocalStorage = (userId) => {
  return {
    type: LOAD_CART_FROM_LOCAL_STORAGE,
    payload: userId,
  };
};
