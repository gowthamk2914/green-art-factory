export const GET_YOUTUBE_VIDEOS_REQUEST = "GET_YOUTUBE_VIDEOS_REQUEST";
export const GET_YOUTUBE_VIDEOS_SUCCESS = "GET_YOUTUBE_VIDEOS_SUCCESS";
export const GET_YOUTUBE_VIDEOS_FAILURE = "GET_YOUTUBE_VIDEOS_FAILURE";

export const getYoutubeVideosRequest = () => ({
  type: GET_YOUTUBE_VIDEOS_REQUEST,
});

export const getYoutubeVideosSuccess = (payload) => ({
  type: GET_YOUTUBE_VIDEOS_SUCCESS,
  payload,
});

export const getYoutubeVideosFailure = (error) => ({
  type: GET_YOUTUBE_VIDEOS_FAILURE,
  payload: error,
});