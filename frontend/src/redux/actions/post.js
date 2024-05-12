import axios from "axios";
import { server } from "../../server";

// create post
export const createpost = (data) => async (dispatch) => {
  try {
    dispatch({
      type: "postCreateRequest",
    });

    const { d } = await axios.post(`${server}/post/create-post`, data);
    console.log("post", data);

    dispatch({
      type: "postCreateSuccess",
      payload: d.post,
    });
  } catch (error) {
    dispatch({
      type: "postCreateFail",
      payload: error?.response?.data?.message,
    });
  }
};

// get all post of a shop
export const getAllPostsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllpostsShopRequest",
    });

    const { data } = await axios.get(`${server}/post/get-all-posts`);
    dispatch({
      type: "getAllpostsShopSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "getAllpostsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete event of a shop
export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deletepostRequest",
    });

    const { data } = await axios.delete(
      `${server}/post/delete-shop-Post/${id}`,
      {
        withCredentials: true,
      }
    );
    console.log("post deleted successfully:", data.message);
    dispatch({
      type: "deletepostSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deletepostFailed",
      payload: error.response.data.message,
    });
  }
};

// get all events
export const getAllPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllpostsRequest",
    });

    const { data } = await axios.get(`${server}/post/get-all-posts`);
    dispatch({
      type: "getAllpostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "getAllpostsFailed",
      payload: error.response.data.message,
    });
  }
};
