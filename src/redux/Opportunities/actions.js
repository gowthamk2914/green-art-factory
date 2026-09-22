export const GET_CAREERS_REQUEST = "GET_CAREERS_REQUEST";
export const GET_CAREERS_SUCCESS = "GET_CAREERS_SUCCESS";
export const GET_CAREERS_FAILURE = "GET_CAREERS_FAILURE";

export const getCareersRequest = () => ({
  type: GET_CAREERS_REQUEST,
});

export const getCareersSuccess = (payload) => ({
  type: GET_CAREERS_SUCCESS,
  payload,
});

export const getCareersFailure = (payload) => ({
  type: GET_CAREERS_FAILURE,
  payload,
});