import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cart";
import { eventReducer } from "./reducers/event";
import { orderReducer } from "./reducers/order";
import { postReducer } from "./reducers/post";
import { productReducer } from "./reducers/product";
import { sellerReducer } from "./reducers/seller";
import { userReducer } from "./reducers/user";
import { wishlistReducer } from "./reducers/wishlist";
import { categoryReducer } from "./reducers/category";
import { questionaireReducer } from "./reducers/questionare";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    posts: postReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    category: categoryReducer,
    questionaire: questionaireReducer,
  },
});

export default Store;
