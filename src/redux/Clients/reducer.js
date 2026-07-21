import {
  GET_PARTNERS_REQUEST,
  GET_PARTNERS_SUCCESS,
  GET_PARTNERS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const PartnersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PARTNERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PARTNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_PARTNERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default PartnersReducer;