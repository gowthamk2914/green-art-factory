import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_FEATURED_PROJECTS_REQUEST,
  getFeaturedProjectsSuccess,
  getFeaturedProjectsFailure,
} from "./actions";

function* getFeaturedProjectsSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/featured`
    );

    yield put(
      getFeaturedProjectsSuccess(response.data.data || [])
    );
  } catch (error) {
    yield put(
      getFeaturedProjectsFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

export default function* FeaturedProjectsSaga() {
  yield takeLatest(
    GET_FEATURED_PROJECTS_REQUEST,
    getFeaturedProjectsSaga
  );
}