
export const GET_PRODUCT_DETAIL_REQUEST = "GET_PRODUCT_DETAIL_REQUEST";
export const GET_PRODUCT_DETAIL_SUCCESS = "GET_PRODUCT_DETAIL_SUCCESS";
export const GET_PRODUCT_DETAIL_FAILURE = "GET_PRODUCT_DETAIL_FAILURE";

export const getProductDetailRequest = (slug) => ({
  type: GET_PRODUCT_DETAIL_REQUEST,
  payload: { slug },
});

export const getProductDetailSuccess = (payload) => ({
  type: GET_PRODUCT_DETAIL_SUCCESS,
  payload,
});

export const getProductDetailFailure = (payload) => ({
  type: GET_PRODUCT_DETAIL_FAILURE,
  payload,
});

