export const SUBMIT_PROJECT_ENQUIRY_REQUEST = "SUBMIT_PROJECT_ENQUIRY_REQUEST";
export const SUBMIT_PROJECT_ENQUIRY_SUCCESS = "SUBMIT_PROJECT_ENQUIRY_SUCCESS";
export const SUBMIT_PROJECT_ENQUIRY_FAILURE = "SUBMIT_PROJECT_ENQUIRY_FAILURE";
export const RESET_PROJECT_ENQUIRY_STATUS = "RESET_PROJECT_ENQUIRY_STATUS";

// payload: { full_name, whatsapp_number, email, project_location, project_details }
export const submitProjectEnquiryRequest = (payload) => ({
  type: SUBMIT_PROJECT_ENQUIRY_REQUEST,
  payload,
});

export const submitProjectEnquirySuccess = (payload) => ({
  type: SUBMIT_PROJECT_ENQUIRY_SUCCESS,
  payload,
});

// payload: { message, errors }
export const submitProjectEnquiryFailure = (payload) => ({
  type: SUBMIT_PROJECT_ENQUIRY_FAILURE,
  payload,
});

export const resetProjectEnquiryStatus = () => ({
  type: RESET_PROJECT_ENQUIRY_STATUS,
});