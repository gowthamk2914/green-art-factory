export const GET_PORTFOLIO_PAGE_REQUEST = "GET_PORTFOLIO_PAGE_REQUEST";
export const GET_PORTFOLIO_PAGE_SUCCESS = "GET_PORTFOLIO_PAGE_SUCCESS";
export const GET_PORTFOLIO_PAGE_FAILURE = "GET_PORTFOLIO_PAGE_FAILURE";

// GET /pages/portfolio takes no params — it's a single static page endpoint
// that returns everything both PortfolioBanner and ProjectsListing need
// (section copy, filter option lists, and the current page of projects).
export const getPortfolioPageRequest = () => ({
  type: GET_PORTFOLIO_PAGE_REQUEST,
});

export const getPortfolioPageSuccess = (payload) => ({
  type: GET_PORTFOLIO_PAGE_SUCCESS,
  payload,
});

export const getPortfolioPageFailure = (payload) => ({
  type: GET_PORTFOLIO_PAGE_FAILURE,
  payload,
});