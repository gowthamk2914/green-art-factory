import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants"; // adjust if your constants file lives elsewhere

import {
  GET_BLOG_DETAIL_REQUEST,
  GET_RELATED_BLOGS_REQUEST,
  getBlogDetailSuccess,
  getBlogDetailFailure,
  getRelatedBlogsSuccess,
  getRelatedBlogsFailure,
} from "./actions";

// GET ${API_URL}/blog/{slug} -> single blog object
function* getBlogDetailSaga(action) {
  try {
    const { slug } = action.payload;

    const response = yield call(axios.get, `${API_URL}/blog/${slug}`);

    yield put(getBlogDetailSuccess(response.data.data || response.data));
  } catch (error) {
    yield put(
      getBlogDetailFailure(error.response?.data?.message || error.message)
    );
  }
}

// GET ${API_URL}/blog -> the `?category=` query param is not actually
// implemented server-side (it returns the full unfiltered list either
// way), so this fetches everything and filters by `blogs.slug` on the
// client instead. Excludes the current post and caps the result at 4.
// If the backend adds real category filtering later, just add
// `params: { category: categorySlug }` back to the axios call and drop
// the .filter on categorySlug below.
function* getRelatedBlogsSaga(action) {
  try {
    const { categorySlug, excludeSlug } = action.payload;

    const response = yield call(axios.get, `${API_URL}/blog`);

    const list = response.data.data || [];
    const related = list
      .filter((item) => item.slug !== excludeSlug)
      .filter((item) => !categorySlug || item.blogs?.slug === categorySlug)
      .slice(0, 4);

    yield put(getRelatedBlogsSuccess(related));
  } catch (error) {
    yield put(
      getRelatedBlogsFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* BlogDetailSaga() {
  yield takeLatest(GET_BLOG_DETAIL_REQUEST, getBlogDetailSaga);
  yield takeLatest(GET_RELATED_BLOGS_REQUEST, getRelatedBlogsSaga);
}