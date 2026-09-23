export const SUBMIT_ENQUIRY_REQUEST = "SUBMIT_ENQUIRY_REQUEST";
export const SUBMIT_ENQUIRY_SUCCESS = "SUBMIT_ENQUIRY_SUCCESS";
export const SUBMIT_ENQUIRY_FAILURE = "SUBMIT_ENQUIRY_FAILURE";
export const RESET_ENQUIRY_STATUS = "RESET_ENQUIRY_STATUS";

// payload: { name, email, mobile, project_details }
export const submitEnquiryRequest = (payload) => ({
  type: SUBMIT_ENQUIRY_REQUEST,
  payload,
});

export const submitEnquirySuccess = (payload) => ({
  type: SUBMIT_ENQUIRY_SUCCESS,
  payload,
});

// payload: { message, errors }
export const submitEnquiryFailure = (payload) => ({
  type: SUBMIT_ENQUIRY_FAILURE,
  payload,
});

export const resetEnquiryStatus = () => ({
  type: RESET_ENQUIRY_STATUS,
});