import {
  GET_CAREERS_REQUEST,
  GET_CAREERS_SUCCESS,
  GET_CAREERS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const CareersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CAREERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CAREERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_CAREERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default CareersReducer;