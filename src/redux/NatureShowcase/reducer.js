// redux/NatureShowcase/reducer.js

import {
  GET_NATURE_SHOWCASE_REQUEST,
  GET_NATURE_SHOWCASE_SUCCESS,
  GET_NATURE_SHOWCASE_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const NatureShowcaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NATURE_SHOWCASE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_NATURE_SHOWCASE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_NATURE_SHOWCASE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default NatureShowcaseReducer;