import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { API_URL } from "../../../src/utils/constants";

import {
  GET_PRODUCTS_PREVIEW_REQUEST,
  getProductsPreviewSuccess,
  getProductsPreviewFailure,
} from "./actions";


function* getProductsPreviewSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/products-preview`
    );

    yield put(
      getProductsPreviewSuccess(response.data.data || [])
    );
  } catch (error) {
    yield put(
      getProductsPreviewFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* ProductsSaga() {
  yield takeLatest(
    GET_PRODUCTS_PREVIEW_REQUEST,
    getProductsPreviewSaga
  );
}