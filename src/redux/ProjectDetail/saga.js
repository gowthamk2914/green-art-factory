import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_PROJECT_DETAIL_REQUEST,
  getProjectDetailSuccess,
  getProjectDetailFailure,
} from "./actions";

function* getProjectDetailSaga(action) {
  try {
    const slug = action.payload;
    const response = yield call(axios.get, `${API_URL}/v1/projects/${slug}`);

    // API shape: { data: { ...project } }
    yield put(getProjectDetailSuccess(response.data.data));
  } catch (error) {
    yield put(
      getProjectDetailFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* ProjectDetailSaga() {
  // takeLatest cancels any in-flight request for a previous slug if the
  // user navigates to a new project before the first one resolves.
  yield takeLatest(GET_PROJECT_DETAIL_REQUEST, getProjectDetailSaga);
}