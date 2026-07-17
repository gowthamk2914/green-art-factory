import {
  GET_PRODUCTS_PREVIEW_REQUEST,
  GET_PRODUCTS_PREVIEW_SUCCESS,
  GET_PRODUCTS_PREVIEW_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const ProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_PREVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PRODUCTS_PREVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };

    case GET_PRODUCTS_PREVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProductsReducer;