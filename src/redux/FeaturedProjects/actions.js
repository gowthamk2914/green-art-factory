export const GET_FEATURED_PROJECTS_REQUEST =
  "GET_FEATURED_PROJECTS_REQUEST";

export const GET_FEATURED_PROJECTS_SUCCESS =
  "GET_FEATURED_PROJECTS_SUCCESS";

export const GET_FEATURED_PROJECTS_FAILURE =
  "GET_FEATURED_PROJECTS_FAILURE";

export const getFeaturedProjectsRequest = () => ({
  type: GET_FEATURED_PROJECTS_REQUEST,
});

export const getFeaturedProjectsSuccess = (payload) => ({
  type: GET_FEATURED_PROJECTS_SUCCESS,
  payload,
});

export const getFeaturedProjectsFailure = (payload) => ({
  type: GET_FEATURED_PROJECTS_FAILURE,
  payload,
});