import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  SUBMIT_APPLICATION_REQUEST,
  submitApplicationSuccess,
  submitApplicationFailure,
} from "./actions";

function* submitApplicationSaga(action) {
  try {
    // action.payload is a FormData instance; axios sets the correct
    // multipart/form-data boundary header automatically for FormData.
    const response = yield call(
      axios.post,
      `${API_URL}/career-applications`,
      action.payload
    );

    yield put(submitApplicationSuccess(response.data));
  } catch (error) {
    // Laravel-style validation error shape:
    // { message: "...", errors: { field: ["..."] } }
    yield put(
      submitApplicationFailure({
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || {},
      })
    );
  }
}

export default function* ApplyFormSaga() {
  yield takeLatest(SUBMIT_APPLICATION_REQUEST, submitApplicationSaga);
}