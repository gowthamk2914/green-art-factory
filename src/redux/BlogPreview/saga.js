import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_BLOG_PREVIEW_REQUEST,
  getBlogPreviewSuccess,
  getBlogPreviewFailure,
} from "./actions";

function* getBlogPreviewSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/blog-preview`
    );

    yield put(
      getBlogPreviewSuccess(
        response.data.data || { categories: [], posts: [] }
      )
    );
  } catch (error) {
    yield put(
      getBlogPreviewFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* BlogPreviewSaga() {
  yield takeLatest(
    GET_BLOG_PREVIEW_REQUEST,
    getBlogPreviewSaga
  );
}