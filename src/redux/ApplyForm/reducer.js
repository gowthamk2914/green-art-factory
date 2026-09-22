import {
  SUBMIT_APPLICATION_REQUEST,
  SUBMIT_APPLICATION_SUCCESS,
  SUBMIT_APPLICATION_FAILURE,
  RESET_APPLICATION_STATUS,
} from "./actions";

const initialState = {
  loading: false,
  success: false,
  message: null,
  fieldErrors: {}, // e.g. { full_name: ["The full name field is required."] }
};

const ApplyFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_APPLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        fieldErrors: {},
      };

    case SUBMIT_APPLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload?.message || "Application submitted.",
        fieldErrors: {},
      };

    case SUBMIT_APPLICATION_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        message: action.payload?.message || "Something went wrong.",
        fieldErrors: action.payload?.errors || {},
      };

    case RESET_APPLICATION_STATUS:
      return initialState;

    default:
      return state;
  }
};

export default ApplyFormReducer;