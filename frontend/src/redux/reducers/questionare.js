import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const questionaireReducer = createReducer(initialState, {
    questionaireCreateRequest: (state) => {
      state.isLoading = true;
    },
    questionaireCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.questionaire = action.payload;
      state.success = true;
    },
    questionaireCreateFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },

    // delete questionaire
  deleteQuestionaireRequest: (state) => {
    state.isLoading = true;
  },
  deleteQuestionaireSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteQuestionaireFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all questionaire
  getAllQuestionaireRequest: (state) => {
    state.isLoading = true;
  },
  getAllQuestionaireSuccess: (state, action) => {
    state.isLoading = false;
    state.questionaires = action.payload;
  },
  getAllQuestionaireFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },

})