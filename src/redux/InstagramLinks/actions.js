export const GET_INSTAGRAM_LINKS_REQUEST = "GET_INSTAGRAM_LINKS_REQUEST";
export const GET_INSTAGRAM_LINKS_SUCCESS = "GET_INSTAGRAM_LINKS_SUCCESS";
export const GET_INSTAGRAM_LINKS_FAILURE = "GET_INSTAGRAM_LINKS_FAILURE";

export const getInstagramLinksRequest = () => ({
  type: GET_INSTAGRAM_LINKS_REQUEST,
});

export const getInstagramLinksSuccess = (payload) => ({
  type: GET_INSTAGRAM_LINKS_SUCCESS,
  payload,
});

export const getInstagramLinksFailure = (error) => ({
  type: GET_INSTAGRAM_LINKS_FAILURE,
  payload: error,
});