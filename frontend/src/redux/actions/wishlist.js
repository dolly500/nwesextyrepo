import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, LOAD_WISHLIST_FROM_LOCAL_STORAGE } from "../constants/wishlistConstants";

export const addToWishlist = (data, userId) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: { ...data, userId }, // Ensure payload structure matches reducer expectations
  };
};

export const removeFromWishlist = (data) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload: data._id, // Assuming data contains an _id field to identify the item
  };
};

export const loadWishlistFromLocalStorage = (userId) => {
  return {
    type: LOAD_WISHLIST_FROM_LOCAL_STORAGE,
    payload: userId,
  };
};
