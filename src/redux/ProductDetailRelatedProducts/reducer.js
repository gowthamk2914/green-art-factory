import {
  GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST,
  GET_PRODUCT_DETAIL_RELATED_PRODUCTS_SUCCESS,
  GET_PRODUCT_DETAIL_RELATED_PRODUCTS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: {},
  error: null,
};

const ProductDetailRelatedProductsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PRODUCT_DETAIL_RELATED_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          ...(action.payload || {}),
        },
        error: null,
      };

    case GET_PRODUCT_DETAIL_RELATED_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProductDetailRelatedProductsReducer;