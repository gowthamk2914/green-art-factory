
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_PRODUCT_DETAIL_REQUEST,
  getProductDetailSuccess,
  getProductDetailFailure,
} from "./actions";

function* getProductDetailSaga(action) {
  try {
    const { slug } = action.payload;

    if (!slug) {
      throw new Error("Product slug is required");
    }

    const url = `${API_URL}/v1/products/${slug}`;

    console.log("Fetching product detail:", url);

    const response = yield call(axios.get, url);

    console.log("Product detail API response:", response.data);

    const product = response.data?.data ?? response.data;

    if (!product) {
      throw new Error("Product data not found");
    }

    yield put(getProductDetailSuccess(product));
  } catch (error) {
    console.error(
      "Product detail API error:",
      error.response?.data || error.message
    );

    yield put(
      getProductDetailFailure(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to load product"
      )
    );
  }
}

export default function* ProductDetailSaga() {
  yield takeLatest(
    GET_PRODUCT_DETAIL_REQUEST,
    getProductDetailSaga
  );
}

