import axios from "axios";
import { server } from "../../server";

// create category
export const createCategory =
  (
    { name,
      description,
      image }
  ) =>
    async (dispatch) => {
      try {
        dispatch({
          type: "categoryCreateRequest",
        });

        console.log("Payload Request", { name,
          description,
          image })
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);
        const { data } = await axios.post(
          `${server}/category/create-category`,
          formData, 
        );
        dispatch({
          type: "categoryCreateSuccess",
          payload: data.data,
        });
      } catch (error) {
        dispatch({
          type: "categoryCreateFail",
          payload: error.response.data.message,
        });
      }
    };

// get all categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllCategoriesRequest",
    });

    const { data } = await axios.get(`${server}/category`);
    dispatch({
      type: "getAllCategoriesSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllCategoriesFailed",
      payload: error.response.data.message,
    });
  }
};

// delete category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteCategoryRequest",
    });

    const { data } = await axios.delete(
      `${server}/category/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteCategorySuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteCategoryFailed",
      payload: error.response.data.message,
    });
  }
};
