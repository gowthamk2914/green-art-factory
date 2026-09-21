export const GET_TEAM_MEMBERS_REQUEST = "GET_TEAM_MEMBERS_REQUEST";
export const GET_TEAM_MEMBERS_SUCCESS = "GET_TEAM_MEMBERS_SUCCESS";
export const GET_TEAM_MEMBERS_FAILURE = "GET_TEAM_MEMBERS_FAILURE";

export const getTeamMembersRequest = () => ({
  type: GET_TEAM_MEMBERS_REQUEST,
});

export const getTeamMembersSuccess = (payload) => ({
  type: GET_TEAM_MEMBERS_SUCCESS,
  payload,
});

export const getTeamMembersFailure = (payload) => ({
  type: GET_TEAM_MEMBERS_FAILURE,
  payload,
});