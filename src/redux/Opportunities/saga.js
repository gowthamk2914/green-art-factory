import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_CAREERS_REQUEST,
  getCareersSuccess,
  getCareersFailure,
} from "./actions";

function* getCareersSaga() {
  try {
    const response = yield call(axios.get, `${API_URL}/careers`);

    yield put(getCareersSuccess(response.data.data || []));
  } catch (error) {
    yield put(
      getCareersFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* CareersSaga() {
  yield takeLatest(GET_CAREERS_REQUEST, getCareersSaga);
}