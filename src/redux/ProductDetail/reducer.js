
import {
  GET_PRODUCT_DETAIL_REQUEST,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const ProductDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
      };

    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };

    case GET_PRODUCT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProductDetailReducer;

