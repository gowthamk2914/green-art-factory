export const GET_BLOG_PREVIEW_REQUEST = "GET_BLOG_PREVIEW_REQUEST";
export const GET_BLOG_PREVIEW_SUCCESS = "GET_BLOG_PREVIEW_SUCCESS";
export const GET_BLOG_PREVIEW_FAILURE = "GET_BLOG_PREVIEW_FAILURE";

export const getBlogPreviewRequest = () => ({
  type: GET_BLOG_PREVIEW_REQUEST,
});

export const getBlogPreviewSuccess = (payload) => ({
  type: GET_BLOG_PREVIEW_SUCCESS,
  payload,
});

export const getBlogPreviewFailure = (payload) => ({
  type: GET_BLOG_PREVIEW_FAILURE,
  payload,
});