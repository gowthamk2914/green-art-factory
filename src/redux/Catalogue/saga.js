import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_CATALOGUES_REQUEST,
  getCataloguesSuccess,
  getCataloguesFailure,
} from "./actions";

function* getCataloguesSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/v1/pages/pdf-catalogues`
    );

    // API shape: { success: true, data: [...] }
    yield put(getCataloguesSuccess(response.data.data || []));
  } catch (error) {
    yield put(
      getCataloguesFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* CataloguesSaga() {
  yield takeLatest(GET_CATALOGUES_REQUEST, getCataloguesSaga);
}