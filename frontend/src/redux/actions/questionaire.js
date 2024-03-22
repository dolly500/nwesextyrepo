import axios from "axios";
import { server } from "../../server";

export const createQuestionaire = (data) => async (dispatch) => {
    try {
      dispatch({
        type: "questionaireCreateRequest",
      });
      console.log("Request Payload:", data);
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

  // get all questionaire
export const getAllQuestionaire= () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllQuestionaireRequest",
      });
      
      const { data } = await axios.get(`${server}/questionaire/get-all-questionnaire`);
      
      dispatch({
        type: "getAllQuestionaireSuccess",
        payload: data.questionaires,
      });
      
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