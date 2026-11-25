import {
  GET_INSTAGRAM_LINKS_REQUEST,
  GET_INSTAGRAM_LINKS_SUCCESS,
  GET_INSTAGRAM_LINKS_FAILURE,
} from "./actions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function InstagramLinksReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INSTAGRAM_LINKS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_INSTAGRAM_LINKS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: Array.isArray(action.payload?.data) ? action.payload.data : [],
      };

    case GET_INSTAGRAM_LINKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}