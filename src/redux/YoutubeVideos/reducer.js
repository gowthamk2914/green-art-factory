import {
  GET_YOUTUBE_VIDEOS_REQUEST,
  GET_YOUTUBE_VIDEOS_SUCCESS,
  GET_YOUTUBE_VIDEOS_FAILURE,
} from "./actions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function YoutubeVideosReducer(state = initialState, action) {
  switch (action.type) {
    case GET_YOUTUBE_VIDEOS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_YOUTUBE_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        // API shape: { data: [ ...videos ] }
        data: Array.isArray(action.payload?.data) ? action.payload.data : [],
      };

    case GET_YOUTUBE_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}