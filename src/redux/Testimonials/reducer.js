import {
  GET_TESTIMONIALS_REQUEST,
  GET_TESTIMONIALS_SUCCESS,
  GET_TESTIMONIALS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const TestimonialsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TESTIMONIALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_TESTIMONIALS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_TESTIMONIALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default TestimonialsReducer;