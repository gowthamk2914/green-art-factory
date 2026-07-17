export const GET_PRODUCTS_PREVIEW_REQUEST =
  "GET_PRODUCTS_PREVIEW_REQUEST";

export const GET_PRODUCTS_PREVIEW_SUCCESS =
  "GET_PRODUCTS_PREVIEW_SUCCESS";

export const GET_PRODUCTS_PREVIEW_FAILURE =
  "GET_PRODUCTS_PREVIEW_FAILURE";

export const getProductsPreviewRequest = () => ({
  type: GET_PRODUCTS_PREVIEW_REQUEST,
});

export const getProductsPreviewSuccess = (payload) => ({
  type: GET_PRODUCTS_PREVIEW_SUCCESS,
  payload,
});

export const getProductsPreviewFailure = (payload) => ({
  type: GET_PRODUCTS_PREVIEW_FAILURE,
  payload,
});