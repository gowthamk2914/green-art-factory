import {
  SUBMIT_PROJECT_ENQUIRY_REQUEST,
  SUBMIT_PROJECT_ENQUIRY_SUCCESS,
  SUBMIT_PROJECT_ENQUIRY_FAILURE,
  RESET_PROJECT_ENQUIRY_STATUS,
} from "./actions";

const initialState = {
  loading: false,
  success: false,
  message: null,
  fieldErrors: {}, // e.g. { whatsapp_number: ["The whatsapp number field is required."] }
};

const ProjectEnquiryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_PROJECT_ENQUIRY_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        fieldErrors: {},
      };

    case SUBMIT_PROJECT_ENQUIRY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload?.message || "Enquiry submitted.",
        fieldErrors: {},
      };

    case SUBMIT_PROJECT_ENQUIRY_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        message: action.payload?.message || "Something went wrong.",
        fieldErrors: action.payload?.errors || {},
      };

    case RESET_PROJECT_ENQUIRY_STATUS:
      return initialState;

    default:
      return state;
  }
};

export default ProjectEnquiryReducer;