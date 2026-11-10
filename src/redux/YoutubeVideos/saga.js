import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_YOUTUBE_VIDEOS_REQUEST,
  getYoutubeVideosSuccess,
  getYoutubeVideosFailure,
} from "./actions";

// GET ${API_URL}/v1/youtube-videos -> { data: [ { id, video_id, embed_url, ... } ] }
function* getYoutubeVideosSaga() {
  try {
    const response = yield call(axios.get, `${API_URL}/v1/youtube-videos`);
    yield put(getYoutubeVideosSuccess(response.data));
  } catch (error) {
    yield put(
      getYoutubeVideosFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* YoutubeVideosSaga() {
  yield takeLatest(GET_YOUTUBE_VIDEOS_REQUEST, getYoutubeVideosSaga);
}