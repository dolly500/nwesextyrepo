import axios from "axios";
import { server } from "../../server";

// create questionaire
export const createQuestionaire = (data) => async (dispatch) => {
    console.log("Request Payload:", data);
    try {
      dispatch({
        type: "questionaireCreateRequest",
      });
      
      const { d } = await axios.post(`${server}/questionaire/create-questionnaire`, data);

      dispatch({
        type: "questionaireCreateSuccess",
        payload: d.questionaire,
      });


    } catch (error) {
      dispatch({
        type: "questionaireCreateFail",
        payload: error?.response?.data?.message,
      });
    }
  };

  // get all questionaire of the shop by id

export const getAllQuestionaireShop = (id) => async (dispatch) => {
    
    try {
      dispatch({
        type: "getAllQuestionaireShopRequest",
      });
  
      const { data } = await axios.get(
        `${server}/questionaire/get-all-questionnaire/${id}`, {withCredentials: true}
      );

      console.log('QUestionaire data', data)
  
      dispatch({
        type: "getAllQuestionaireShopSuccess",
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: "getAllQuestionaireShopFailed",
        payload: error.response.data.message,
      });
    }
  };

  // get all questionaire
export const getAllQuestionaire= () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllQuestionaireRequest",
      });
      
      const { data } = await axios.get(`${server}/questionaire/get-all-questionnaire`);
      console.log('QUestionaire data', data)
      dispatch({
        type: "getAllQuestionaireSuccess",
        payload: data.data,
      });
      console.log('payload', data.data)
      
    } catch (error) {
      dispatch({
        type: "getAllQuestionaireFailed",
        payload: error.response.data.message,
      });
    }
  };
  
  // delete questionaire
  export const deleteQuestionaire = (id) => async (dispatch) => {
    try {
      dispatch({
        type: "deleteQuestionaireRequest",
      });
  
      const { data } = await axios.delete(
        `${server}/questionaire/${id}`,
        {
          withCredentials: true,
        }
      );
  
    
  
      dispatch({
        type: "deleteQuestionaireSuccess",
        payload: data.message,
      });
  
    } catch (error) {
      dispatch({
        type: "deleteQuestionaireFailed",
        payload: error.response.data.message,
      });
    }
  };