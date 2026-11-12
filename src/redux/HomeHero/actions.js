export const GET_HOME_HERO_REQUEST = "GET_HOME_HERO_REQUEST";
export const GET_HOME_HERO_SUCCESS = "GET_HOME_HERO_SUCCESS";
export const GET_HOME_HERO_FAILURE = "GET_HOME_HERO_FAILURE";

export const getHomeHeroRequest = () => ({
  type: GET_HOME_HERO_REQUEST,
});

export const getHomeHeroSuccess = (payload) => ({
  type: GET_HOME_HERO_SUCCESS,
  payload,
});

export const getHomeHeroFailure = (error) => ({
  type: GET_HOME_HERO_FAILURE,
  payload: error,
});