import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants"; // adjust if your constants file lives elsewhere

import {
  GET_PORTFOLIO_PAGE_REQUEST,
  getPortfolioPageSuccess,
  getPortfolioPageFailure,
} from "./actions";

// GET ${API_URL}/pages/portfolio -> { data: { section, filters, projects }, meta }
// Both top-level keys (data + meta) are stored as-is, since ProjectsListing
// needs `meta.total` for the "Total projects (N)" count.
function* getPortfolioPageSaga() {
  try {
    const response = yield call(axios.get, `${API_URL}/v1/pages/portfolio`);

    yield put(getPortfolioPageSuccess(response.data));
  } catch (error) {
    yield put(
      getPortfolioPageFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* PortfolioSaga() {
  yield takeLatest(GET_PORTFOLIO_PAGE_REQUEST, getPortfolioPageSaga);
}