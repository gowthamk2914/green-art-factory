export const GET_CATALOGUES_REQUEST = "GET_CATALOGUES_REQUEST";
export const GET_CATALOGUES_SUCCESS = "GET_CATALOGUES_SUCCESS";
export const GET_CATALOGUES_FAILURE = "GET_CATALOGUES_FAILURE";

export const getCataloguesRequest = () => ({
  type: GET_CATALOGUES_REQUEST,
});

export const getCataloguesSuccess = (payload) => ({
  type: GET_CATALOGUES_SUCCESS,
  payload,
});

export const getCataloguesFailure = (payload) => ({
  type: GET_CATALOGUES_FAILURE,
  payload,
});