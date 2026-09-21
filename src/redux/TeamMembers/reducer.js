import {
  GET_TEAM_MEMBERS_REQUEST,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const TeamMembersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAM_MEMBERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_TEAM_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case GET_TEAM_MEMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default TeamMembersReducer;