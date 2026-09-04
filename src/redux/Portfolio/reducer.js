import {
  GET_PORTFOLIO_PAGE_REQUEST,
  GET_PORTFOLIO_PAGE_SUCCESS,
  GET_PORTFOLIO_PAGE_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: null, // { section, filters: { categories, installation_types, locations, sectors }, projects }
  meta: null, // { current_page, last_page, per_page, total }
  error: null,
};

const PortfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PORTFOLIO_PAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PORTFOLIO_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        meta: action.payload.meta,
      };

    case GET_PORTFOLIO_PAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default PortfolioReducer;