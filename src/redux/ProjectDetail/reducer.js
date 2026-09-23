import {
  GET_PROJECT_DETAIL_REQUEST,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_PROJECT_DETAIL_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: null,
  error: null,
  slug: null, // the slug the current `data` belongs to
};

const ProjectDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        slug: action.payload,
      };

    case GET_PROJECT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_PROJECT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
      };

    default:
      return state;
  }
};

export default ProjectDetailReducer;