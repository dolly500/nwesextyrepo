import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART_FROM_LOCAL_STORAGE } from "../constants/cartConstants";

const initialState = {
  cart: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // Add to cart logic
      return { ...state, cart: [...state.cart, action.payload.data] };
    case REMOVE_FROM_CART:
      // Remove from cart logic
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload.data._id) };
    case LOAD_CART_FROM_LOCAL_STORAGE:
      // Load cart from local storage logic
      const storedCart = JSON.parse(localStorage.getItem(`cart_${action.payload}`)) || [];
      return { ...state, cart: storedCart };
    default:
      return state;
  }
};




