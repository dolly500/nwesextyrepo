import axios from "axios";
import { server } from "../../server";


// export async function uploadFile(file){
//   const formData = new FormData();

//   formData.append("file", file);
//   formData.append("upload_preset", "spiderman");

//   const response = await axios.post(`https://api.cloudinary.com/v1_1/diztvrcsi/upload`, formData)
//   return response?.data?.secure_url;
// }

export async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


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


        const base64 = await getBase64(image);

        const images = [base64]


        const { data } = await axios.post(
          `${server}/category/create-category`,
          {name, description, images}
        );


        console.log("Payload Request", data)

        dispatch({
          type: "categoryCreateSuccess",
          payload: data.category,
        });
        console.log('category', data)
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

    const { data } = await axios.get(`${server}/category/`);
    console.log('category in the get', data?.categorys)
    dispatch({
      type: "getAllCategoriesSuccess",
      payload: data.categorys,
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

    console.log('delete category', data)
  } catch (error) {
    dispatch({
      type: "deleteCategoryFailed",
      payload: error.response.data.message,
    });
  }
};
