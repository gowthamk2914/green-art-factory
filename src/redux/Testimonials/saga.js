import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_TESTIMONIALS_REQUEST,
  getTestimonialsSuccess,
  getTestimonialsFailure,
} from "./actions";

function* getTestimonialsSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/testimonials`
    );

    yield put(
      getTestimonialsSuccess(response.data.data || [])
    );
  } catch (error) {
    yield put(
      getTestimonialsFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* TestimonialsSaga() {
  yield takeLatest(
    GET_TESTIMONIALS_REQUEST,
    getTestimonialsSaga
  );
}