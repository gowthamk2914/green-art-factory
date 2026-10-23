import {
  GET_CATALOGUES_REQUEST,
  GET_CATALOGUES_SUCCESS,
  GET_CATALOGUES_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const CataloguesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATALOGUES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CATALOGUES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_CATALOGUES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default CataloguesReducer;