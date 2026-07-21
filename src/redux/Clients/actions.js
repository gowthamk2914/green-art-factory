export const GET_PARTNERS_REQUEST = "GET_PARTNERS_REQUEST";
export const GET_PARTNERS_SUCCESS = "GET_PARTNERS_SUCCESS";
export const GET_PARTNERS_FAILURE = "GET_PARTNERS_FAILURE";

export const getPartnersRequest = () => ({
  type: GET_PARTNERS_REQUEST,
});

export const getPartnersSuccess = (payload) => ({
  type: GET_PARTNERS_SUCCESS,
  payload,
});

export const getPartnersFailure = (payload) => ({
  type: GET_PARTNERS_FAILURE,
  payload,
});