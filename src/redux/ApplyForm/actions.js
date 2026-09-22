export const SUBMIT_APPLICATION_REQUEST = "SUBMIT_APPLICATION_REQUEST";
export const SUBMIT_APPLICATION_SUCCESS = "SUBMIT_APPLICATION_SUCCESS";
export const SUBMIT_APPLICATION_FAILURE = "SUBMIT_APPLICATION_FAILURE";
export const RESET_APPLICATION_STATUS = "RESET_APPLICATION_STATUS";

// payload: a FormData instance (fields + resume file)
export const submitApplicationRequest = (payload) => ({
  type: SUBMIT_APPLICATION_REQUEST,
  payload,
});

export const submitApplicationSuccess = (payload) => ({
  type: SUBMIT_APPLICATION_SUCCESS,
  payload,
});

// payload: { message, errors } — errors is the field-keyed object
// the API returns (full_name, email, phone, position, consent, ...)
export const submitApplicationFailure = (payload) => ({
  type: SUBMIT_APPLICATION_FAILURE,
  payload,
});

// Lets the form clear the submitted/error state if the user starts over
export const resetApplicationStatus = () => ({
  type: RESET_APPLICATION_STATUS,
});