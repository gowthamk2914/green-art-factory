export const GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST =
  "GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST";

export const GET_PRODUCT_DETAIL_RELATED_PRODUCTS_SUCCESS =
  "GET_PRODUCT_DETAIL_RELATED_PRODUCTS_SUCCESS";

export const GET_PRODUCT_DETAIL_RELATED_PRODUCTS_FAILURE =
  "GET_PRODUCT_DETAIL_RELATED_PRODUCTS_FAILURE";

export const getProductDetailRelatedProductsRequest = (items) => ({
  type: GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST,
  payload: { items },
});

export const getProductDetailRelatedProductsSuccess = (products) => ({
  type: GET_PRODUCT_DETAIL_RELATED_PRODUCTS_SUCCESS,
  payload: products,
});

export const getProductDetailRelatedProductsFailure = (error) => ({
  type: GET_PRODUCT_DETAIL_RELATED_PRODUCTS_FAILURE,
  payload: error,
});