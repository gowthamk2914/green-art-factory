export const GET_PROJECT_DETAIL_REQUEST = "GET_PROJECT_DETAIL_REQUEST";
export const GET_PROJECT_DETAIL_SUCCESS = "GET_PROJECT_DETAIL_SUCCESS";
export const GET_PROJECT_DETAIL_FAILURE = "GET_PROJECT_DETAIL_FAILURE";

// payload: the project slug, e.g. "corporate-elegance"
export const getProjectDetailRequest = (slug) => ({
  type: GET_PROJECT_DETAIL_REQUEST,
  payload: slug,
});

export const getProjectDetailSuccess = (payload) => ({
  type: GET_PROJECT_DETAIL_SUCCESS,
  payload,
});

export const getProjectDetailFailure = (payload) => ({
  type: GET_PROJECT_DETAIL_FAILURE,
  payload,
});