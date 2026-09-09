import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants"; // adjust path if needed

import {
  GET_GALLERY_REQUEST,
  getGallerySuccess,
  getGalleryFailure,
} from "./actions";

// GET ${API_URL}/v1/products/:slug -> { data: { ...product, variants: [...] } }
// Same endpoint ProductDetail uses, but stored under its own "Gallery"
// slice so the two pages never overwrite each other's cached data.
function* getGallerySaga(action) {
  try {
    const { productSlug } = action.payload;
    const response = yield call(axios.get, `${API_URL}/v1/products/${productSlug}`);
    yield put(getGallerySuccess(response.data, productSlug));
  } catch (error) {
    yield put(
      getGalleryFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* GallerySaga() {
  yield takeLatest(GET_GALLERY_REQUEST, getGallerySaga);
}