import {
  GET_FEATURED_PROJECTS_REQUEST,
  GET_FEATURED_PROJECTS_SUCCESS,
  GET_FEATURED_PROJECTS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const FeaturedProjectsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GET_FEATURED_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_FEATURED_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_FEATURED_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default FeaturedProjectsReducer;