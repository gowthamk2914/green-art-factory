
import axios from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { API_URL } from "../../utils/constants";

import {
  GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST,
  getProductDetailRelatedProductsSuccess,
  getProductDetailRelatedProductsFailure,
} from "./actions";

function* fetchRelatedProduct(item) {
  try {
    const url = `${API_URL}/v1/products/${encodeURIComponent(item.slug)}`;


    const response = yield call(axios.get, url);
    const product = response.data?.data ?? response.data;


    return {
      slug: item.slug,
      product,
    };
  } catch (error) {
    console.error(
      "Related product API failed:",
      item.slug,
      error.response?.data || error.message
    );

    return {
      slug: item.slug,
      product: null,
    };
  }
}

function* getProductDetailRelatedProductsSaga(action) {
  try {
    const items = action.payload?.items || [];
    const validItems = items.filter((item) => item?.slug);


    const results = yield all(
      validItems.map((item) => call(fetchRelatedProduct, item))
    );

    const productsBySlug = {};

    results.forEach(({ slug, product }) => {
      if (product) {
        productsBySlug[slug] = product;
      }
    });

    yield put(
      getProductDetailRelatedProductsSuccess(productsBySlug)
    );
  } catch (error) {
    console.error("Related products saga error:", error);

    yield put(
      getProductDetailRelatedProductsFailure(
        error.message || "Failed to load related products"
      )
    );
  }
}

export default function* ProductDetailRelatedProductsSaga() {
  yield takeLatest(
    GET_PRODUCT_DETAIL_RELATED_PRODUCTS_REQUEST,
    getProductDetailRelatedProductsSaga
  );
}
