import {
  GET_HOME_HERO_REQUEST,
  GET_HOME_HERO_SUCCESS,
  GET_HOME_HERO_FAILURE,
} from "./actions";

const initialState = {
  data: [],
  loading: true,
  error: null,
};

export default function HomeHeroReducer(state = initialState, action) {
  switch (action.type) {
    case GET_HOME_HERO_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_HOME_HERO_SUCCESS:
      return {
        ...state,
        loading: false,
        // API shape: { data: [ ...slides ] }
        data: Array.isArray(action.payload?.data) ? action.payload.data : [],
      };

    case GET_HOME_HERO_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}