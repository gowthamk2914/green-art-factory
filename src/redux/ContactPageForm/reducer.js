import {
  SUBMIT_ENQUIRY_REQUEST,
  SUBMIT_ENQUIRY_SUCCESS,
  SUBMIT_ENQUIRY_FAILURE,
  RESET_ENQUIRY_STATUS,
} from "./actions";

const initialState = {
  loading: false,
  success: false,
  message: null,
  fieldErrors: {}, // e.g. { email: ["The email field is required."] }
};

const ContactReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ENQUIRY_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        fieldErrors: {},
      };

    case SUBMIT_ENQUIRY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload?.message || "Enquiry submitted.",
        fieldErrors: {},
      };

    case SUBMIT_ENQUIRY_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        message: action.payload?.message || "Something went wrong.",
        fieldErrors: action.payload?.errors || {},
      };

    case RESET_ENQUIRY_STATUS:
      return initialState;

    default:
      return state;
  }
};

export default ContactReducer;