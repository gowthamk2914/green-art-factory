import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  SUBMIT_ENQUIRY_REQUEST,
  submitEnquirySuccess,
  submitEnquiryFailure,
} from "./actions";

function* submitEnquirySaga(action) {
  try {
    const response = yield call(
      axios.post,
      `${API_URL}/contact-enquiries`,
      action.payload
    );

    yield put(submitEnquirySuccess(response.data));
  } catch (error) {
    // Laravel-style validation error shape:
    // { message: "...", errors: { field: ["..."] } }
    yield put(
      submitEnquiryFailure({
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || {},
      })
    );
  }
}

export default function* ContactSaga() {
  yield takeLatest(SUBMIT_ENQUIRY_REQUEST, submitEnquirySaga);
}