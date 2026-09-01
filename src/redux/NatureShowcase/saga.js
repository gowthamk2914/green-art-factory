// redux/NatureShowcase/saga.js

import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_NATURE_SHOWCASE_REQUEST,
  getNatureShowcaseSuccess,
  getNatureShowcaseFailure,
} from "./actions";

function* getNatureShowcaseSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/v1/pages/products`
    );

    yield put(
      getNatureShowcaseSuccess(response.data.data || {})
    );
  } catch (error) {
    yield put(
      getNatureShowcaseFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* NatureShowcaseSaga() {
  yield takeLatest(
    GET_NATURE_SHOWCASE_REQUEST,
    getNatureShowcaseSaga
  );
}