import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART_FROM_LOCAL_STORAGE } from "../constants/cartConstants";

const initialState = {
  cart: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // Check if the item already exists in the cart
      const existingItemIndex = state.cart.findIndex(item => item._id === action.payload.data._id);
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex ? { ...item, qty: action.payload.data.qty } : item
        );
        return { ...state, cart: updatedCart };
      } else {
        // If item does not exist, add it to the cart
        return { ...state, cart: [...state.cart, action.payload.data] };
      }

    case REMOVE_FROM_CART:
      // Remove item from cart logic
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload.data._id) };

    case LOAD_CART_FROM_LOCAL_STORAGE:
      // Load cart from local storage logic
      const storedCart = JSON.parse(localStorage.getItem(`cart_${action.payload}`)) || [];
      return { ...state, cart: storedCart };

    default:
      return state;
  }
};
