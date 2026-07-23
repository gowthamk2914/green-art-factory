import {
  GET_BLOG_PREVIEW_REQUEST,
  GET_BLOG_PREVIEW_SUCCESS,
  GET_BLOG_PREVIEW_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: { categories: [], posts: [] },
  error: null,
};

const BlogPreviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BLOG_PREVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BLOG_PREVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_BLOG_PREVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default BlogPreviewReducer;