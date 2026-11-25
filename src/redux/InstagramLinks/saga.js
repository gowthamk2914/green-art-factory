import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_INSTAGRAM_LINKS_REQUEST,
  getInstagramLinksSuccess,
  getInstagramLinksFailure,
} from "./actions";

function* getInstagramLinksSaga() {
  try {
    const response = yield call(axios.get, `${API_URL}/v1/instagram-links`);
    yield put(getInstagramLinksSuccess(response.data));
  } catch (error) {
    yield put(
      getInstagramLinksFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* InstagramLinksSaga() {
  yield takeLatest(GET_INSTAGRAM_LINKS_REQUEST, getInstagramLinksSaga);
}