import {
  GET_BLOG_DETAIL_REQUEST,
  GET_BLOG_DETAIL_SUCCESS,
  GET_BLOG_DETAIL_FAILURE,
  GET_RELATED_BLOGS_REQUEST,
  GET_RELATED_BLOGS_SUCCESS,
  GET_RELATED_BLOGS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: null,
  error: null,

  relatedLoading: false,
  relatedBlogs: [],
  relatedError: null,
};

const BlogDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BLOG_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BLOG_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_BLOG_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_RELATED_BLOGS_REQUEST:
      return {
        ...state,
        relatedLoading: true,
        relatedError: null,
      };

    case GET_RELATED_BLOGS_SUCCESS:
      return {
        ...state,
        relatedLoading: false,
        relatedBlogs: action.payload,
      };

    case GET_RELATED_BLOGS_FAILURE:
      return {
        ...state,
        relatedLoading: false,
        relatedError: action.payload,
      };

    default:
      return state;
  }
};

export default BlogDetailReducer;