import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  SUBMIT_PROJECT_ENQUIRY_REQUEST,
  submitProjectEnquirySuccess,
  submitProjectEnquiryFailure,
} from "./actions";

function* submitProjectEnquirySaga(action) {
  try {
    const response = yield call(
      axios.post,
      `${API_URL}/project-enquiries`,
      action.payload
    );

    yield put(submitProjectEnquirySuccess(response.data));
  } catch (error) {
    yield put(
      submitProjectEnquiryFailure({
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || {},
      })
    );
  }
}

export default function* ProjectEnquirySaga() {
  yield takeLatest(SUBMIT_PROJECT_ENQUIRY_REQUEST, submitProjectEnquirySaga);
}