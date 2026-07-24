// redux/NatureShowcase/actions.js

export const GET_NATURE_SHOWCASE_REQUEST =
  "GET_NATURE_SHOWCASE_REQUEST";

export const GET_NATURE_SHOWCASE_SUCCESS =
  "GET_NATURE_SHOWCASE_SUCCESS";

export const GET_NATURE_SHOWCASE_FAILURE =
  "GET_NATURE_SHOWCASE_FAILURE";

export const getNatureShowcaseRequest = () => ({
  type: GET_NATURE_SHOWCASE_REQUEST,
});

export const getNatureShowcaseSuccess = (payload) => ({
  type: GET_NATURE_SHOWCASE_SUCCESS,
  payload,
});

export const getNatureShowcaseFailure = (payload) => ({
  type: GET_NATURE_SHOWCASE_FAILURE,
  payload,
});