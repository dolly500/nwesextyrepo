import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, LOAD_WISHLIST_FROM_LOCAL_STORAGE } from "../constants/wishlistConstants";

const initialState = {
  wishlist: [],
};

export const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST:
      const newItem = action.payload;
      const existingItem = state.wishlist.find((item) => item._id === newItem._id);
      if (existingItem) {
        return {
          ...state,
          wishlist: state.wishlist.map((item) =>
            item._id === existingItem._id ? newItem : item
          ),
        };
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, newItem],
        };
      }

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item._id !== action.payload),
      };

    case LOAD_WISHLIST_FROM_LOCAL_STORAGE:
      const storedWishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
      return { ...state, wishlist: storedWishlist };

    default:
      return state;
  }
};
